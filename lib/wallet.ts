// lib/wallet.ts — Lumina Protocol Wallet Module
// eth_accounts = silencioso. eth_requestAccounts = popup (solo onClick en tutorial).

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const BASE_CHAIN_ID = '0x2105';

// ── Storage ──
export const getStoredWallet = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lumina_wallet');
};

const setStoredWallet = (address: string | null) => {
  if (typeof window === 'undefined') return;
  if (address) {
    localStorage.setItem('lumina_wallet', address.toLowerCase());
  } else {
    localStorage.removeItem('lumina_wallet');
  }
};

// ── Onboarding flag ──
export const isOnboardingComplete = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('lumina_onboarding_done') === 'true';
};

export const setOnboardingComplete = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lumina_onboarding_done', 'true');
};

export const clearOnboarding = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lumina_onboarding_done');
};

// ── SILENCIOSO: No abre popup. Solo para auto-reconnect. ──
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

// ── PROACTIVO: Abre popup. SOLO llamar en onClick del tutorial/dashboard. ──
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
    // Save wallet immediately — network switch is best-effort
    setStoredWallet(address);
    try {
      await ensureBaseNetwork();
    } catch (e) {
      console.warn('[Lumina] Network switch failed, continuing anyway:', e);
    }
    return address;
  } catch (error: any) {
    if (error.code === 4001) console.log('[Lumina] User rejected connection.');
    return null;
  }
};

// ── Disconnect: limpia TODO ──
export const disconnectWallet = () => {
  setStoredWallet(null);
  clearOnboarding();
};

// ── Base network ──
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

// ── Listeners ──
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
    // Silent re-check — NO reload, NO popup
    tryAutoConnect().then(addr => onAccountChange(addr));
  });
};

// ── Utils ──
export const truncateAddress = (addr: string): string => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};
