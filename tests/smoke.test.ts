// tests/smoke.test.ts
//
// Lightweight assertions that the post-audit-#35 config points at the V5.1
// Sepolia deploy (and not a stale Base Mainnet V1/V2 address). These run
// without a test runner config — invoke with `npx tsx tests/smoke.test.ts`
// or wire jest later.

import { CHAIN, CONTRACTS, TOKENS, ORACLES, LUMINA_API_URL } from "../lib/lumina-config"

let failed = 0
function check(label: string, ok: boolean, detail?: string): void {
    const status = ok ? "PASS" : "FAIL"
    if (!ok) failed += 1
    console.log(`[${status}] ${label}${detail ? " — " + detail : ""}`)
}

// 1. Chain is Base Sepolia (84532), not Base Mainnet (8453).
check("CHAIN.id === 84532 (Base Sepolia)", (CHAIN.id as number) === 84532, `got ${CHAIN.id}`)
check("CHAIN.name mentions Sepolia", CHAIN.name.toLowerCase().includes("sepolia"))
check("CHAIN.rpc is a Sepolia endpoint", CHAIN.rpc.includes("sepolia"))
check(
    "CHAIN.explorer is Sepolia Basescan",
    CHAIN.explorer === "https://sepolia.basescan.org"
)

// 2. V5.1 contract addresses are present at the documented values.
const V51 = {
    LuminaToken: "0x17db45491561F7538e4E14449DCC34799758465D",
    ClaimBond: "0x5304f6732a51995651f1B666525CFeC5Af74A541",
    BondVault: "0x1747CDA7F84BEc4f2002ff0dcdb3c51c1C02cf6A",
    PolicyManager: "0x04f94Bc24aAA87aDFA643EE1e55a35C683f30804",
    CoverRouter: "0x60447F880Fad94fe1E17DBe9A0Cb39923bC9f316",
    Marketplace: "0x863A7fB4A676106db4b03449b01AC5615c6C9D51",
    USDC: "0x63D340AE7229BB464bC801f225651341ebcD3693",
} as const

check("CONTRACTS.LuminaToken matches V5.1", CONTRACTS.LuminaToken === V51.LuminaToken)
check("CONTRACTS.ClaimBond matches V5.1", CONTRACTS.ClaimBond === V51.ClaimBond)
check("CONTRACTS.BondVault matches V5.1", CONTRACTS.BondVault === V51.BondVault)
check("CONTRACTS.PolicyManager matches V5.1", CONTRACTS.PolicyManager === V51.PolicyManager)
check("CONTRACTS.CoverRouter matches V5.1", CONTRACTS.CoverRouter === V51.CoverRouter)
check("CONTRACTS.Marketplace matches V5.1", CONTRACTS.Marketplace === V51.Marketplace)
check("TOKENS.USDC.address matches V5.1 mock", TOKENS.USDC.address === V51.USDC)

// 3. Oracle addresses are V5.1 mocks (not Chainlink mainnet).
check(
    "ORACLES.BTC_USD is the V5.1 MockChainlinkOracle (BTC)",
    ORACLES.BTC_USD === "0x2aDC8718F0b7Efb18a07aBc7595F1364730bb99E"
)
check(
    "ORACLES.ETH_USD is the V5.1 MockChainlinkOracle (ETH)",
    ORACLES.ETH_USD === "0x2a370A7dAE38aF7EECA20C9438Bd5154889cdc5e"
)

// 4. No legacy Base Mainnet V1/V2 address survives anywhere in CONTRACTS.
const LEGACY_ADDRESSES = [
    "0xd5f8678A0F2149B6342F9014CCe6d743234Ca025", // V1/V2 CoverRouter
    "0xCCA07e06762222AA27DEd58482DeD3d9a7d0162a", // V1/V2 PolicyManager
    "0xFee5d6DAdA0A41407e9EA83d4F357DA6214Ff904", // legacy VolatileLong
    "0x6E0A46B268e4aD9648CdAbD9A4b2B20B79E5ab21", // legacy BCS
    "0x70f1c92EFcFe55e8d460aAa6d626779536b15128", // legacy EAS
    "0xc7ac8c19c3f10f820d7e42f07e6e257bacc22876", // legacy EmergencyPause
    "0xd0De5D53dCA2D96cdE7FAf540BA3f3a44fdB747a", // legacy TimelockController
] as const
const configBlob = JSON.stringify({ CHAIN, TOKENS, CONTRACTS, ORACLES }).toLowerCase()
for (const addr of LEGACY_ADDRESSES) {
    check(
        `no legacy address ${addr.slice(0, 10)}…`,
        !configBlob.includes(addr.toLowerCase()),
        configBlob.includes(addr.toLowerCase()) ? "STILL PRESENT" : "absent"
    )
}

// 5. API URL points at the live lumina-api.
check(
    "LUMINA_API_URL is the Railway production URL",
    LUMINA_API_URL === "https://lumina-api-production-ac85.up.railway.app"
)

if (failed > 0) {
    console.error(`\n${failed} smoke check(s) FAILED`)
    process.exit(1)
}
console.log(`\nAll smoke checks passed.`)
