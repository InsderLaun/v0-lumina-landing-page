declare global {
  interface Window {
    ethereum?: any;
  }
}

export const BASE_CHAIN_ID = '0x2105';

// ── Storage: Wallet ──
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

// ── Storage: Disclaimer ──
export const isDisclaimerAccepted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('lumina_disclaimer_accepted') === 'true';
};

export const setDisclaimerAccepted = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lumina_disclaimer_accepted', 'true');
};

const clearDisclaimer = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lumina_disclaimer_accepted');
};

// ── SILENCIOSO: No abre popup. Usar en useEffect al montar páginas. ──
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

// ── PROACTIVO: Abre popup. SOLO llamar en onClick. ──
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
    if (error.code === 4001) console.log('[Lumina] User rejected connection.');
    return null;
  }
};

// ── Disconnect: limpia TODO ──
export const disconnectWallet = () => {
  setStoredWallet(null);
  clearDisclaimer();
};

// ── Base network enforcement ──
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
      disconnectWallet();
      onAccountChange(null);
    }
  });
  window.ethereum.on('chainChanged', () => {
    if (typeof window !== 'undefined') window.location.reload();
  });
};

// ── Utils ──
export const truncateAddress = (addr: string): string => {
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};
