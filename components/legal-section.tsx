"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export function LegalSection() {
  return (
    <section className="px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-2xl border border-border bg-secondary/30 p-8"
      >
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Aviso Legal & Compliance
          </h3>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground/80">
          {
            "Aviso Legal: Lumina Organización de Seguros actúa bajo la normativa de la SSN exclusivamente como organizador, intermediando pólizas sin costos ocultos para el productor. Las comisiones son abonadas directamente por las aseguradoras. El 'Fee de Membresía' y los servicios 'On-Demand' son facturados por Lumina Coworking S.A. en concepto de alquiler de espacio, tecnología y servicios de marketing. La contratación de la membresía es opcional y no condiciona la operatividad del código asegurador."
          }
        </p>
      </motion.div>
    </section>
  );
}
