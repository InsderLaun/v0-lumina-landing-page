import { describe, it, expect } from 'vitest'
import {
  toNum,
  formatUsdc,
  formatCount,
} from '../components/lumina/redesign/MarketplaceSection'

describe('MarketplaceSection helpers', () => {
  describe('toNum', () => {
    it('parses string "0" as 0', () => {
      expect(toNum('0')).toBe(0)
    })
    it('parses string "1000000" as 1_000_000', () => {
      expect(toNum('1000000')).toBe(1_000_000)
    })
    it('returns 0 for null', () => {
      expect(toNum(null)).toBe(0)
    })
    it('returns 0 for undefined', () => {
      expect(toNum(undefined)).toBe(0)
    })
    it('passes through finite numbers', () => {
      expect(toNum(42)).toBe(42)
    })
    it('returns 0 for NaN/Infinity', () => {
      expect(toNum(Number.NaN)).toBe(0)
      expect(toNum(Number.POSITIVE_INFINITY)).toBe(0)
    })
    it('returns 0 for non-numeric strings', () => {
      expect(toNum('not-a-number')).toBe(0)
    })
  })

  describe('formatUsdc', () => {
    it('formats raw "1000000" (1 USDC) as $1.00', () => {
      expect(formatUsdc('1000000')).toBe('$1.00')
    })
    it('formats raw "1234567890" with thousands separator + 2 decimals', () => {
      // 1234567890 / 1e6 = 1234.56789 → toLocaleString rounds to 1,234.57
      expect(formatUsdc('1234567890')).toBe('$1,234.57')
    })
    it('formats raw "0" as $0.00', () => {
      expect(formatUsdc('0')).toBe('$0.00')
    })
    it('handles null/undefined as $0.00', () => {
      expect(formatUsdc(null)).toBe('$0.00')
      expect(formatUsdc(undefined)).toBe('$0.00')
    })
  })

  describe('formatCount', () => {
    it('formats 0 as "0"', () => {
      expect(formatCount(0)).toBe('0')
    })
    it('formats 1234 as "1,234"', () => {
      expect(formatCount(1234)).toBe('1,234')
    })
    it('parses string counts', () => {
      expect(formatCount('1234')).toBe('1,234')
    })
    it('handles null/undefined as "0"', () => {
      expect(formatCount(null)).toBe('0')
      expect(formatCount(undefined)).toBe('0')
    })
  })
})
