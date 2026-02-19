"use client";

import { motion } from "framer-motion";
import { Users, Crown, TrendingUp } from "lucide-react";

/* ─── VARIABLE DE CONTROL ─── */
const pasActuales = 0; // Cambiar este número manualmente al sumar un PAS

/* Cálculos automáticos */
const cuposComisiones = Math.max(0, 25 - pasActuales);
const cuposFull = Math.max(0, 100 - pasActuales);
const progressComisiones = Math.min((pasActuales / 25) * 100, 100);
const progressFull = Math.min((pasActuales / 100) * 100, 100);

export function CuposLumina() {
    return (
        <section className="px-6 py-20">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center"
                >
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5">
                        <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                            Cupos Limitados
                        </span>
                    </div>
                    <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        La Red Lumina tiene capacidad finita
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Para garantizar un servicio de excelencia, limitamos el ingreso de
                        nuevos productores.
                    </p>
                </motion.div>

                <div className="grid gap-6 sm:grid-cols-2">
                    {/* ─── Tarjeta Comisiones ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-card p-8"
                    >
                        {/* Subtle glow */}
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4AF37]/5 blur-3xl" />

                        <div className="relative z-10">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                    <Users className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Objetivo · 25 PAS
                                </span>
                            </div>

                            {/* Big number with glow animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.3,
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                className="mb-4"
                            >
                                <span
                                    className="text-7xl font-black tabular-nums text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                    style={{
                                        textShadow:
                                            "0 0 40px rgba(212,175,55,0.2), 0 0 80px rgba(212,175,55,0.1)",
                                    }}
                                >
                                    {cuposComisiones}
                                </span>
                            </motion.div>

                            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                                Cupos restantes para el{" "}
                                <span className="font-semibold text-foreground">
                                    Esquema de Comisiones Preferencial
                                </span>
                            </p>

                            {/* Progress bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{pasActuales} PAS activos</span>
                                    <span>25 máximo</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#D4AF37]/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${progressComisiones}%` }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 1.2,
                                            delay: 0.5,
                                            ease: "easeOut",
                                        }}
                                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]"
                                        style={{
                                            boxShadow: "0 0 12px rgba(212,175,55,0.4)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Tarjeta Membresía Full ─── */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/20 bg-card p-8"
                    >
                        {/* Subtle glow */}
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4AF37]/5 blur-3xl" />

                        <div className="relative z-10">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                                    <Crown className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Objetivo · 100 PAS
                                </span>
                            </div>

                            {/* Big number with glow animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4,
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                className="mb-4"
                            >
                                <span
                                    className="text-7xl font-black tabular-nums text-[#D4AF37] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                    style={{
                                        textShadow:
                                            "0 0 40px rgba(212,175,55,0.2), 0 0 80px rgba(212,175,55,0.1)",
                                    }}
                                >
                                    {cuposFull}
                                </span>
                            </motion.div>

                            <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                                Lugares disponibles para la{" "}
                                <span className="font-semibold text-foreground">
                                    Membresía Full Fundadores
                                </span>
                            </p>

                            {/* Progress bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{pasActuales} PAS activos</span>
                                    <span>100 máximo</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-[#D4AF37]/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${progressFull}%` }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 1.2,
                                            delay: 0.6,
                                            ease: "easeOut",
                                        }}
                                        className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]"
                                        style={{
                                            boxShadow: "0 0 12px rgba(212,175,55,0.4)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Micro copy */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="mt-6 text-center text-xs text-muted-foreground/60"
                >
                    Actualizado en tiempo real · {pasActuales} productores ya forman parte de la red
                </motion.p>
            </div>
        </section>
    );
}
