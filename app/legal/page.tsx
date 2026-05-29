import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal · Terms, Risk Disclosure & Privacy | Lumina Protocol",
  description:
    "Terms of Service, Risk Disclosure and Privacy scaffold for Lumina Protocol. Lumina runs on Base mainnet (chain 8453) — real funds are at risk. DYOR.",
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

        {/* Mainnet banner */}
        <section
          role="note"
          className="mb-12 rounded-lg border border-red-500/40 bg-red-500/5 p-5"
        >
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-red-500">
            Mainnet product — real funds are at risk
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Lumina Protocol is deployed on <strong>Base mainnet (chain 8453)</strong>{" "}
            and uses Circle&rsquo;s canonical USDC at{" "}
            <code>0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913</code>. Premiums,
            payouts, bonds, and $LUMINA balances on this network have{" "}
            <strong>real monetary value</strong>. Smart-contract bugs, oracle
            failures, governance attacks, liquidity gaps, regulatory action, or
            $LUMINA price decline can result in <strong>total loss of funds</strong>.
            Do your own research. This is not financial advice. The protocol is
            offered &ldquo;as is&rdquo; with no warranty of any kind.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            A read-only Base Sepolia sandbox at <code>/sandbox/*</code> remains
            available for testing — funds on Sepolia have no value and do not
            affect mainnet positions.
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
            basis, without warranties of any kind.
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
            risks. On Base mainnet these risks have real economic consequence —
            understand the following before purchasing any policy or holding
            $LUMINA:
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
