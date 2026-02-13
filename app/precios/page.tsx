import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { AddonsSection } from "@/components/addons-section";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Precios | Lumina - Organización de Seguros",
  description:
    "Compará los planes de Lumina: Plan Digital gratuito o Membresía Full con Coworking Premium, Media Hub y eventos exclusivos.",
};

export default function PreciosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <PricingSection />
        <AddonsSection />
      </div>
      <Footer />
    </main>
  );
}
