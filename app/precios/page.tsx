"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { AddonsSection } from "@/components/addons-section";
import { Footer } from "@/components/footer";

export default function PreciosPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>
        <PricingSection />
        <AddonsSection />
      </div>
      <Footer />
    </main>
  );
}
