// lib/wallet.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — Shared Wallet Module
// Supports ALL wallets that inject window.ethereum (MetaMask, Phantom, Coinbase, etc.)
// State persisted in localStorage for cross-page sharing.
// ════════════════════════════════════════════════════════════

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      providers?: unknown[];
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

const BASE_CHAIN_ID = '0x2105'
const STORAGE_KEY = 'lumina_wallet'

export function isWalletAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  if (!window.ethereum) {
    alert('No wallet detected. Please install MetaMask, Phantom, or Coinbase Wallet.')
    window.open('https://metamask.io', '_blank')
    return null
  }

  try {
    // Request accounts — browser shows wallet selector if multiple wallets installed
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
    if (!accounts || accounts.length === 0) return null

    // Verify/switch to Base network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string
    if (chainId !== BASE_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_CHAIN_ID }],
        })
      } catch (switchError: unknown) {
        const err = switchError as { code?: number }
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BASE_CHAIN_ID,
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          })
        } else {
          alert('Please switch to Base network to use Lumina Protocol')
          return null
        }
      }
    }

    // Persist
    localStorage.setItem(STORAGE_KEY, accounts[0])
    return accounts[0]
  } catch (err: unknown) {
    const error = err as { code?: number }
    if (error.code === 4001) {
      // User rejected — silent
      return null
    }
    console.error('Wallet connection error:', err)
    alert('Connection failed. Please try again.')
    return null
  }
}

export function getStoredWallet(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function disconnectWallet(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export async function tryAutoConnect(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const stored = getStoredWallet()
  if (!stored || !window.ethereum) return null

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[]
    const found = accounts.find(a => a.toLowerCase() === stored.toLowerCase())
    if (found) return found
  } catch {
    // Silent fail
  }

  localStorage.removeItem(STORAGE_KEY)
  return null
}

export function truncateAddress(addr: string): string {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (typeof window === 'undefined' || !window.ethereum) return () => {}
  const handler = (...args: unknown[]) => callback(args[0] as string[])
  window.ethereum.on('accountsChanged', handler)
  return () => window.ethereum?.removeListener('accountsChanged', handler)
}

export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (typeof window === 'undefined' || !window.ethereum) return () => {}
  const handler = (...args: unknown[]) => callback(args[0] as string)
  window.ethereum.on('chainChanged', handler)
  return () => window.ethereum?.removeListener('chainChanged', handler)
}
