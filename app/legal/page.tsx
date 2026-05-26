import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal · Terms, Risk Disclosure & Privacy | Lumina Protocol",
  description:
    "Terms of Service, Risk Disclosure and Privacy scaffold for Lumina Protocol. Lumina is a TESTNET product — no real funds are at risk.",
};

// NOTE FOR MAINTAINERS
// --------------------
// This page is a SCAFFOLD. The binding legal text (Terms of Service,
// Privacy Policy, and any jurisdiction-specific disclosures) is marked
// with "[PLACEHOLDER — pending legal review]" and MUST be drafted/approved
// by qualified counsel before mainnet launch. Nothing on this page should
// be relied upon as a final, binding legal agreement in its current state.

const PLACEHOLDER = "[PLACEHOLDER — pending legal review]";

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Back button */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Title */}
        <h1 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Legal
        </h1>
        <p className="mt-2 text-lg font-semibold text-primary/80">
          Terms of Service · Risk Disclosure · Privacy
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Last updated: scaffold (not yet reviewed by counsel)
        </p>

        <hr className="my-10 border-border" />

        {/* Testnet banner */}
        <section
          role="note"
          className="mb-12 rounded-lg border border-yellow-500/40 bg-yellow-500/5 p-5"
        >
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-yellow-500">
            Testnet product — no real funds
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Lumina Protocol is currently deployed on the{" "}
            <strong>Base Sepolia testnet</strong>. All tokens used by the
            protocol on this network — including the mock USDC at{" "}
            <code>0xD944d8e5D8329994D83950872Ec210891d3Ab6AE</code> — are{" "}
            <strong>test tokens with no monetary value</strong>. No real money
            is, or should be, at risk. Do not send mainnet assets to any address
            referenced in this product. Premiums, payouts, bonds, and $LUMINA
            balances on testnet have no real-world financial value.
          </p>
        </section>

        {/* 1. Terms of Service */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
            1. Terms of Service
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            By accessing or using the Lumina Protocol website, smart contracts,
            API, SDK, or related interfaces (collectively, the
            &ldquo;Service&rdquo;), you agree to the following terms. The Service
            is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            basis, without warranties of any kind, for evaluation on a public
            test network.
          </p>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {PLACEHOLDER} Binding terms covering eligibility, acceptable use,
            intellectual property, limitation of liability, indemnification,
            dispute resolution, governing law, and termination are to be drafted
            and approved by legal counsel prior to any mainnet deployment.
          </p>
        </section>

        {/* 2. Risk Disclosure */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
            2. Risk Disclosure
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Parametric coverage and on-chain financial primitives carry material
            risks. Even on testnet, you should understand the following risk
            factors, which would apply with real economic consequence on
            mainnet:
          </p>
          <ul className="mb-4 list-disc space-y-3 pl-6 leading-relaxed text-muted-foreground">
            <li>
              <strong>Oracle risk.</strong> Triggers and redemptions depend on
              external price oracles (Chainlink BTC/USD and ETH/USD feeds, and
              the protocol&rsquo;s <code>LuminaOracleV2</code>). Feed deviation,
              staleness, or manipulation can cause spurious or denied triggers
              and incorrect payouts.
            </li>
            <li>
              <strong>Liquidity risk.</strong> The secondary marketplace and the
              BondVault reserve may lack sufficient liquidity to exit positions
              at expected prices, or at all. Bonds mature in 730 days; early
              exit is not guaranteed.
            </li>
            <li>
              <strong>$LUMINA token price risk.</strong> Bond redemptions pay
              out in $LUMINA at maturity. The value of $LUMINA is volatile and
              may decline significantly. The deflationary burn mechanism does
              not guarantee any price floor or appreciation.
            </li>
            <li>
              <strong>Smart-contract risk.</strong> The protocol&rsquo;s
              contracts may contain bugs, vulnerabilities, or economic design
              flaws. Audits (including internal reviews) reduce but do not
              eliminate this risk. Upgradeable (UUPS) contracts may change
              behavior over time.
            </li>
            <li>
              <strong>Regulatory risk.</strong> The legal and regulatory
              treatment of parametric coverage, tokenized bonds, and protocol
              tokens is uncertain and varies by jurisdiction. Future regulation
              may restrict or prohibit access to the Service. Lumina does not
              offer regulated insurance and makes no representation that the
              Service is available or lawful in any particular jurisdiction.
            </li>
          </ul>
          <p className="leading-relaxed text-muted-foreground">
            {PLACEHOLDER} A complete, jurisdiction-specific risk disclosure and
            any required investor/consumer warnings are pending legal review.
          </p>
        </section>

        {/* 3. Privacy */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-primary">
            3. Privacy
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Interactions with public blockchains are inherently transparent:
            wallet addresses, transactions, and on-chain activity are publicly
            visible and permanent. The API may process technical metadata (such
            as API keys, IP addresses for rate limiting, and request logs) to
            operate the Service.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {PLACEHOLDER} A binding Privacy Policy describing what data is
            collected, how it is used and retained, third-party processors, and
            user rights is pending legal review.
          </p>
        </section>

        <hr className="my-10 border-border" />

        <p className="text-sm leading-relaxed text-muted-foreground">
          Questions about these terms? Contact{" "}
          <a
            href="mailto:labs@lumina-org.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            labs@lumina-org.com
          </a>
          . Protocol source is published at{" "}
          <a
            href="https://github.com/org-lumina/LUMINA-PROTOCOL"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            github.com/org-lumina/LUMINA-PROTOCOL
          </a>
          .
        </p>
      </div>
    </main>
  );
}
