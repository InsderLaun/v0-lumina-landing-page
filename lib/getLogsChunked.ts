// Public Base Sepolia RPCs (https://sepolia.base.org and the Alchemy free tier)
// reject eth_getLogs windows that span too many blocks with HTTP 413 ("payload
// too large") or block-range errors. This helper splits the requested range
// into bounded chunks, retries with a smaller window on size errors, and
// concatenates the results so callers can keep their existing API shape.

import type { Address, Log, PublicClient } from 'viem'

const DEFAULT_CHUNK_SIZE = 5_000n
const RETRY_CHUNK_SIZE = 1_000n
const PER_CHUNK_TIMEOUT_MS = 30_000

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

  const allLogs: Log[] = []
  let cursor = fromBlock
  const totalChunks = Math.max(
    1,
    Number(((toBlock - fromBlock + chunkSize) / chunkSize).toString()),
  )
  let fetchedChunks = 0

  while (cursor <= toBlock) {
    const proposedEnd = cursor + chunkSize - 1n
    const chunkEnd = proposedEnd > toBlock ? toBlock : proposedEnd

    try {
      const logs = await withTimeout(
        client.getLogs({
          address,
          fromBlock: cursor,
          toBlock: chunkEnd,
          ...(event ? { event } : {}),
          ...(events ? { events } : {}),
          ...(args ? { args } : {}),
        } as Parameters<PublicClient['getLogs']>[0]),
        PER_CHUNK_TIMEOUT_MS,
        `eth_getLogs ${cursor}-${chunkEnd}`,
      )
      allLogs.push(...(logs as Log[]))
    } catch (err) {
      if (isPayloadTooLarge(err) && chunkSize > RETRY_CHUNK_SIZE) {
        const subLogs = await getLogsChunked({
          ...params,
          fromBlock: cursor,
          toBlock: chunkEnd,
          chunkSize: RETRY_CHUNK_SIZE,
          onProgress: undefined,
        })
        allLogs.push(...subLogs)
      } else {
        throw err
      }
    }

    fetchedChunks += 1
    onProgress?.({ fetched: fetchedChunks, total: totalChunks, logsSoFar: allLogs.length })
    cursor = chunkEnd + 1n
  }

  return allLogs
}
