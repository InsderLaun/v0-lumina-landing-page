import { describe, it, expect } from 'vitest'
import { CHAIN, CONTRACTS, TOKENS, ORACLES, LUMINA_API_URL } from '../lib/lumina-config'

// V5.4 LIVE addresses — sourced from /health on 2026-05-28 (mainnet launch
// broadcast). The test asserts the CONTRACTS snapshot in lib/lumina-config.ts
// matches what /health exposes today. When the protocol is redeployed, update
// this table from /health and re-run; in production code, prefer
// useContracts() to avoid the manual sync entirely.
const V54_MAINNET = {
  LuminaToken:   '0xa35766202444d1d3D6d09Cf687B29D3C2632223C',
  ClaimBond:     '0x8203435Bc108FaBE1beB1fe40F66a7C8B42529F1',
  BondVault:     '0x1C50d05eEF138aAa9df22a001db4a75343a604E4',
  PolicyManager: '0x8c20dfE07a5679b8DE8376361Bc9f63eD081C268',
  CoverRouter:   '0x7A49B31DC3540E037cdCEb95765eD46f6a515aa2',
  Marketplace:   '0xfB3ec1B507DE8a7dB50691a26f872360F0EF71AB',
  USDC:          '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // Circle USDC, canonical Base mainnet
} as const

// Pre-V5.4 addresses that must NOT appear anywhere in the production config.
// Catches regression where someone re-introduces a stale Sepolia constant or
// an old V1/V2 mainnet address.
const LEGACY_ADDRESSES = [
  // V5.3 Sepolia (retired post mainnet migration on 2026-05-28)
  '0x62C0b58bB30CA857674ec593F1e23B3F15266680', // V5.3 LuminaToken (Sepolia)
  '0x193acBc1EdC5E565a4aBE96941C7E7AeF637B6EC', // V5.3 BondVault (Sepolia)
  '0xaa57Ab52Eb00f296Ad4CFA9E9c201f3737271FB4', // V5.3 ClaimBond (Sepolia)
  '0xcdB70B40e6a3DEac3189185d947A0e458518F566', // V5.3 CoverRouter (Sepolia)
  '0x546C07e07DeBCdbf7a2A7Ef12C38c8c8fcAFcDd8', // V5.3 PolicyManager (Sepolia)
  '0x0938205f4cBe5F572656533FC930FFce6F5F4345', // V5.3 Marketplace (Sepolia)
  '0xD944d8e5D8329994D83950872Ec210891d3Ab6AE', // V5.3 mUSDC (Sepolia mock, NOT on mainnet)
  // V1/V2 (pre-V5.x) legacy
  '0xd5f8678A0F2149B6342F9014CCe6d743234Ca025',
  '0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a',
  '0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904',
  '0x6E0A46B268e4aD9648CdAbD9A4b2B20B79E5ab21',
  '0x70f1c92EFcFe55e8d460aAa6d626779536b15128',
  '0xc7ac8c19c3f10f820d7e42f07e6e257bacc22876',
  '0x60447F880Fad94fe1E17DBe9A0Cb39923bC9f316',
  '0x04f94Bc24aAA87aDFA643EE1e55a35C683f30804',
  '0x5304f6732a51995651f1B666525CFeC5Af74A541',
  '0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A',
  '0x863A7fB4A676106db4b03449b01AC5615c6C9D51',
  '0x63D340AE7229BB464bC801f225651341ebcD3693',
  '0x17db45491561F7538e4E14449DCC34799758465D',
] as const

describe('lumina-config: V5.4 Base mainnet alignment', () => {
  it('CHAIN points at Base mainnet (8453)', () => {
    expect(CHAIN.id).toBe(8453)
    expect(CHAIN.name.toLowerCase()).not.toContain('sepolia')
    expect(CHAIN.rpc).toContain('mainnet.base.org')
    expect(CHAIN.explorer).toBe('https://basescan.org')
  })

  it('core contract addresses match the V5.4 mainnet deploy', () => {
    expect(CONTRACTS.LuminaToken).toBe(V54_MAINNET.LuminaToken)
    expect(CONTRACTS.ClaimBond).toBe(V54_MAINNET.ClaimBond)
    expect(CONTRACTS.BondVault).toBe(V54_MAINNET.BondVault)
    expect(CONTRACTS.PolicyManager).toBe(V54_MAINNET.PolicyManager)
    expect(CONTRACTS.CoverRouter).toBe(V54_MAINNET.CoverRouter)
    expect(CONTRACTS.Marketplace).toBe(V54_MAINNET.Marketplace)
    expect(TOKENS.USDC.address).toBe(V54_MAINNET.USDC)
  })

  it('oracle addresses are Base mainnet Chainlink feeds', () => {
    expect(ORACLES.BTC_USD).toBe('0x64c911996D3c6aC71f9b455B1E8E7266BcbD848F')
    expect(ORACLES.ETH_USD).toBe('0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70')
  })

  it.each(LEGACY_ADDRESSES)('legacy/Sepolia address %s is absent from config', (addr) => {
    const blob = JSON.stringify({ CHAIN, TOKENS, CONTRACTS, ORACLES }).toLowerCase()
    expect(blob).not.toContain(addr.toLowerCase())
  })

  it('LUMINA_API_URL points at the Railway production deploy', () => {
    expect(LUMINA_API_URL).toBe('https://lumina-api-production-ac85.up.railway.app')
  })
})
