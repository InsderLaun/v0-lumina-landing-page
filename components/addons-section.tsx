"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calculator, Video, Plus, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const addons = [
  {
    icon: Calculator,
    title: "Contabilidad Expert",
    description: "Liquidación de impuestos y facturación profesional.",
    price: "$50 USD",
    gated: true,
    route: "/contabilidad",
  },
  {
    icon: Video,
    title: "Marketing Pack",
    description: "Edición de video y gestión de redes sociales.",
    price: "$50 USD",
    gated: true,
    route: "/marketing",
  },
];

export function AddonsSection() {
  const [gateOpen, setGateOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("/contabilidad");
  const router = useRouter();

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
            >
              <button
                type="button"
                onClick={() => {
                  if (addon.gated) {
                    setSelectedRoute(addon.route || "/contabilidad");
                    setGateOpen(true);
                  }
                }}
                className="flex w-full items-center gap-5 rounded-2xl border border-border bg-card p-6 text-left transition-colors hover:border-primary/30"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <addon.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {addon.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {addon.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Plus className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {addon.price}
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gate Modal */}
      <Dialog open={gateOpen} onOpenChange={setGateOpen}>
        <DialogContent className="border-[#F5C347]/20 bg-background text-foreground sm:max-w-md">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#F5C347]/30 bg-[#F5C347]/10">
              <ShieldAlert className="h-7 w-7 text-[#F5C347]" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#F5C347]">
              Acceso Restringido
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Este servicio On-Demand es un beneficio exclusivo para los
              Productores Asesores de Seguros (PAS) que ya forman parte de la
              red Lumina.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setGateOpen(false);
                router.push(selectedRoute);
              }}
              className="flex w-full items-center justify-center rounded-xl bg-[#F5C347] px-6 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#F5C347]/90 hover:shadow-lg hover:shadow-[#F5C347]/20"
            >
              Solo para miembros / Avanzar
            </button>
            <button
              type="button"
              onClick={() => setGateOpen(false)}
              className="flex w-full items-center justify-center rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-[#F5C347]/30 hover:text-foreground"
            >
              Volver
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            ¿Todavía no sos parte?{" "}
            <Link
              href="/#planes"
              onClick={() => setGateOpen(false)}
              className="text-[#F5C347] underline underline-offset-2 hover:text-[#F5C347]/80"
            >
              Sumate a Lumina aquí
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </section>
  );
}
