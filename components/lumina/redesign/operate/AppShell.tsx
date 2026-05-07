'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAccount, useChainId, useDisconnect, useReadContract, useSwitchChain } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'
import { erc20Abi, formatUnits } from 'viem'
import { LogOut } from 'lucide-react'
import { TOKENS } from '@/lib/lumina-config'
import { useContracts } from '@/hooks/use-contracts'

type Role = 'human' | 'agent'

const HUMAN_LINKS = [
  { href: '/app/human/products', label: 'Products', glyph: '◇' },
  { href: '/app/human/portfolio', label: 'Portfolio', glyph: '◈' },
  { href: '/app/human/marketplace', label: 'Marketplace', glyph: '◉' },
] as const

const AGENT_LINKS = [
  { href: '/app/agent/dashboard', label: 'Dashboard', glyph: '◇' },
  { href: '/app/agent/policies', label: 'Policies', glyph: '◆' },
  { href: '/app/agent/bonds', label: 'Bonds', glyph: '◈' },
  { href: '/app/agent/marketplace', label: 'Marketplace', glyph: '◉' },
  { href: '/app/agent/earnings', label: 'Earnings', glyph: '$' },
  { href: '/app/agent/activity', label: 'Activity', glyph: '~' },
  { href: '/app/agent/webhooks', label: 'Webhooks', glyph: '→' },
  { href: '/app/agent/api-keys', label: 'API Keys', glyph: '◍' },
] as const

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const { switchChain } = useSwitchChain()

  const wrongChain = isConnected && chainId !== baseSepolia.id
  const links = role === 'agent' ? AGENT_LINKS : HUMAN_LINKS
  const { data: contracts } = useContracts()

  const { data: usdcRaw } = useReadContract({
    address: TOKENS.USDC.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !wrongChain },
  })
  const { data: luminaRaw } = useReadContract({
    address: contracts?.luminaToken,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !wrongChain && !!contracts },
  })

  const usdc = usdcRaw
    ? Number(formatUnits(usdcRaw as bigint, 6)).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00'
  const lumina = luminaRaw
    ? Number(formatUnits(luminaRaw as bigint, 18)).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    : '0'
  const truncAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''

  return (
    <div className="rd-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sepolia banner — always visible on /app/* */}
      <div
        style={{
          background: '#3a2a0a',
          borderBottom: '1px solid color-mix(in oklab, var(--rd-warn) 33%, transparent)',
          padding: '6px 20px',
          fontSize: 11,
          fontFamily: 'var(--font-jetbrains), monospace',
          color: 'var(--rd-warn)',
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        ⚠ BASE SEPOLIA TESTNET · CHAIN 84532 · NO REAL FUNDS · USE TEST USDC ONLY
      </div>

      {/* Wrong-chain banner — only when connected to wrong chain */}
      {wrongChain && (
        <div
          style={{
            background: '#3a0a0a',
            borderBottom: '1px solid color-mix(in oklab, var(--rd-neg) 33%, transparent)',
            padding: '8px 20px',
            fontSize: 12,
            fontFamily: 'var(--font-jetbrains), monospace',
            color: 'var(--rd-neg)',
            letterSpacing: '0.04em',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span>
            ⚠ WRONG NETWORK (chain {chainId}) — Lumina runs on Base Sepolia (84532)
          </span>
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            style={{
              padding: '4px 12px',
              background: 'var(--rd-neg)',
              color: '#000',
              border: 0,
              borderRadius: 4,
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            SWITCH NETWORK
          </button>
        </div>
      )}

      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderBottom: '1px solid var(--rd-line)',
          background: 'var(--rd-bg-2)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--rd-text)',
              fontSize: 15,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                background: 'var(--rd-accent)',
                display: 'inline-block',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 50%, 0 100%)',
              }}
            />
            LUMINA{' '}
            <span style={{ color: 'var(--rd-text-3)', fontWeight: 400, fontSize: 12 }}>
              · OPERATE
            </span>
          </Link>
          <RolePill role={role} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, flexWrap: 'wrap' }}>
          <ChainPill chainId={chainId} wrongChain={wrongChain} />

          {isConnected && (
            <div
              style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                color: 'var(--rd-text-3)',
                fontSize: 11,
              }}
            >
              <span style={{ color: 'var(--rd-text-2)' }}>{usdc}</span> USDC ·{' '}
              <span style={{ color: 'var(--rd-accent)' }}>{lumina}</span> LUMINA
            </div>
          )}

          {isConnected ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                title={address ?? ''}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  background: 'var(--rd-surface)',
                  border: '1px solid var(--rd-line-strong)',
                  borderRadius: 6,
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 11,
                  color: 'var(--rd-text)',
                  cursor: 'default',
                  userSelect: 'all',
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00d4ff, #f472b6)',
                  }}
                />
                {truncAddr}
              </div>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.confirm('Disconnect wallet?')) {
                    disconnect()
                  }
                }}
                title="Disconnect wallet"
                aria-label="Disconnect wallet"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                  background: 'var(--rd-surface)',
                  border: '1px solid var(--rd-line-strong)',
                  borderRadius: 6,
                  color: 'var(--rd-text-3)',
                  cursor: 'pointer',
                  transition: 'color .15s, border-color .15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--rd-neg)'
                  e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--rd-neg) 50%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--rd-text-3)'
                  e.currentTarget.style.borderColor = 'var(--rd-line-strong)'
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openConnectModal?.()}
              style={{
                padding: '6px 14px',
                background: 'var(--rd-accent)',
                color: '#00121a',
                border: 0,
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'var(--font-inter), sans-serif',
              }}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <nav
          style={{
            width: 200,
            background: 'var(--rd-bg-2)',
            borderRight: '1px solid var(--rd-line)',
            padding: '20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flexShrink: 0,
          }}
          className="rd-operate-sidebar"
        >
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 10,
              letterSpacing: '0.1em',
              color: 'var(--rd-text-4)',
              padding: '8px 10px',
            }}
          >
            {role === 'agent' ? 'AGENT VIEW' : 'OPERATE'}
          </div>
          {links.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  color: active ? 'var(--rd-accent)' : 'var(--rd-text-2)',
                  background: active ? 'var(--rd-accent-dim)' : 'transparent',
                  borderLeft: `2px solid ${active ? 'var(--rd-accent)' : 'transparent'}`,
                  fontWeight: active ? 500 : 400,
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: 11, opacity: 0.6 }}>{l.glyph}</span> {l.label}
              </Link>
            )
          })}
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: 9,
              color: 'var(--rd-text-4)',
              padding: '8px 10px',
              borderTop: '1px solid var(--rd-line)',
              lineHeight: 1.5,
            }}
          >
            v5.1 · BASE SEPOLIA
            <br />
            <Link href="/" style={{ color: 'var(--rd-text-3)' }}>
              ← Back to lumina-org.com
            </Link>
          </div>
        </nav>

        <main style={{ flex: 1, overflow: 'auto', background: 'var(--rd-bg)' }}>{children}</main>
      </div>
    </div>
  )
}

function RolePill({ role }: { role: Role }) {
  const isAgent = role === 'agent'
  const color = isAgent ? 'var(--rd-warn)' : 'var(--rd-accent)'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 4,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.06em',
        color,
        background: isAgent ? 'rgba(245, 158, 11, 0.1)' : 'var(--rd-accent-dim)',
        border: `1px solid ${isAgent ? 'rgba(245, 158, 11, 0.33)' : 'var(--rd-accent-border)'}`,
        textTransform: 'uppercase',
      }}
    >
      {isAgent ? '◉ AGENT SUPERVISOR' : '◇ HUMAN'}
    </span>
  )
}

function ChainPill({ chainId, wrongChain }: { chainId: number; wrongChain: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 6,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: wrongChain ? 'var(--rd-neg)' : 'var(--rd-pos)',
        }}
      />
      <span
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: wrongChain ? 'var(--rd-neg)' : 'var(--rd-text-2)',
        }}
      >
        {wrongChain ? `WRONG (${chainId})` : 'BASE SEPOLIA'}
      </span>
    </div>
  )
}
