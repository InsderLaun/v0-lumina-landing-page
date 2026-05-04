import { describe, it, expect } from 'vitest'
import { CHAIN, CONTRACTS, TOKENS, ORACLES, LUMINA_API_URL } from '../lib/lumina-config'

const V51 = {
  LuminaToken: '0x17db45491561F7538e4E14449DCC34799758465D',
  ClaimBond: '0x5304f6732a51995651f1B666525CFeC5Af74A541',
  BondVault: '0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A',
  PolicyManager: '0x04f94Bc24aAA87aDFA643EE1e55a35C683f30804',
  CoverRouter: '0x60447F880Fad94fe1E17DBe9A0Cb39923bC9f316',
  Marketplace: '0x863A7fB4A676106db4b03449b01AC5615c6C9D51',
  USDC: '0x63D340AE7229BB464bC801f225651341ebcD3693',
} as const

const LEGACY_ADDRESSES = [
  '0xd5f8678A0F2149B6342F9014CCe6d743234Ca025',
  '0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a',
  '0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904',
  '0x6E0A46B268e4aD9648CdAbD9A4b2B20B79E5ab21',
  '0x70f1c92EFcFe55e8d460aAa6d626779536b15128',
  '0xc7ac8c19c3f10f820d7e42f07e6e257bacc22876',
  '0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a',
] as const

describe('lumina-config: V5.1 Sepolia alignment', () => {
  it('CHAIN points at Base Sepolia (84532)', () => {
    expect(CHAIN.id).toBe(84532)
    expect(CHAIN.name.toLowerCase()).toContain('sepolia')
    expect(CHAIN.rpc).toContain('sepolia')
    expect(CHAIN.explorer).toBe('https://sepolia.basescan.org')
  })

  it('core contract addresses match the V5.1 deploy', () => {
    expect(CONTRACTS.LuminaToken).toBe(V51.LuminaToken)
    expect(CONTRACTS.ClaimBond).toBe(V51.ClaimBond)
    expect(CONTRACTS.BondVault).toBe(V51.BondVault)
    expect(CONTRACTS.PolicyManager).toBe(V51.PolicyManager)
    expect(CONTRACTS.CoverRouter).toBe(V51.CoverRouter)
    expect(CONTRACTS.Marketplace).toBe(V51.Marketplace)
    expect(TOKENS.USDC.address).toBe(V51.USDC)
  })

  it('oracle addresses are the V5.1 mocks (BTC + ETH)', () => {
    expect(ORACLES.BTC_USD).toBe('0x2aDC8718F0b7Efb18a07aBc7595F1364730bb99E')
    expect(ORACLES.ETH_USD).toBe('0x2a370A7dAE38aF7EECA20C9438Bd5154889cdc5e')
  })

  it.each(LEGACY_ADDRESSES)('legacy V1/V2 address %s is absent from config', (addr) => {
    const blob = JSON.stringify({ CHAIN, TOKENS, CONTRACTS, ORACLES }).toLowerCase()
    expect(blob).not.toContain(addr.toLowerCase())
  })

  it('LUMINA_API_URL points at the Railway production deploy', () => {
    expect(LUMINA_API_URL).toBe('https://lumina-api-production-ac85.up.railway.app')
  })
})
