// lib/wallet.ts
// ════════════════════════════════════════════════════════════
// LUMINA PROTOCOL — Shared Wallet Module (audited version)
// tryAutoConnect = SILENT (eth_accounts, no popup)
// connectWallet = PROACTIVE (eth_requestAccounts, opens popup) — ONLY on onClick
// ════════════════════════════════════════════════════════════

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      providers?: unknown[];
      request: (args: { method: string; params?: unknown[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

export const BASE_CHAIN_ID = '0x2105';

export const getStoredWallet = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lumina_wallet');
};

const setStoredWallet = (address: string | null) => {
  if (typeof window === 'undefined') return;
  if (address) {
    localStorage.setItem('lumina_wallet', address);
  } else {
    localStorage.removeItem('lumina_wallet');
  }
};

// SILENT: No popup. Used on page load for auto-reconnect.
export const tryAutoConnect = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !window.ethereum) return null;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });

    if (accounts && accounts.length > 0) {
      const address = accounts[0].toLowerCase();
      setStoredWallet(address);
      return address;
    }

    setStoredWallet(null);
    return null;
  } catch (error) {
    console.error('[Lumina] Silent reconnection failed:', error);
    return null;
  }
};

// PROACTIVE: Opens wallet popup. ONLY call from onClick handlers.
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  if (!window.ethereum) {
    alert('No Web3 wallet detected. Please install MetaMask, Phantom, or Coinbase Wallet.');
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) return null;

    const address = accounts[0].toLowerCase();
    await ensureBaseNetwork();
    setStoredWallet(address);
    return address;
  } catch (error: any) {
    if (error.code === 4001) {
      console.log('[Lumina] User rejected connection.');
    }
    return null;
  }
};

export const disconnectWallet = () => {
  setStoredWallet(null);
};

export const ensureBaseNetwork = async () => {
  if (typeof window === 'undefined' || !window.ethereum) return;
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId === BASE_CHAIN_ID) return;

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }],
    });
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: BASE_CHAIN_ID,
          chainName: 'Base Mainnet',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org'],
        }],
      });
    }
  }
};

export const setupWalletListeners = (onAccountChange: (addr: string | null) => void) => {
  if (typeof window === 'undefined' || !window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length > 0) {
      const addr = accounts[0].toLowerCase();
      setStoredWallet(addr);
      onAccountChange(addr);
    } else {
      setStoredWallet(null);
      onAccountChange(null);
    }
  });

  window.ethereum.on('chainChanged', () => {
    // Re-check wallet silently on chain change
    tryAutoConnect().then(addr => onAccountChange(addr));
  });
};

export const truncateAddress = (addr: string): string => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};
