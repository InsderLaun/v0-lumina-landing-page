"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, UserPlus, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";

interface SuccessScreenProps {
    onOpenTerms: () => void;
    onGoBack: () => void;
}

export function SuccessScreen({ onOpenTerms, onGoBack }: SuccessScreenProps) {
    const [referralOpen, setReferralOpen] = React.useState(false);

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-[#0a0a0a]">
                {/* Decorative glow */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#F5C347]/5 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-[#F5C347]/3 blur-[100px]" />
                    {/* Gold sparkle particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute h-1 w-1 rounded-full bg-[#F5C347]"
                            initial={{
                                x: `${Math.random() * 100}vw`,
                                y: `${Math.random() * 100}vh`,
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 4,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 mx-auto max-w-2xl px-6 py-12 text-center"
                >
                    {/* Check icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#F5C347]/30 bg-[#F5C347]/10"
                    >
                        <CheckCircle2 className="h-10 w-10 text-[#F5C347]" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-3 text-4xl font-bold tracking-tight text-[#F5C347] sm:text-5xl"
                    >
                        ¡Gracias por tu Interés!
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-6 text-xl font-medium text-white/90"
                    >
                        Bienvenido a la Comunidad Lumina
                    </motion.p>

                    {/* Decorative golden line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                        className="mx-auto mb-8 h-px w-48 bg-gradient-to-r from-transparent via-[#F5C347]/50 to-transparent"
                    />

                    {/* Body text */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mx-auto mb-12 max-w-lg text-base leading-relaxed text-white/60"
                    >
                        Hemos recibido tus datos. Nuestro equipo evaluará tu perfil y te
                        contactaremos en menos de 48 horas para coordinar los siguientes
                        pasos.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                    >
                        <button
                            type="button"
                            onClick={() => setReferralOpen(true)}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#F5C347] px-8 py-3.5 text-sm font-semibold text-black transition-all hover:bg-[#F5C347]/90 hover:shadow-lg hover:shadow-[#F5C347]/20 sm:w-auto"
                        >
                            <UserPlus className="h-4 w-4" />
                            Obtener mi link de referidos
                        </button>
                        <button
                            type="button"
                            onClick={onOpenTerms}
                            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#F5C347]/30 bg-transparent px-8 py-3.5 text-sm font-semibold text-[#F5C347] transition-all hover:border-[#F5C347]/60 hover:bg-[#F5C347]/5 sm:w-auto"
                        >
                            <FileText className="h-4 w-4" />
                            Términos y Condiciones del Plan de Referidos
                        </button>
                    </motion.div>

                    {/* Back button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-10 flex justify-center"
                    >
                        <button
                            type="button"
                            onClick={onGoBack}
                            className="text-sm font-medium text-white/40 transition-all hover:text-[#F5C347]/80 hover:underline hover:underline-offset-4"
                        >
                            ← Volver al Inicio
                        </button>
                    </motion.div>

                    {/* Lumina branding */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-10 flex items-center justify-center gap-2"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5C347]">
                            <span className="text-sm font-bold text-black">L</span>
                        </div>
                        <span className="text-sm font-medium text-white/40">Lumina</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Referral Dialog */}
            <Dialog open={referralOpen} onOpenChange={setReferralOpen}>
                <DialogContent className="border-[#F5C347]/20 bg-[#0a0a0a] text-white sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-[#F5C347]">
                            Tu Código es tu Matrícula SSN
                        </DialogTitle>
                        <DialogDescription className="text-[#F5C347]/80 font-medium">
                            En Lumina hacemos las cosas simples.
                        </DialogDescription>
                    </DialogHeader>
                    <p className="text-sm leading-relaxed text-white/60">
                        Tu código único de referente es tu Número de Matrícula de la SSN.
                        Simplemente decile a tu colega que ingrese tu número de matrícula en
                        el campo{" "}
                        <span className="font-medium text-white">
                            Matrícula del Referente
                        </span>{" "}
                        al momento de llenar su formulario de registro. Nuestro sistema lo
                        computará automáticamente a tu favor para que alcances tu Membresía
                        Full bonificada.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <Button
                            asChild
                            className="flex-1 bg-[#25D366] text-white hover:bg-[#25D366]/90 font-semibold"
                        >
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
                            <Button
                                variant="outline"
                                className="border-[#F5C347]/30 text-[#F5C347] hover:text-white hover:bg-[#F5C347]/10"
                            >
                                Cerrar
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
