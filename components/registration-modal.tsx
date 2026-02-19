"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, UserPlus, ShieldCheck, ChevronDown, Calculator, Video, Crown } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ─── helpers ─── */
function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
}

/* ─── schema ─── */
const formSchema = z
    .object({
        nombre: z.string().min(2, "Ingresá tu nombre completo"),
        email: z.string().email("Ingresá un email válido"),
        telefono: z.string().min(6, "Ingresá un teléfono válido"),
        matricula: z.string().min(1, "La matrícula SSN es obligatoria"),
        referido: z.boolean(),
        nombreReferente: z.string().optional(),
        matriculaReferente: z.string().optional(),
        captchaAnswer: z.string().min(1, "Resolvé el captcha"),
        aceptaTerminos: z.literal(true, {
            errorMap: () => ({ message: "Debés aceptar los términos" }),
        }),
    })
    .refine(
        (d) => {
            if (d.referido) {
                return (
                    !!d.nombreReferente &&
                    d.nombreReferente.length >= 2 &&
                    !!d.matriculaReferente &&
                    d.matriculaReferente.length >= 1
                );
            }
            return true;
        },
        {
            message: "Completá los datos del referente",
            path: ["nombreReferente"],
        }
    );

type FormData = z.infer<typeof formSchema>;

/* ─── component ─── */
interface RegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPlan: string;
    onSuccess: () => void;
    onOpenTerms: () => void;
}

export function RegistrationModal({
    open,
    onOpenChange,
    selectedPlan,
    onSuccess,
    onOpenTerms,
}: RegistrationModalProps) {
    const [captcha, setCaptcha] = React.useState(generateCaptcha);
    const [submitting, setSubmitting] = React.useState(false);
    const [submitError, setSubmitError] = React.useState("");
    const [addonContabilidad, setAddonContabilidad] = React.useState(false);
    const [addonMarketing, setAddonMarketing] = React.useState(false);
    const isFull = selectedPlan === "full";

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: "",
            email: "",
            telefono: "",
            matricula: "",
            referido: false,
            nombreReferente: "",
            matriculaReferente: "",
            captchaAnswer: "",
            aceptaTerminos: undefined as unknown as true,
        },
    });

    const isReferido = watch("referido");

    // Reset captcha when modal opens
    React.useEffect(() => {
        if (open) {
            setCaptcha(generateCaptcha());
            reset();
            setSubmitError("");
            setAddonContabilidad(false);
            setAddonMarketing(false);
        }
    }, [open, reset]);

    const planLabel =
        selectedPlan === "gratis"
            ? "Plan Digital – Alta Gratis"
            : "Membresía Full – $150 USD/mes";

    async function onSubmit(data: FormData) {
        // Validate captcha
        if (parseInt(data.captchaAnswer, 10) !== captcha.answer) {
            setSubmitError("La respuesta del captcha es incorrecta.");
            setCaptcha(generateCaptcha());
            setValue("captchaAnswer", "");
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        try {
            // Build dynamic subject
            const addonsSelected: string[] = [];
            if (addonContabilidad) addonsSelected.push("Contabilidad Expert");
            if (addonMarketing) addonsSelected.push("Marketing Pack");

            let subject = isFull ? "Interés en Membresía Full" : "Interés en Plan Digital";
            if (addonsSelected.length > 0) {
                subject += " + " + addonsSelected.join(" + ");
            }

            const payload: Record<string, string> = {
                _subject: subject,
                plan: isFull ? "Membresía Full" : "Plan Digital (Gratis)",
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono,
                matricula_ssn: data.matricula,
            };

            if (isFull && addonsSelected.length > 0) {
                payload.addons = addonsSelected.join(", ");
            }

            if (data.referido && data.nombreReferente && data.matriculaReferente) {
                payload.referido_por = "Sí";
                payload.nombre_referente = data.nombreReferente;
                payload.matricula_referente = data.matriculaReferente;
            }

            const res = await fetch("https://formspree.io/f/mnjbpyry", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Error al enviar");

            onOpenChange(false);
            onSuccess();
        } catch {
            setSubmitError("Hubo un error al enviar. Intentá de nuevo.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-h-[90vh] border-border/50 bg-background text-foreground sm:max-w-lg p-0 gap-0 ${isFull ? "border-[#F5C347]/30" : ""}`}>
                <DialogHeader className={`px-6 pt-6 pb-4 border-b ${isFull ? "border-[#F5C347]/20" : "border-border/50"}`}>
                    <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 w-fit ${isFull ? "bg-[#F5C347]/10" : "bg-primary/10"}`}>
                        {isFull ? <Crown className="h-4 w-4 text-[#F5C347]" /> : <UserPlus className="h-4 w-4 text-primary" />}
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isFull ? "text-[#F5C347]" : "text-primary"}`}>
                            {isFull ? "Membresía Full" : "Registro"}
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold text-foreground">
                        Sumate a Lumina
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {planLabel}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh]">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5 px-6 py-5"
                    >
                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-nombre" className="text-foreground text-sm font-medium">
                                Nombre Completo <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="reg-nombre"
                                placeholder="Juan Pérez"
                                className="bg-secondary/50 border-border"
                                {...register("nombre")}
                            />
                            {errors.nombre && (
                                <p className="text-xs text-destructive">{errors.nombre.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-email" className="text-foreground text-sm font-medium">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="reg-email"
                                type="email"
                                placeholder="juan@email.com"
                                className="bg-secondary/50 border-border"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-telefono" className="text-foreground text-sm font-medium">
                                Teléfono <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="reg-telefono"
                                type="tel"
                                placeholder="+54 11 1234-5678"
                                className="bg-secondary/50 border-border"
                                {...register("telefono")}
                            />
                            {errors.telefono && (
                                <p className="text-xs text-destructive">{errors.telefono.message}</p>
                            )}
                        </div>

                        {/* Matrícula SSN */}
                        <div className="space-y-1.5">
                            <Label htmlFor="reg-matricula" className="text-foreground text-sm font-medium">
                                Matrícula SSN <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="reg-matricula"
                                placeholder="Ej: 12345"
                                className="bg-secondary/50 border-border"
                                {...register("matricula")}
                            />
                            {errors.matricula && (
                                <p className="text-xs text-destructive">
                                    {errors.matricula.message}
                                </p>
                            )}
                        </div>

                        {/* Referido checkbox */}
                        <div className="space-y-3 rounded-xl border border-border/50 bg-secondary/30 p-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="reg-referido"
                                    checked={isReferido}
                                    onCheckedChange={(checked) =>
                                        setValue("referido", checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="reg-referido"
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                >
                                    ¿Fuiste referido por otro PAS?
                                </Label>
                            </div>

                            <AnimatePresence>
                                {isReferido && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="space-y-3 pt-2">
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="reg-nombre-ref"
                                                    className="text-foreground text-sm font-medium"
                                                >
                                                    Nombre del Referente
                                                </Label>
                                                <Input
                                                    id="reg-nombre-ref"
                                                    placeholder="Nombre del PAS que te refirió"
                                                    className="bg-secondary/50 border-border"
                                                    {...register("nombreReferente")}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="reg-mat-ref"
                                                    className="text-foreground text-sm font-medium"
                                                >
                                                    Matrícula SSN del Referente
                                                </Label>
                                                <Input
                                                    id="reg-mat-ref"
                                                    placeholder="Ej: 54321"
                                                    className="bg-secondary/50 border-border"
                                                    {...register("matriculaReferente")}
                                                />
                                            </div>
                                            {errors.nombreReferente && (
                                                <p className="text-xs text-destructive">
                                                    {errors.nombreReferente.message}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Add-Ons (only for Full) */}
                        {isFull && (
                            <div className="space-y-3 rounded-xl border border-[#F5C347]/20 bg-[#F5C347]/5 p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    Personalizá tu Membresía Full con nuestros Add-Ons
                                </p>

                                <div className="space-y-3">
                                    {/* Contabilidad Expert */}
                                    <div
                                        role="checkbox"
                                        aria-checked={addonContabilidad}
                                        tabIndex={0}
                                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer select-none ${addonContabilidad
                                                ? "border-[#F5C347]/40 bg-[#F5C347]/10"
                                                : "border-border/50 bg-secondary/30 hover:border-[#F5C347]/20"
                                            }`}
                                        onClick={() => setAddonContabilidad((prev) => !prev)}
                                        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setAddonContabilidad((prev) => !prev); } }}
                                    >
                                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${addonContabilidad
                                                ? "border-[#F5C347] bg-[#F5C347] text-black"
                                                : "border-muted-foreground"
                                            }`}>
                                            {addonContabilidad && (
                                                <svg width="10" height="10" viewBox="0 0 15 15" fill="none"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3354 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.5553 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Calculator className="h-4 w-4 text-[#F5C347]" />
                                                <span className="text-sm font-semibold text-foreground">
                                                    Contabilidad Expert
                                                </span>
                                                <span className="text-xs font-bold text-[#F5C347]">(+$50 USD)</span>
                                            </div>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                Gestión de comisiones, estrategia de IIBB, Semáforo Fiscal y Rúbrica Digital SSN.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Marketing Pack */}
                                    <div
                                        role="checkbox"
                                        aria-checked={addonMarketing}
                                        tabIndex={0}
                                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer select-none ${addonMarketing
                                                ? "border-[#F5C347]/40 bg-[#F5C347]/10"
                                                : "border-border/50 bg-secondary/30 hover:border-[#F5C347]/20"
                                            }`}
                                        onClick={() => setAddonMarketing((prev) => !prev)}
                                        onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setAddonMarketing((prev) => !prev); } }}
                                    >
                                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${addonMarketing
                                                ? "border-[#F5C347] bg-[#F5C347] text-black"
                                                : "border-muted-foreground"
                                            }`}>
                                            {addonMarketing && (
                                                <svg width="10" height="10" viewBox="0 0 15 15" fill="none"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3354 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.5553 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" /></svg>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Video className="h-4 w-4 text-[#F5C347]" />
                                                <span className="text-sm font-semibold text-foreground">
                                                    Marketing Pack
                                                </span>
                                                <span className="text-xs font-bold text-[#F5C347]">(+$50 USD)</span>
                                            </div>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                Edición de video, gestión de redes sociales y posicionamiento de marca personal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Captcha */}
                        <div className="space-y-1.5">
                            <Label className="text-foreground text-sm font-medium flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Verificación: ¿Cuánto es {captcha.a} + {captcha.b}?
                            </Label>
                            <Input
                                id="reg-captcha"
                                type="number"
                                placeholder="Tu respuesta"
                                className="bg-secondary/50 border-border w-40"
                                {...register("captchaAnswer")}
                            />
                            {errors.captchaAnswer && (
                                <p className="text-xs text-destructive">
                                    {errors.captchaAnswer.message}
                                </p>
                            )}
                        </div>

                        {/* Términos */}
                        <div className="flex items-start gap-3">
                            <Checkbox
                                id="reg-terminos"
                                checked={watch("aceptaTerminos") === true}
                                onCheckedChange={(checked) =>
                                    setValue("aceptaTerminos", checked === true ? true : (undefined as unknown as true))
                                }
                            />
                            <Label
                                htmlFor="reg-terminos"
                                className="text-xs leading-relaxed text-muted-foreground cursor-pointer"
                            >
                                Al registrarte, aceptás los{" "}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onOpenTerms();
                                    }}
                                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                                >
                                    Términos y Condiciones del Plan de Referidos
                                </button>
                                . <span className="text-destructive">*</span>
                            </Label>
                        </div>
                        {errors.aceptaTerminos && (
                            <p className="text-xs text-destructive">
                                {errors.aceptaTerminos.message}
                            </p>
                        )}

                        {/* Error message */}
                        {submitError && (
                            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5">
                                <p className="text-sm text-destructive">{submitError}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar Registro"
                            )}
                        </button>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
