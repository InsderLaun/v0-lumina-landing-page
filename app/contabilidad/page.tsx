"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    FileCheck,
    DollarSign,
    ShieldCheck,
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    TrendingUp,
    Search,
    Scale,
    FileText,
    Building2,
    Calculator,
    ArrowRight,
} from "lucide-react";
import { ContabilidadActivationModal } from "@/components/contabilidad-activation-modal";

const complianceItems = [
    {
        icon: FileCheck,
        title: "Facturación Centralizada",
        description:
            "Basada en liquidaciones de Cías, simplificamos la emisión para que cada comisión esté correctamente facturada y documentada.",
    },
    {
        icon: Search,
        title: "Auditoría de Liquidaciones",
        description:
            "Control cruzado de lo liquidado vs. lo producido para que no pierdas ni un centavo de tus comisiones.",
    },
    {
        icon: DollarSign,
        title: "Control de Retenciones",
        description:
            "Gestión integral de IVA, Ganancias e IIBB para que no sean un costo oculto que erosione tu rentabilidad.",
    },
];

const iibbItems = [
    {
        icon: Building2,
        title: "Exenciones en CABA (AGIP)",
        description:
            "Aplicación de exenciones disponibles para reducir tu presión fiscal en la Ciudad Autónoma de Buenos Aires.",
    },
    {
        icon: Scale,
        title: "Gestión Técnica en Provincia (ARBA)",
        description:
            "Optimización de alícuotas y gestión de trámites ante ARBA para minimizar tu carga impositiva.",
    },
    {
        icon: FileText,
        title: "Convenio Multilateral",
        description:
            "Manejo experto para evitar la doble imposición cuando operás en múltiples jurisdicciones.",
    },
    {
        icon: ShieldCheck,
        title: "Limpieza de Padrones (SIRCREB)",
        description:
            "Reducción de retenciones bancarias innecesarias mediante gestión y actualización de padrones.",
    },
];

const semaforoItems = [
    {
        icon: TrendingUp,
        title: "Monitoreo de Límites para Monotributistas",
        description:
            "Seguimiento constante de facturación y parámetros para evitar exclusiones sorpresivas.",
    },
    {
        icon: AlertTriangle,
        title: "Alertas Preventivas de Recategorización",
        description:
            "Te avisamos antes de que cambien tu categoría para que puedas planificar con tiempo.",
    },
    {
        icon: CheckCircle2,
        title: "Planificación para Responsable Inscripto",
        description:
            "Cuando llegue el momento del salto, lo hacemos de forma ordenada y sin sobresaltos fiscales.",
    },
];

const ssnItems = [
    {
        icon: BookOpen,
        title: "Rúbrica Digital",
        description:
            "Carga y gestión de los Libros de Operaciones y Cobranzas requeridos por la SSN, siempre al día.",
    },
    {
        icon: Search,
        title: "Auditoría de Consistencia AFIP-SSN",
        description:
            "Cruce de información entre AFIP y SSN para detectar y corregir inconsistencias antes de cualquier inspección.",
    },
];

export default function ContabilidadPage() {
    const [activationOpen, setActivationOpen] = useState(false);

    return (
        <main className="min-h-screen bg-background">
            {/* ─── Hero ─── */}
            <section className="relative overflow-hidden px-6 pb-20 pt-16">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-3xl" />
                </div>

                <div className="relative z-10 mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <Link
                            href="/"
                            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al Inicio
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
                    >
                        <Calculator className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Add-On · $50 USD / mes
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
                    >
                        Solución Integral para el PAS:
                        <br />
                        <span className="text-primary">Tu Gestión Contable On-Demand.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Impulsando tu crecimiento, simplificando tu gestión. Dejá lo
                        tributario en manos de expertos y enfocate en lo que mejor sabés
                        hacer: vender seguros.
                    </motion.p>
                </div>
            </section>

            {/* ─── Compliance y Gestión de Ingresos ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Compliance y Gestión de Ingresos
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Nos aseguramos de que cobres rápido y de forma correcta, con cada
                            número auditado y cada retención bajo control.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {complianceItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="mb-2 font-semibold text-foreground">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Estrategia en IIBB ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1">
                            <TrendingUp className="h-4 w-4 text-accent" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                                Maximización del Ingreso Neto
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Estrategia en Ingresos Brutos (IIBB)
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Cada jurisdicción tiene sus reglas. Nosotros las dominamos para que
                            pagues lo justo y nada más.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {iibbItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── El Semáforo Fiscal ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
                                Protección
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            El Semáforo Fiscal
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Protegemos tu condición fiscal para que no tengas sorpresas con
                            AFIP. Anticipamos problemas antes de que sucedan.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {semaforoItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                            >
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="mb-2 font-semibold text-foreground">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Soporte Normativo SSN ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Soporte Normativo SSN
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Tranquilidad total ante inspecciones de la Superintendencia de
                            Seguros de la Nación. Tu documentación, siempre en regla.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {ssnItems.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                    <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="mb-1 font-semibold text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Footer ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center md:p-12"
                    >
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
                            <Calculator className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
                            Activá Contabilidad Expert
                        </h2>
                        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
                            Sumá este Add-On a tu membresía por solo{" "}
                            <span className="font-bold text-primary">$50 USD / mes</span> y
                            olvidate de la gestión contable para siempre.
                        </p>

                        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                            <button
                                type="button"
                                onClick={() => setActivationOpen(true)}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:opacity-90 sm:w-auto"
                            >
                                Contactar para Activar
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>
                            <Link
                                href="/"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                ← Volver al Inicio
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <ContabilidadActivationModal
                open={activationOpen}
                onOpenChange={setActivationOpen}
            />
        </main>
    );
}
