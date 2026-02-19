"use client";

import { motion } from "framer-motion";
import {
  Check,
  Monitor,
  Smartphone,
  Headphones,
  Building2,
  Mic,
  CalendarDays,
  Coffee,
  Users,
  Crown,
} from "lucide-react";

const digitalBenefits = [
  {
    icon: Check,
    text: "100% Comisión en Automotores (Directo de Cía).",
  },
  {
    icon: Check,
    text: "+15% Extra en Riesgos Varios (Superior al mercado).",
  },
  {
    icon: Check,
    text: "97% de los Bonos/Premios trasladados al PAS (Lumina retiene solo 3%).",
  },
  {
    icon: Monitor,
    text: "Multicotizador Web y App.",
  },
  {
    icon: Headphones,
    text: "Soporte de Emisión Digital.",
  },
];

const fullBenefits = [
  {
    icon: Building2,
    text: "Coworking Premium: Acceso a oficinas en San Isidro/Vicente López.",
  },
  {
    icon: Mic,
    text: "Media Hub: Estudio profesional para grabar tus videos/reels.",
  },
  {
    icon: CalendarDays,
    text: "Eventos Quincenales: Charlas con oradores de ventas y seguros cada 15 días.",
  },
  {
    icon: Coffee,
    text: "Café de especialidad y Salas de Reunión ilimitadas.",
  },
  {
    icon: Users,
    text: "Networking con la comunidad de élite.",
  },
];

interface PricingSectionProps {
  onOpenModal: (plan: string) => void;
}

export function PricingSection({ onOpenModal }: PricingSectionProps) {
  return (
    <section id="planes" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Comparativa de Planes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Elegí el modelo que mejor se adapte a tu negocio
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Plan Digital */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary/30"
          >
            <div className="mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Plan Digital
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">$0</span>
                <span className="text-lg text-muted-foreground">/ mes</span>
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-accent">
                GRATIS
              </p>
              <p className="mt-3 text-muted-foreground">
                Rentabilidad Pura. Operá con las mejores comisiones del mercado sin
                costos fijos.
              </p>
            </div>

            <div className="mb-8 flex flex-1 flex-col gap-4">
              {digitalBenefits.map((benefit) => (
                <div key={benefit.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20">
                    <benefit.icon className="h-3 w-3 text-accent" />
                  </div>
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenModal("gratis")}
              className="flex items-center justify-center rounded-xl border border-border bg-secondary py-3.5 text-sm font-semibold text-secondary-foreground transition-all hover:border-primary/50 hover:bg-secondary/80"
            >
              Empezar Gratis
            </button>
          </motion.div>

          {/* Membresía Full */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col rounded-2xl border-2 border-primary/50 bg-card p-8 transition-colors hover:border-primary"
          >
            {/* Popular badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1">
                <Crown className="h-3.5 w-3.5 text-primary-foreground" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground">
                  Recomendado
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Membresía Full
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-foreground">$100</span>
                <span className="text-lg text-muted-foreground">USD / mes</span>
              </div>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-primary">
                Ecosistema Completo
              </p>
              <p className="mt-3 text-muted-foreground">
                Infraestructura y Crecimiento. Todo lo del Plan Digital, más
                servicios premium.
              </p>
            </div>

            <div className="mb-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Todo lo del Plan Digital, más:
              </p>
            </div>

            <div className="mb-8 flex flex-1 flex-col gap-4">
              {fullBenefits.map((benefit) => (
                <div key={benefit.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <benefit.icon className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed text-foreground/90">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onOpenModal("full")}
              className="flex items-center justify-center rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Quiero mi Oficina
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
