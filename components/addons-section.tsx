"use client";

import { motion } from "framer-motion";
import { Calculator, Video, Plus } from "lucide-react";

const addons = [
  {
    icon: Calculator,
    title: "Contabilidad Expert",
    description: "Liquidación de impuestos y facturación profesional.",
    price: "$50 USD",
  },
  {
    icon: Video,
    title: "Marketing Pack",
    description: "Edición de video y gestión de redes sociales.",
    price: "$50 USD",
  },
];

export function AddonsSection() {
  return (
    <section id="addons" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Add-Ons On-Demand
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {"Potenciá tu estructura por solo $50 USD c/u"}
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2">
          {addons.map((addon, i) => (
            <motion.div
              key={addon.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -2 }}
              className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <addon.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{addon.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {addon.description}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-bold text-primary">{addon.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
