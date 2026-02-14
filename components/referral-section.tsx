"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, UserPlus, ArrowRight, Check, FileText } from "lucide-react";

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

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="https://api.whatsapp.com/send?text=%C2%A1Hola%21%20Me%20acabo%20de%20sumar%20a%20Lumina%2C%20la%20nueva%20red%20para%20Productores%20de%20Seguros.%20Te%20dan%20comisiones%20del%20100%25%20directo%20de%20compa%C3%B1%C3%ADa.%20Anotate%20ac%C3%A1%3A%20https%3A%2F%2Flumina-org.com%20y%20pon%C3%A9%20mi%20N%C2%B0%20de%20Matr%C3%ADcula%20como%20referido%20as%C3%AD%20sumamos%20beneficios."
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <UserPlus className="h-4 w-4" />
                {"Obtener mi Link de Referido"}
              </a>
              <Link
                href="/terminos-referidos"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <FileText className="h-4 w-4" />
                {"Términos y Condiciones"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
