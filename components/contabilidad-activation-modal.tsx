"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calculator, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

/* ─── component ─── */
interface ContabilidadActivationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ContabilidadActivationModal({
    open,
    onOpenChange,
}: ContabilidadActivationModalProps) {
    const [nombre, setNombre] = React.useState("");
    const [apellido, setApellido] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [matricula, setMatricula] = React.useState("");
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
            formData.append("_subject", "Activación Contabilidad Expert");
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
                                    SERVICIO &quot;CONTABILIDAD EXPERT&quot; – LUMINA
                                </p>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">1. OBJETO Y ALCANCE DEL SERVICIO</p>
                                    <p>El presente documento regula la prestación del servicio &quot;Contabilidad Expert&quot; (en adelante, &quot;el Servicio&quot;), un add-on on-demand de la organización Lumina. El Servicio comprende la gestión integral de comisiones, la facturación centralizada y la auditoría técnica de liquidaciones emitidas por las Compañías de Seguros (Cias) frente a la producción real declarada por el Productor Asesor de Seguros (en adelante, &quot;el PAS&quot;).</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">2. ESTRATEGIA TAX & COMPLIANCE</p>
                                    <p>El Servicio incluye el asesoramiento y ejecución de las siguientes tareas fiscales:</p>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li><strong>Ingresos Brutos:</strong> Determinación de alícuotas y aplicación de exenciones vigentes en CABA (AGIP), Provincia de Buenos Aires (ARBA) y gestión bajo el régimen de Convenio Multilateral para evitar la doble imposición.</li>
                                        <li><strong>Optimización de Retenciones:</strong> Monitoreo y aplicación de certificados de retención (IVA, Ganancias e IIBB) como pago a cuenta de tributos.</li>
                                        <li><strong>Semáforo Fiscal:</strong> Sistema de monitoreo preventivo sobre los límites de facturación para el mantenimiento de la categoría de Monotributo y planificación estratégica ante el eventual traspaso al régimen de Responsable Inscripto.</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">3. SOPORTE NORMATIVO ANTE LA SSN</p>
                                    <p>Lumina asume la gestión de la Rúbrica Digital, procediendo a la carga y administración de los Libros de Operaciones y de Cobranzas en los formatos exigidos por la Superintendencia de Seguros de la Nación (SSN). Se incluye una auditoría de consistencia para garantizar que la información declarada ante los organismos fiscales (AFIP) coincida plenamente con los registros de la SSN.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">4. OBLIGACIONES Y RESPONSABILIDAD DEL PAS</p>
                                    <p>El PAS asume la responsabilidad exclusiva por la veracidad, integridad y exactitud de la información y documentación aportada.</p>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li><strong>Declaración Jurada:</strong> La validación de la Matrícula SSN mediante el formulario de activación constituye una Declaración Jurada de identidad y vigencia de la habilitación profesional.</li>
                                        <li><strong>Carga de Datos:</strong> El PAS es responsable de suministrar en tiempo y forma los comprobantes de gastos operativos necesarios para la correcta liquidación de impuestos.</li>
                                        <li><strong>Indemnidad:</strong> El PAS mantendrá indemne a Lumina por cualquier sanción, multa o perjuicio derivado de información falsa, incompleta o suministrada fuera de los plazos legales por parte del PAS o de las Compañías de Seguros.</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">5. LIMITACIÓN DE RESPONSABILIDAD (EXCLUSIÓN)</p>
                                    <p>Lumina actúa como un gestor de medios y no de resultados específicos.</p>
                                    <ul className="list-disc pl-4 mt-1 space-y-1">
                                        <li><strong>Fallos de Terceros:</strong> Lumina no será responsable por inconsistencias, demoras o errores derivados de las liquidaciones de las Compañías de Seguros o de fallas sistémicas en las plataformas de AFIP, SSN o entes provinciales.</li>
                                        <li><strong>Inconsistencias Previas:</strong> Se excluye expresamente cualquier responsabilidad por contingencias fiscales o normativas originadas con anterioridad a la contratación efectiva del Servicio.</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">6. CONDICIONES ECONÓMICAS</p>
                                    <p>El Servicio tiene un costo mensual de 50 USD (Cincuenta Dólares Estadounidenses), el cual será facturado y cobrado a través de los sistemas de suscripción de la plataforma Lumina. La falta de pago facultará a Lumina a la suspensión inmediata del soporte normativo y la carga de libros digitales.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">7. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS</p>
                                    <p>Toda la información personal, comercial y fiscal del PAS será tratada con absoluta confidencialidad, bajo los estándares de la Ley 25.326 de Protección de Datos Personales. Los datos serán utilizados exclusivamente para los fines técnicos aquí descriptos.</p>
                                </div>

                                <div>
                                    <p className="font-semibold text-white/90 mb-1">8. JURISDICCIÓN Y COMPETENCIA</p>
                                    <p>Para todos los efectos legales derivados del presente, las partes se someten a la jurisdicción de los Tribunales Ordinarios del Departamento Judicial de San Isidro, renunciando a cualquier otro fuero o jurisdicción que pudiera corresponderles.</p>
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
                                <Calculator className="h-7 w-7 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#D4AF37]">
                                ¡Solicitud enviada con éxito!
                            </h3>
                            <p className="mt-2 text-sm text-white/60">
                                Nuestro equipo se pondrá en contacto para activar tu servicio Contabilidad Expert.
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
                                    <Calculator className="h-3.5 w-3.5 text-[#D4AF37]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                                        Activación
                                    </span>
                                </div>
                                <DialogTitle className="text-base font-bold text-white">
                                    Contabilidad Expert
                                </DialogTitle>
                                <DialogDescription className="text-xs text-white/50">
                                    Completá tus datos para activar el servicio · $50 USD/mes
                                </DialogDescription>
                            </DialogHeader>

                            <form action="https://formspree.io/f/mnjbpyry" method="POST" onSubmit={handleSubmit} className="px-5 py-4 space-y-3.5">
                                <input type="hidden" name="servicio" value="Contabilidad Expert – $50 USD/mes" />
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
