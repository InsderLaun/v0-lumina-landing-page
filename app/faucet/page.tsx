"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LUMINA_API_URL } from "@/lib/lumina-config";

/**
 * Sprint L — Lumina testnet faucet page.
 *
 * Standalone (no wallet connection required). Sends a POST to
 * `${LUMINA_API_URL}/api/v1/faucet/claim` with the wallet typed by
 * the user; the API enforces 1 claim/24h per wallet + per IP.
 *
 * Mirrors the /connect page's visual style (own back-link header,
 * dark card on near-black background, no shadcn/ui dep).
 */

const ETH_AMOUNT = "0.05";
const USDC_AMOUNT = "100";

const WALLET_REGEX = /^0x[0-9a-fA-F]{40}$/;

interface FaucetStatus {
  relayerEthBalance: string;
  relayerUsdcBalance: string;
  claimsLast24h: number;
  dailyCap: number;
  enabled: boolean;
}

interface ClaimSuccess {
  success: true;
  ethTxHash: string;
  usdcTxHash: string;
  ethAmount: string;
  usdcAmount: string;
}

interface ClaimError {
  error: string;
  message: string;
}

type ClaimState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; data: ClaimSuccess }
  | { kind: "error"; message: string };

export default function FaucetPage() {
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState<FaucetStatus | null>(null);
  const [claimState, setClaimState] = useState<ClaimState>({ kind: "idle" });

  const walletValid = WALLET_REGEX.test(wallet.trim());
  const submitting = claimState.kind === "submitting";

  // Poll status every 30s. Lightweight — server handler is a single
  // ETH balance + ERC20 balanceOf + COUNT(*) read.
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const r = await fetch(`${LUMINA_API_URL}/api/v1/faucet/status`, {
          cache: "no-store",
        });
        if (!r.ok) return;
        const data = (await r.json()) as FaucetStatus;
        if (mounted) setStatus(data);
      } catch {
        // Silent — status is informational; the claim button itself
        // surfaces the real error if a request fails.
      }
    };
    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const submitClaim = async () => {
    if (!walletValid) return;
    setClaimState({ kind: "submitting" });
    try {
      const r = await fetch(`${LUMINA_API_URL}/api/v1/faucet/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: wallet.trim() }),
      });
      const body = (await r.json()) as ClaimSuccess | ClaimError;
      if (!r.ok) {
        const e = body as ClaimError;
        setClaimState({ kind: "error", message: mapErrorMessage(r.status, e) });
        return;
      }
      setClaimState({ kind: "success", data: body as ClaimSuccess });
    } catch {
      setClaimState({
        kind: "error",
        message: "Connection error. Try again in a moment.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <header className="border-b border-white/5 px-6 h-16 flex items-center">
        <Link
          href="/"
          className="text-white/40 hover:text-white transition-colors text-lg px-2 py-1 rounded hover:bg-white/5"
        >
          ← Back
        </Link>
        <span className="ml-4 text-sm font-bold">
          <span className="text-cyan-400">LUMINA</span>
          <span className="text-white/20"> · </span>
          <span className="text-purple-400">Faucet</span>
        </span>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">💧</div>
            <h1 className="text-2xl font-bold mb-2">Lumina Testnet Faucet</h1>
            <p className="text-white/50 text-sm">
              {USDC_AMOUNT} mock USDC + {ETH_AMOUNT} Sepolia ETH per claim
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-6">
            <label
              htmlFor="wallet"
              className="block text-xs uppercase tracking-wider text-white/40 mb-2"
            >
              Recipient wallet
            </label>
            <input
              id="wallet"
              type="text"
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              placeholder="0x…"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              disabled={submitting}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50 disabled:opacity-50"
            />
            {wallet && !walletValid && (
              <p className="mt-2 text-xs text-red-400/80">
                Must be a valid 0x-prefixed 40-character address.
              </p>
            )}

            <button
              type="button"
              onClick={submitClaim}
              disabled={!walletValid || submitting}
              className="mt-4 w-full rounded-lg bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Sending…" : "Claim"}
            </button>
          </div>

          {claimState.kind === "success" && (
            <div className="bg-green-500/[0.06] border border-green-500/30 rounded-xl p-5 mb-6 text-sm">
              <div className="font-semibold text-green-300 mb-3">
                Sent — check your wallet shortly.
              </div>
              <div className="space-y-2 text-white/70">
                <TxRow
                  label={`USDC ${claimState.data.usdcAmount}`}
                  hash={claimState.data.usdcTxHash}
                />
                <TxRow
                  label={`ETH ${claimState.data.ethAmount}`}
                  hash={claimState.data.ethTxHash}
                />
              </div>
            </div>
          )}

          {claimState.kind === "error" && (
            <div className="bg-red-500/[0.06] border border-red-500/30 rounded-xl p-5 mb-6 text-sm text-red-200/90">
              {claimState.message}
            </div>
          )}

          {status && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 uppercase tracking-wider">
                  Faucet status
                </span>
                <span
                  className={
                    status.enabled
                      ? "text-green-400"
                      : "text-yellow-400"
                  }
                >
                  {status.enabled ? "● Online" : "● Paused"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-white/60">
                <span>Relayer ETH</span>
                <span className="font-mono text-right text-white/80">
                  {Number(status.relayerEthBalance).toFixed(3)}
                </span>
                <span>Relayer USDC</span>
                <span className="font-mono text-right text-white/80">
                  {status.relayerUsdcBalance}
                </span>
                <span>Claims today</span>
                <span className="font-mono text-right text-white/80">
                  {status.claimsLast24h} / {status.dailyCap}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function mapErrorMessage(status: number, body: ClaimError): string {
  if (status === 400) return body.message ?? "Invalid wallet address.";
  if (status === 429) return body.message ?? "Already claimed in last 24h.";
  if (status === 503) {
    if (body.error === "out_of_eth" || body.error === "out_of_usdc") {
      return "Faucet temporarily out of funds. Contact team.";
    }
    if (body.error === "daily_cap_reached") {
      return body.message ?? "Daily limit reached. Try again tomorrow.";
    }
    return body.message ?? "Faucet temporarily unavailable.";
  }
  return body.message ?? `Unexpected error (HTTP ${status}).`;
}

function TxRow({ label, hash }: { label: string; hash: string }) {
  // Truncate the hash for display: 0x12ab…cd34
  const short = `${hash.slice(0, 6)}…${hash.slice(-4)}`;
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/50">{label}</span>
      <a
        href={`https://sepolia.basescan.org/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
        title={hash}
      >
        {short} ↗
      </a>
    </div>
  );
}
