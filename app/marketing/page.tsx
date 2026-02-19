"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Video,
    Film,
    Megaphone,
    MapPin,
    BarChart3,
    Users,
    Palette,
    ArrowRight,
    Clapperboard,
    Globe,
    MessageSquare,
    Mic,
    Lightbulb,
    Send,
    Building2,
} from "lucide-react";
import { MarketingActivationModal } from "@/components/marketing-activation-modal";

const contenidosItems = [
    {
        icon: Film,
        title: "12 Videos Mensuales",
        description:
            "Olvidate de grabar en tu casa: vení a las salas Media Hub de nuestros coworkings aliados. Vos ponés el talento en un entorno profesional; nosotros nos encargamos de la edición, subtítulos y viralización.",
    },
    {
        icon: Clapperboard,
        title: "Guiones Estratégicos",
        description:
            "Te proveemos los guiones para que grabes tu material en bruto. Nosotros nos encargamos de la post-producción.",
    },
    {
        icon: Palette,
        title: "Identidad Visual",
        description:
            "Subtitulado, co-branding y diseño gráfico alineado con tu marca personal y la estética Lumina.",
    },
];

const digitalItems = [
    {
        icon: Globe,
        title: "Google Ads",
        description:
            "Configuración y gestión técnica de campañas de búsqueda sin fee de agencia. Solo pagás tu pauta.",
    },
    {
        icon: MapPin,
        title: "Google My Business",
        description:
            "Posicionamiento local para que tus clientes potenciales te encuentren cuando busquen seguros cerca.",
    },
    {
        icon: MessageSquare,
        title: "Gestión de Redes",
        description:
            "Estrategia de publicación y grilla de contenidos para Instagram, TikTok y LinkedIn.",
    },
];

const consultoriaItems = [
    {
        icon: BarChart3,
        title: "Diagnóstico Trimestral",
        description:
            "Análisis de métricas y performance de tu presencia digital con recomendaciones accionables.",
    },
    {
        icon: Users,
        title: "Webinars Exclusivos",
        description:
            "Sesiones de capacitación en marketing digital para productores de seguros.",
    },
    {
        icon: Megaphone,
        title: "Marca Personal",
        description:
            "Estrategia de posicionamiento para diferenciarte y generar confianza en tu audiencia.",
    },
];

export default function MarketingPage() {
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
                        <Video className="h-4 w-4 text-primary" />
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
                        Tu Presencia Digital,
                        <br />
                        <span className="text-primary">Nuestra Especialidad.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Contenido profesional, posicionamiento digital y marca personal.
                        Todo lo que necesitás para destacar en el mundo digital del seguro,
                        sin ser un experto en marketing.
                    </motion.p>
                </div>
            </section>

            {/* ─── Fábrica de Contenidos ─── */}
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
                            <Film className="h-4 w-4 text-accent" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                                Producción Audiovisual
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Fábrica de Contenidos
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Videos profesionales listos para publicar. Vos ponés la cara,
                            nosotros hacemos el resto.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {contenidosItems.map((item, i) => (
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

            {/* ─── Media Hub Banner ─── */}
            <section className="px-6 py-16">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/30"
                    >
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-[#0d0d0d] to-[#0d0d0d]" />
                        <div className="absolute right-0 top-0 h-full w-1/2 opacity-[0.04]">
                            <div className="absolute right-8 top-8 h-32 w-32 rounded-full border-2 border-[#D4AF37]" />
                            <div className="absolute right-20 top-20 h-48 w-48 rounded-full border border-[#D4AF37]/50" />
                            <div className="absolute right-4 bottom-8 h-24 w-24 rounded-full border-2 border-[#D4AF37]" />
                        </div>

                        <div className="relative z-10 flex flex-col gap-8 p-8 md:flex-row md:items-center md:p-12">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                                <Mic className="h-10 w-10 text-[#D4AF37]" />
                            </div>
                            <div className="flex-1">
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1">
                                    <Building2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                                        Beneficio Premium
                                    </span>
                                </div>
                                <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                                    Acceso Exclusivo a <span className="text-[#D4AF37]">Salas Media Hub</span>
                                </h2>
                                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                                    Tu imagen es tu principal activo. Por eso, el Marketing Pack incluye
                                    acceso a espacios de grabación profesionales dentro de nuestra red
                                    de coworkings. Entorno corporativo, iluminación adecuada y acústica
                                    perfecta para que tu marca personal compita en las grandes ligas.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ─── Cómo Funciona ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12 text-center"
                    >
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            ¿Cómo Funciona?
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Del guion al reel en 3 pasos simples
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {[
                            {
                                step: "01",
                                icon: Lightbulb,
                                title: "Guion Listo",
                                description:
                                    "Recibís el guion con el tema de la semana. Solo tenés que leerlo y prepararte para grabar.",
                            },
                            {
                                step: "02",
                                icon: Mic,
                                title: "Acción en el Media Hub",
                                description:
                                    "Reservás tu turno y grabás tu material en nuestras salas de coworking equipadas, con la mejor luz y sin distracciones.",
                            },
                            {
                                step: "03",
                                icon: Send,
                                title: "Publicación",
                                description:
                                    "Nosotros editamos, subtitulamos y optimizamos. Vos solo aprobás y publicás.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.15 }}
                                className="relative rounded-2xl border border-border bg-card p-6 transition-colors hover:border-[#D4AF37]/30"
                            >
                                <span className="absolute right-4 top-4 text-3xl font-black text-[#D4AF37]/10">
                                    {item.step}
                                </span>
                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                                    <item.icon className="h-5 w-5 text-[#D4AF37]" />
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

            {/* ─── Presencia Digital ─── */}
            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
                            <Globe className="h-4 w-4 text-primary" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                Posicionamiento Online
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            Presencia Digital
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Que te encuentren donde buscan. Google Ads, Maps y redes sociales
                            trabajando para vos.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {digitalItems.map((item, i) => (
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

            {/* ─── Consultoría y Marca Personal ─── */}
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
                            Consultoría y Marca Personal
                        </h2>
                        <p className="mt-3 max-w-xl text-muted-foreground">
                            Estrategia, análisis y capacitación para que tu marca personal
                            genere confianza y autoridad.
                        </p>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {consultoriaItems.map((item, i) => (
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
                            <Video className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
                            Activá Marketing Pack
                        </h2>
                        <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
                            Sumá este Add-On a tu membresía por solo{" "}
                            <span className="font-bold text-primary">$50 USD / mes</span> y
                            empezá a construir tu marca personal digital.
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

            <MarketingActivationModal
                open={activationOpen}
                onOpenChange={setActivationOpen}
            />
        </main>
    );
}
