"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Car, TrendingUp, Globe } from "lucide-react";

interface HeroSectionProps {
  onOpenModal: (plan: string) => void;
}

const benefits = [
  {
    number: "100%",
    label: "Comisión Automotores",
    icon: Car,
    description: "Cobrá el total de tus comisiones sin retenciones.",
  },
  {
    number: "+15%",
    label: "Comisiones y Bonos",
    icon: TrendingUp,
    description: "De la mejor comisión del mercado, directo a tu cuenta.",
  },
  {
    number: "Web & App",
    label: "Multicotizador",
    icon: Globe,
    description: "Cotizá en segundos desde cualquier dispositivo.",
  },
];

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-10">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
        >
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Organización de Seguros
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl"
        >
          Tu Código. Tu Cartera.
          <br />
          <span className="text-primary">Tu Elección.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
        >
          La única organización que te permite elegir: operá con las máximas
          comisiones del mercado GRATIS, o sumate a nuestro Hub Corporativo para
          escalar tu negocio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => onOpenModal("gratis")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-8 py-4 text-base font-semibold text-secondary-foreground transition-all hover:border-primary/50 hover:bg-secondary/80 sm:w-auto"
          >
            {"Opción A: Alta Gratis"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => onOpenModal("full")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 sm:w-auto"
          >
            {"Opción B: Membresía Full"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* ── Beneficios del PAS ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
            Beneficios del PAS
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/[0.06]"
                >
                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-primary md:text-4xl">
                    {b.number}
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {b.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {b.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
