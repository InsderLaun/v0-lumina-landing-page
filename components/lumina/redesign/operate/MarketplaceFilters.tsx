'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export type SortKey =
  | 'discount-desc'
  | 'price-asc'
  | 'yield-desc'
  | 'maturity-asc'
  | 'newest'

export interface FilterState {
  priceMin: number
  priceMax: number
  discountMin: number
  discountMax: number
  yieldMin: number
  yieldMax: number
  maturityMonth: number | 'any' // 1-12
  maturityYear: number | 'any'
  sortBy: SortKey
}

export interface FilterableListing {
  /** Asking price in whole-USDC dollars (already converted from 6-dec base units). */
  askUsdc: number
  /** Face value in integer dollars. */
  faceValue: number
  /** Discount % vs face. */
  discountPct: number
  /** Annualised implied yield %. */
  yieldPct: number
  /** Maturity timestamp (unix seconds). 0 if unknown. */
  maturityTs: number
  /** Marketplace listing creation timestamp; 0 if unknown. Used for "newest". */
  listedAt: number
}

export const DEFAULT_FILTERS: FilterState = {
  priceMin: 0,
  priceMax: 0, // populated from data on mount
  discountMin: 0,
  discountMax: 100,
  yieldMin: 0,
  yieldMax: 200,
  maturityMonth: 'any',
  maturityYear: 'any',
  sortBy: 'discount-desc',
}

export function applyFilters<T extends FilterableListing>(items: T[], f: FilterState): T[] {
  const filtered = items.filter((l) => {
    if (l.askUsdc < f.priceMin) return false
    if (f.priceMax > 0 && l.askUsdc > f.priceMax) return false
    if (l.discountPct < f.discountMin || l.discountPct > f.discountMax) return false
    if (l.yieldPct < f.yieldMin || l.yieldPct > f.yieldMax) return false
    if (l.maturityTs > 0 && (f.maturityMonth !== 'any' || f.maturityYear !== 'any')) {
      const d = new Date(l.maturityTs * 1000)
      if (f.maturityMonth !== 'any' && d.getUTCMonth() + 1 !== f.maturityMonth) return false
      if (f.maturityYear !== 'any' && d.getUTCFullYear() !== f.maturityYear) return false
    }
    return true
  })

  const cmp = (a: T, b: T) => {
    switch (f.sortBy) {
      case 'discount-desc':
        return b.discountPct - a.discountPct
      case 'price-asc':
        return a.askUsdc - b.askUsdc
      case 'yield-desc':
        return b.yieldPct - a.yieldPct
      case 'maturity-asc':
        return a.maturityTs - b.maturityTs
      case 'newest':
        return b.listedAt - a.listedAt
    }
  }
  return [...filtered].sort(cmp)
}

/** Count of filters that differ from `DEFAULT_FILTERS` (after priceMax bound). */
export function activeFilterCount(f: FilterState, priceMaxBound: number): number {
  let n = 0
  if (f.priceMin > 0) n++
  if (f.priceMax > 0 && f.priceMax < priceMaxBound) n++
  if (f.discountMin > 0) n++
  if (f.discountMax < 100) n++
  if (f.yieldMin > 0) n++
  if (f.yieldMax < 200) n++
  if (f.maturityMonth !== 'any') n++
  if (f.maturityYear !== 'any') n++
  return n
}

const MONTHS = [
  ['1', 'Jan'],
  ['2', 'Feb'],
  ['3', 'Mar'],
  ['4', 'Apr'],
  ['5', 'May'],
  ['6', 'Jun'],
  ['7', 'Jul'],
  ['8', 'Aug'],
  ['9', 'Sep'],
  ['10', 'Oct'],
  ['11', 'Nov'],
  ['12', 'Dec'],
] as const

interface Props {
  filters: FilterState
  onChange: (next: FilterState) => void
  /** Highest ask price in current listings — sets the right-end of the price slider. */
  priceMaxBound: number
  /** Total + visible counts shown in the "Showing N of M" indicator. */
  total: number
  visible: number
  /** Years a user could plausibly select (covers the bond maturity range). */
  years?: number[]
}

export function MarketplaceFilters({
  filters,
  onChange,
  priceMaxBound,
  total,
  visible,
  years,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const yearOptions = useMemo(
    () => years ?? defaultYearRange(),
    [years],
  )

  const count = activeFilterCount(filters, priceMaxBound)

  const update = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange({ ...filters, [k]: v })

  const clearAll = () =>
    onChange({
      ...DEFAULT_FILTERS,
      priceMax: priceMaxBound,
    })

  // Auto-grow priceMax when a fresh, larger upper bound arrives.
  useEffect(() => {
    if (filters.priceMax === 0 || filters.priceMax > priceMaxBound) {
      onChange({ ...filters, priceMax: priceMaxBound })
    }
    // intentionally not depending on `filters` to avoid loops; only react
    // to bound changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceMaxBound])

  // Close on outside click.
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div
      ref={ref}
      style={{
        marginBottom: 14,
        background: 'var(--rd-surface)',
        border: '1px solid var(--rd-line)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid var(--rd-line-strong)',
            borderRadius: 5,
            color: 'var(--rd-text)',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <SlidersHorizontal size={13} />
          Filters
          {count > 0 && (
            <span
              style={{
                background: 'var(--rd-accent)',
                color: '#00121a',
                padding: '1px 7px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
                fontFamily: 'var(--font-jetbrains), monospace',
              }}
            >
              {count}
            </span>
          )}
        </button>

        <div
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 11,
            color: 'var(--rd-text-3)',
            letterSpacing: '0.04em',
          }}
        >
          Showing <span style={{ color: 'var(--rd-text-2)' }}>{visible}</span> of {total}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 11, color: 'var(--rd-text-3)', fontFamily: 'var(--font-jetbrains), monospace' }}>
            SORT
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => update('sortBy', e.target.value as SortKey)}
            style={selectStyle}
          >
            <option value="discount-desc">Highest discount</option>
            <option value="yield-desc">Highest yield</option>
            <option value="price-asc">Lowest price</option>
            <option value="maturity-asc">Soonest maturity</option>
            <option value="newest">Newest listing</option>
          </select>
          {count > 0 && (
            <button
              type="button"
              onClick={clearAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                background: 'transparent',
                border: 0,
                color: 'var(--rd-text-3)',
                fontSize: 11,
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <X size={12} /> Clear all
            </button>
          )}
        </div>
      </header>

      {open && (
        <div
          style={{
            padding: '14px 16px',
            borderTop: '1px solid var(--rd-line)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          <RangeBlock
            label="Asking price (USDC)"
            unit="$"
            min={0}
            max={priceMaxBound || 1}
            valueMin={filters.priceMin}
            valueMax={filters.priceMax || priceMaxBound}
            step={Math.max(1, Math.round((priceMaxBound || 1) / 100))}
            onChange={(lo, hi) => onChange({ ...filters, priceMin: lo, priceMax: hi })}
          />
          <RangeBlock
            label="Discount"
            unit="%"
            min={0}
            max={100}
            valueMin={filters.discountMin}
            valueMax={filters.discountMax}
            step={1}
            onChange={(lo, hi) => onChange({ ...filters, discountMin: lo, discountMax: hi })}
          />
          <RangeBlock
            label="Implied yield (annualised)"
            unit="%"
            min={0}
            max={200}
            valueMin={filters.yieldMin}
            valueMax={filters.yieldMax}
            step={1}
            onChange={(lo, hi) => onChange({ ...filters, yieldMin: lo, yieldMax: hi })}
          />

          <div>
            <Label>Maturity year</Label>
            <select
              value={String(filters.maturityYear)}
              onChange={(e) =>
                update('maturityYear', e.target.value === 'any' ? 'any' : Number(e.target.value))
              }
              style={selectStyle}
            >
              <option value="any">Any year</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Maturity month</Label>
            <select
              value={String(filters.maturityMonth)}
              onChange={(e) =>
                update('maturityMonth', e.target.value === 'any' ? 'any' : Number(e.target.value))
              }
              style={selectStyle}
            >
              <option value="any">Any month</option>
              {MONTHS.map(([v, lbl]) => (
                <option key={v} value={v}>
                  {lbl}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

function defaultYearRange(): number[] {
  const start = new Date().getUTCFullYear()
  return [start, start + 1, start + 2, start + 3]
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: 10,
        letterSpacing: '0.08em',
        color: 'var(--rd-text-3)',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  )
}

function RangeBlock({
  label,
  unit,
  min,
  max,
  valueMin,
  valueMax,
  step,
  onChange,
}: {
  label: string
  unit: '$' | '%'
  min: number
  max: number
  valueMin: number
  valueMax: number
  step: number
  onChange: (lo: number, hi: number) => void
}) {
  const fmt = (n: number) => (unit === '$' ? `$${n.toLocaleString('en-US')}` : `${n}${unit}`)
  return (
    <div>
      <Label>{label}</Label>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: 11,
          color: 'var(--rd-text-2)',
          marginBottom: 4,
        }}
      >
        <span>{fmt(valueMin)}</span>
        <span>{fmt(valueMax)}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(valueMin, valueMax)}
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), valueMax)
            onChange(v, valueMax)
          }}
          style={{ flex: 1, accentColor: 'var(--rd-accent)' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.max(valueMax, valueMin)}
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), valueMin)
            onChange(valueMin, v)
          }}
          style={{ flex: 1, accentColor: 'var(--rd-accent)' }}
        />
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  background: 'var(--rd-surface-2)',
  border: '1px solid var(--rd-line)',
  borderRadius: 5,
  color: 'var(--rd-text)',
  fontFamily: 'var(--font-jetbrains), monospace',
  fontSize: 12,
}
