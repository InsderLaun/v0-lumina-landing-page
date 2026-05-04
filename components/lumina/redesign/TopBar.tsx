'use client'

import { useState, useEffect } from 'react'

export function TopBar() {
  const [price, setPrice] = useState(0.0364)
  useEffect(() => {
    const id = setInterval(() => {
      setPrice((p) => +(p + (Math.random() - 0.5) * 0.0006).toFixed(4))
    }, 2400)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="rd-topbar">
      <div className="rd-topbar-inner">
        <div className="rd-topbar-item">
          <span className="rd-live-dot" /> <span>BURN ENGINE</span> <b>ACTIVE</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>LUMINA / USDC</span>
          <b className="mono">${price.toFixed(4)}</b>
          <span className="rd-ticker">+2.31%</span>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>BURNED</span> <b className="mono">1,284,402 LUMINA</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>ACTIVE BETS</span> <b className="mono">312</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>BASE L2</span> <b>OK</b>
        </div>
        <span className="rd-topbar-divider">·</span>
        <div className="rd-topbar-item">
          <span>CHAINLINK</span> <b>OK</b>
        </div>
      </div>
    </div>
  )
}
