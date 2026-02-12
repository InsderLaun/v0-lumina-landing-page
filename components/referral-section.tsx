"use client";

import { motion } from "framer-motion";
import { Gift, UserPlus, ArrowRight, Check } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Referí",
    description: "Compartí tu link con 5 colegas productores.",
  },
  {
    step: "02",
    title: "Se activan",
    description: "Tus referidos se dan de alta y comienzan a operar.",
  },
  {
    step: "03",
    title: "Fee bonificado",
    description: "Tu Membresía Full de $150 USD queda 100% bonificada.",
  },
];

export function ReferralSection() {
  return (
    <section id="referidos" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card"
        >
          <div className="p-8 md:p-12">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Plan 5x2
              </span>
            </div>

            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {"¿Querés la Membresía Full GRATIS?"}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              {"Referí a 5 colegas productores. Cuando se activen, tu Fee de $150 USD queda 100% bonificado."}
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="mb-3 text-3xl font-bold text-primary/30">
                    {item.step}
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {i < steps.length - 1 && (
                    <ArrowRight className="absolute right-0 top-4 hidden h-5 w-5 text-primary/30 sm:block" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3 rounded-xl bg-secondary/50 p-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground">
                {"Tu red paga tu oficina."}
              </p>
            </div>

            <div className="mt-8">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" />
                {"Obtener mi Link de Referido"}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
