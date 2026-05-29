declare global {
  interface Window {
    ethereum?: any;
  }
}

// Base mainnet (chain id 8453, hex 0x2105). LUMINA V5.4 LIVE since
// 2026-05-28. The Sepolia deployment remains only at /sandbox/* for
// wallet-less testing.
export const BASE_CHAIN_ID = '0x2105';

// Custom event fired by setStoredWallet so any component using
// useLuminaWallet() in the same tab gets a re-render. The DOM
// `storage` event only fires across tabs, so we dispatch our own.
const WALLET_CHANGED_EVENT = 'lumina:wallet-changed';

const dispatchWalletChanged = () => {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new Event(WALLET_CHANGED_EVENT));
  } catch {
    // Older browsers — fall through silently
  }
};

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
  dispatchWalletChanged();
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
// Solo toca window.ethereum si hay una wallet previamente guardada.
// Esto evita que Chrome muestre el selector de proveedor (MetaMask/Phantom)
// cuando hay múltiples wallets instaladas.
export const tryAutoConnect = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  // Si nunca se conectó, no tocar window.ethereum
  const stored = localStorage.getItem('lumina_wallet');
  if (!stored) return null;

  if (!window.ethereum) return null;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts.length > 0) {
      const address = accounts[0].toLowerCase();
      setStoredWallet(address);
      return address;
    }
    // Wallet was stored but no longer authorized — clean up
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
    // Mirror the connection into wagmi so write actions in
    // VaultActions / DepositLPModal see the same session without a
    // second popup. The bridge call is fire-and-forget — we don't
    // block the user-facing connect flow on it.
    try {
      const { bridgeWagmi } = await import('./wallet-bridge');
      bridgeWagmi().catch((err) => console.warn('[Lumina] bridgeWagmi failed:', err));
    } catch (err) {
      console.warn('[Lumina] could not load wallet-bridge:', err);
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
  clearDisclaimer();
  // Also tear down the wagmi side so disconnect is atomic — without
  // this, useAccount() would still return the previous address until
  // the next page load.
  if (typeof window !== 'undefined') {
    import('./wallet-bridge')
      .then(({ unbridgeWagmi }) => unbridgeWagmi().catch(() => {}))
      .catch(() => {});
  }
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
          chainName: 'Base',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: [
            process.env.NEXT_PUBLIC_RPC_URL_ALCHEMY,
            process.env.NEXT_PUBLIC_RPC_URL_QUICKNODE,
            'https://mainnet.base.org', // last-resort fallback
          ].filter(Boolean) as string[],
          blockExplorerUrls: ['https://basescan.org'],
        }],
      });
    }
  }
};

// ── Listeners (solo registrar si hay wallet guardada) ──
export const setupWalletListeners = (onAccountChange: (addr: string | null) => void) => {
  if (typeof window === 'undefined' || !window.ethereum) return;
  if (!localStorage.getItem('lumina_wallet')) return;
  window.ethereum.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length > 0) {
      const addr = accounts[0].toLowerCase();
      // setStoredWallet dispatches `lumina:wallet-changed` so
      // every consumer of useLuminaWallet() picks up the new value.
      setStoredWallet(addr);
      // Re-bridge wagmi so its useAccount() stays in sync with the
      // injected provider's currently-selected account.
      import('./wallet-bridge')
        .then(({ bridgeWagmi }) => bridgeWagmi().catch(() => {}))
        .catch(() => {});
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
