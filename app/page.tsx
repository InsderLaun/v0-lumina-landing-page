"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { PricingSection } from "@/components/pricing-section";
import { AddonsSection } from "@/components/addons-section";
import { CalculatorSection } from "@/components/calculator-section";
import { ReferralSection } from "@/components/referral-section";
import { LegalSection } from "@/components/legal-section";
import { Footer } from "@/components/footer";
import { RegistrationModal } from "@/components/registration-modal";
import { TermsReferidosModal } from "@/components/terms-referidos-modal";
import { SuccessScreen } from "@/components/success-screen";
import { CuposLumina } from "@/components/CuposLumina";

export default function Page() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("gratis");
  const [termsOpen, setTermsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleOpenModal(plan: string) {
    setSelectedPlan(plan);
    setModalOpen(true);
  }

  if (submitted) {
    return (
      <>
        <SuccessScreen onOpenTerms={() => setTermsOpen(true)} onGoBack={() => setSubmitted(false)} />
        <TermsReferidosModal open={termsOpen} onOpenChange={setTermsOpen} />
      </>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar onOpenModal={handleOpenModal} />
      <HeroSection onOpenModal={handleOpenModal} />
      <PricingSection onOpenModal={handleOpenModal} />
      <CuposLumina />
      <AddonsSection />
      <CalculatorSection />
      <ReferralSection />
      <LegalSection />
      <Footer />

      <RegistrationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedPlan={selectedPlan}
        onSuccess={() => setSubmitted(true)}
        onOpenTerms={() => setTermsOpen(true)}
      />
      <TermsReferidosModal open={termsOpen} onOpenChange={setTermsOpen} />
    </main>
  );
}
