"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { RegistrationForm } from "@/components/registro/registration-form";

export function RegistrationContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const initialPlan =
    planParam === "A" || planParam === "B" ? planParam : undefined;

  return (
    <main className="relative min-h-screen px-6 py-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary">
              <span className="text-xs font-bold text-primary-foreground">
                L
              </span>
            </div>
            <span className="text-sm font-medium text-primary">
              Solicitud de Alta
            </span>
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Unite a Lumina
          </h1>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Completá el formulario para comenzar a operar con las mejores
            comisiones del mercado.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm sm:p-8"
        >
          <RegistrationForm initialPlan={initialPlan} />
        </motion.div>
      </div>
    </main>
  );
}
