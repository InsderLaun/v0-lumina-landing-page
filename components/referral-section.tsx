"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gift, UserPlus, ArrowRight, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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
    description: "Tu Membresía Full de $100 USD queda 100% bonificada.",
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
              {"Referí a 5 colegas productores. Cuando se activen, tu Fee de $100 USD queda 100% bonificado."}
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
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#F5C347] px-8 py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
                  >
                    <UserPlus className="h-4 w-4" />
                    {"Obtener mi Código de Referente"}
                  </button>
                </DialogTrigger>
                <DialogContent className="border-border/50 bg-background text-foreground sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground">
                      {"Tu Código es tu Matrícula SSN"}
                    </DialogTitle>
                    <DialogDescription className="text-primary font-medium">
                      {"En Lumina hacemos las cosas simples."}
                    </DialogDescription>
                  </DialogHeader>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {"Tu código único de referente es tu Número de Matrícula de la SSN. Simplemente decile a tu colega que ingrese tu número de matrícula en el campo Matrícula del Referente al momento de llenar su formulario de registro. Nuestro sistema lo computará automáticamente a tu favor para que alcances tu Membresía Full bonificada."}
                  </p>
                  <div className="flex gap-3 mt-6">
                    <Button asChild className="flex-1 bg-[#25D366] text-white hover:bg-[#25D366]/90 font-semibold">
                      <a
                        href="https://wa.me/?text=%C2%A1Hola!%20Me%20sum%C3%A9%20a%20Lumina%2C%20la%20nueva%20red%20para%20Productores%20de%20Seguros%20que%20te%20da%20el%20100%25%20de%20comisiones.%20Sumate%20vos%20tambi%C3%A9n%20y%20en%20el%20formulario%20de%20registro%20pon%C3%A9%20mi%20N%C3%BAmero%20de%20Matr%C3%ADcula%20SSN%20en%20la%20secci%C3%B3n%20de%20referidos.%20Conoc%C3%A9%20m%C3%A1s%20ac%C3%A1%3A%20https%3A%2F%2Flumina-org.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Compartir por WhatsApp
                      </a>
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground">
                        Cerrar
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
              <Link
                href="/terminos"
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
