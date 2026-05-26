// Public Base Sepolia RPCs (https://sepolia.base.org and the Alchemy free tier)
// reject eth_getLogs windows that span too many blocks with HTTP 413 ("payload
// too large") or block-range errors. This helper splits the requested range
// into bounded chunks, retries with a smaller window on size errors, and
// concatenates the results so callers can keep their existing API shape.

import type { Address, Log, PublicClient } from 'viem'

const DEFAULT_CHUNK_SIZE = 5_000n
const RETRY_CHUNK_SIZE = 1_000n
const PER_CHUNK_TIMEOUT_MS = 30_000
// [perf] Chunks were scanned strictly sequentially — a ~340k-block range at 5k
// chunks is ~68 serial eth_getLogs round-trips on the user's wallet RPC, which is
// what made marketplace/portfolio "tardar muchísimo". We now run chunks in
// bounded-concurrency batches (same calls, issued in parallel). Bounded to keep
// under typical public-RPC rate limits.
const CHUNK_CONCURRENCY = 8

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })
  return Promise.race([p, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  }) as Promise<T>
}

export interface GetLogsChunkedParams<TEvent = unknown, TArgs = unknown> {
  client: PublicClient
  address: Address | Address[]
  fromBlock: bigint
  toBlock: bigint
  /** A viem `parseAbiItem` event or `events: [...]` is forwarded as-is. */
  event?: TEvent
  events?: readonly TEvent[]
  args?: TArgs
  /** Override chunk size (in blocks). Defaults to 5,000. */
  chunkSize?: bigint
  /** Optional progress callback — useful for surfacing "(2/8 chunks)" in UI. */
  onProgress?: (info: { fetched: number; total: number; logsSoFar: number }) => void
}

function isPayloadTooLarge(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const e = err as Record<string, unknown> & { cause?: Record<string, unknown> }
  if (e.status === 413) return true
  if (e.cause && typeof e.cause === 'object' && (e.cause as { status?: number }).status === 413) {
    return true
  }
  const msg = String((e.message ?? '') + ' ' + (e.cause as { message?: string } | undefined)?.message ?? '')
  return /413|too large|range is too wide|exceed.*block/i.test(msg)
}

export async function getLogsChunked<TEvent, TArgs>(
  params: GetLogsChunkedParams<TEvent, TArgs>,
): Promise<Log[]> {
  const {
    client,
    address,
    fromBlock,
    toBlock,
    event,
    events,
    args,
    chunkSize = DEFAULT_CHUNK_SIZE,
    onProgress,
  } = params

  if (toBlock < fromBlock) return []

  // Build all chunk ranges up front.
  const ranges: Array<[bigint, bigint]> = []
  for (let cursor = fromBlock; cursor <= toBlock; cursor += chunkSize) {
    const end = cursor + chunkSize - 1n
    ranges.push([cursor, end > toBlock ? toBlock : end])
  }
  const totalChunks = Math.max(1, ranges.length)
  let fetchedChunks = 0
  const allLogs: Log[] = []

  // Fetch one chunk, preserving the "payload too large → smaller sub-window" retry.
  const fetchChunk = async ([from, to]: [bigint, bigint]): Promise<Log[]> => {
    try {
      const logs = await withTimeout(
        client.getLogs({
          address,
          fromBlock: from,
          toBlock: to,
          ...(event ? { event } : {}),
          ...(events ? { events } : {}),
          ...(args ? { args } : {}),
        } as Parameters<PublicClient['getLogs']>[0]),
        PER_CHUNK_TIMEOUT_MS,
        `eth_getLogs ${from}-${to}`,
      )
      return logs as Log[]
    } catch (err) {
      if (isPayloadTooLarge(err) && chunkSize > RETRY_CHUNK_SIZE) {
        return await getLogsChunked({
          ...params,
          fromBlock: from,
          toBlock: to,
          chunkSize: RETRY_CHUNK_SIZE,
          onProgress: undefined,
        })
      }
      throw err
    }
  }

  // Run chunks in bounded-concurrency batches (was strictly sequential).
  for (let i = 0; i < ranges.length; i += CHUNK_CONCURRENCY) {
    const batch = ranges.slice(i, i + CHUNK_CONCURRENCY)
    const results = await Promise.all(batch.map(fetchChunk))
    for (const r of results) allLogs.push(...r)
    fetchedChunks += batch.length
    onProgress?.({ fetched: fetchedChunks, total: totalChunks, logsSoFar: allLogs.length })
  }

  return allLogs
}
