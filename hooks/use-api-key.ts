'use client'

import { useCallback, useEffect, useState } from 'react'

// Shared, localStorage-backed API key so the authenticated dashboard pages
// (earnings / activity / webhooks) can send `x-api-key` without each page
// re-onboarding. ApiKeysView writes it on generate/paste; the views read it.
const STORAGE_KEY = 'lumina_api_key'

export function useApiKey(): {
  apiKey: string | null
  ready: boolean
  setApiKey: (k: string | null) => void
} {
  const [apiKey, setKey] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      setKey(localStorage.getItem(STORAGE_KEY))
    } catch {
      /* SSR / disabled storage */
    }
    setReady(true)
    // Keep tabs in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setKey(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setApiKey = useCallback((k: string | null) => {
    try {
      if (k) localStorage.setItem(STORAGE_KEY, k)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setKey(k)
  }, [])

  return { apiKey, ready, setApiKey }
}
