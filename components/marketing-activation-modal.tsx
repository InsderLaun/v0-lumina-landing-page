"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Video, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

/* ─── component ─── */
interface MarketingActivationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MarketingActivationModal({
    open,
    onOpenChange,
}: MarketingActivationModalProps) {
    const [nombre, setNombre] = React.useState("");
    const [apellido, setApellido] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [matricula, setMatricula] = React.useState("");
    const [redSocial, setRedSocial] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [error, setError] = React.useState("");
    const [showTerms, setShowTerms] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            setNombre("");
            setApellido("");
            setEmail("");
            setMatricula("");
            setRedSocial("");
            setSubmitting(false);
            setSubmitted(false);
            setError("");
            setShowTerms(false);
        }
    }, [open]);

    const isValid = nombre.trim() && apellido.trim() && email.trim() && matricula.trim();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!isValid || submitting) return;

        setSubmitting(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget);
            formData.append("_replyto", email.trim());

            const res = await fetch("https://formspree.io/f/mnjbpyry", {
                method: "POST",
                body: formData,
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                console.error("Formspree error:", res.status, data);
                throw new Error("Error");
            }
            setSubmitted(true);
            setTimeout(() => onOpenChange(false), 2000);
        } catch {
            setError("Hubo un error al enviar. Intentá de nuevo.");
        } finally {
            setSubmitting(false);
        }
    }

    /* ─── input styles ─── */
    const inputClass =
        "w-full rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0a] px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-[#D4AF37]/20 bg-[#0d0d0d] text-white sm:max-w-md p-0 gap-0 overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* ─── Terms View ─── */}
                    {showTerms ? (
                        <motion.div
                            key="terms"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col max-h-[80vh]"
                        >
                            <div className="flex items-center gap-3 border-b border-[#D4AF37]/20 px-5 py-4">
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D4AF37]/20 text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </button>
                                <h3 className="text-sm font-bold text-[#D4AF37]">
                                    Términos y Condiciones
                                </h3>
                            </div>
                            <div className="overflow-y-auto px-5 py-4 text-xs leading-relaxed text-white/70 space-y-4 max-h-[60vh]">
                                <p className="font-bold text-[#D4AF37] text-sm">
                                    SERVICIO &quot;MARKETING PACK&quot; – LUMINA
                                </p>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">1. OBJETO Y ALCANCE DEL SERVICIO</p>
                                    <p>El presente documento regula la prestación del servicio &quot;Marketing Pack&quot;, un add-on on-demand de Lumina exclusivo para Productores Asesores de Seguros (PAS). Comprende:</p>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li><strong>Fábrica de Contenidos:</strong> Edición de hasta 12 videos mensuales (Reels/TikTok).</li>
                                        <li><strong>Gestión de Google Ads:</strong> Configuración de campañas de búsqueda (sin fee de agencia).</li>
                                        <li><strong>Posicionamiento Local:</strong> Asesoramiento en Google My Business.</li>
                                        <li><strong>Consultoría:</strong> Diagnóstico trimestral y webinars.</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">2. DINÁMICA DE PRODUCCIÓN Y RESPONSABILIDAD DEL PAS</p>
                                    <p>El PAS proveerá el material en bruto (crudo) siguiendo los guiones de Lumina. Los 12 videos mensuales no son acumulables; si el PAS omite enviar el material en plazo, perderá el cupo semanal sin derecho a reclamo.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">3. EXCLUSIÓN DE INVERSIÓN PUBLICITARIA (PAUTA)</p>
                                    <p>El costo mensual cubre única y exclusivamente la edición y gestión técnica. Toda inversión monetaria en pauta publicitaria (Google Ads/Meta Ads) corre por cuenta, orden y cargo exclusivo del PAS. Lumina no financia ni administra fondos de pauta.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">4. OBLIGACIÓN DE MEDIOS Y EXENCIÓN DE GARANTÍAS</p>
                                    <p>Lumina asume una obligación de medios (edición, subtitulado, estrategia). Lumina no garantiza un número específico de visualizaciones, leads o ventas.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">5. POLÍTICAS DE PLATAFORMAS DE TERCEROS</p>
                                    <p>Lumina no asume responsabilidad ante suspensiones o bloqueos de cuentas ejecutados unilateralmente por empresas de terceros (Google, Meta, TikTok) por cambios en políticas o infracciones previas del PAS.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">6. DERECHOS DE IMAGEN</p>
                                    <p>El PAS autoriza expresamente a Lumina a intervenir, editar, co-brandear y procesar su imagen y voz. El PAS declara que su material no infringe derechos de propiedad intelectual de terceros.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">7. CONDICIONES ECONÓMICAS Y JURISDICCIÓN</p>
                                    <p>Costo mensual: $50 USD. La falta de pago faculta a Lumina a suspender el servicio. Las partes se someten a la jurisdicción de los Tribunales Ordinarios de San Isidro.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : submitted ? (
                        /* ─── Success View ─── */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 py-10 text-center"
                        >
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#D4AF37]/40 bg-[#D4AF37]/10">
                                <Video className="h-7 w-7 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#D4AF37]">
                                ¡Solicitud enviada con éxito!
                            </h3>
                            <p className="mt-2 text-sm text-white/60">
                                Nuestro equipo se pondrá en contacto para activar tu Marketing Pack.
                            </p>
                            <button
                                type="button"
                                onClick={() => onOpenChange(false)}
                                className="mt-6 rounded-lg border border-[#D4AF37]/30 px-6 py-2 text-sm font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37]/10"
                            >
                                Cerrar
                            </button>
                        </motion.div>
                    ) : (
                        /* ─── Form View ─── */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader className="px-5 pt-5 pb-4 border-b border-[#D4AF37]/15">
                                <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1 w-fit">
                                    <Video className="h-3.5 w-3.5 text-[#D4AF37]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                                        Activación
                                    </span>
                                </div>
                                <DialogTitle className="text-base font-bold text-white">
                                    Marketing Pack
                                </DialogTitle>
                                <DialogDescription className="text-xs text-white/50">
                                    Completá tus datos para activar el servicio · $50 USD/mes
                                </DialogDescription>
                            </DialogHeader>

                            <form action="https://formspree.io/f/mnjbpyry" method="POST" onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
                                <input type="hidden" name="servicio" value="Marketing Pack" />
                                <input type="hidden" name="_subject" value="Nueva Alta - Marketing Pack" />

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Juan"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            required
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                            placeholder="Pérez"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="juan@email.com"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                        Matrícula SSN *
                                    </label>
                                    <input
                                        type="number"
                                        name="matricula_ssn"
                                        required
                                        value={matricula}
                                        onChange={(e) => setMatricula(e.target.value)}
                                        placeholder="Ingrese su matrícula de productor"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/50">
                                        Instagram / TikTok <span className="text-white/30">(opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="red_social"
                                        value={redSocial}
                                        onChange={(e) => setRedSocial(e.target.value)}
                                        placeholder="@tu_usuario"
                                        className={inputClass}
                                    />
                                </div>

                                {error && (
                                    <p className="text-xs text-red-400">{error}</p>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={!isValid || submitting}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-[#D4AF37]/90 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            "ACTIVAR"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(true)}
                                        className="flex-1 rounded-lg border border-[#D4AF37]/40 px-4 py-2.5 text-sm font-semibold text-[#D4AF37] transition-all hover:bg-[#D4AF37]/10"
                                    >
                                        Términos y Condiciones
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
