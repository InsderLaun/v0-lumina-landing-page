import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { AddonsSection } from "@/components/addons-section";
import { CalculatorSection } from "@/components/calculator-section";
import { ReferralSection } from "@/components/referral-section";
import { LegalSection } from "@/components/legal-section";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <PricingSection />
      <AddonsSection />
      <CalculatorSection />
      <ReferralSection />
      <LegalSection />
      <Footer />
    </main>
  );
}
