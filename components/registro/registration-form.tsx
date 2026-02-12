"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  CheckCircle2,
  FileText,
  X,
  Loader2,
  Building2,
  Smartphone,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Datos Personales", number: 1 },
  { label: "Selección de Perfil", number: 2 },
  { label: "Documentación", number: 3 },
  { label: "Confirmación", number: 4 },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const step1Schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  dni: z
    .string()
    .min(7, "El DNI debe tener al menos 7 dígitos")
    .max(8, "El DNI no puede tener más de 8 dígitos")
    .regex(/^\d+$/, "El DNI solo debe contener números"),
  domicilio: z
    .string()
    .min(5, "El domicilio debe tener al menos 5 caracteres"),
  email: z.string().email("Ingresá un email válido"),
  telefono: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^[\d\s\-+()]+$/, "Formato de teléfono inválido"),
  facturacionMensual: z
    .string()
    .min(1, "Ingresá tu facturación mensual estimada")
    .regex(/^\d+$/, "Solo números"),
});

const step2Schema = z.object({
  plan: z.enum(["A", "B"], {
    required_error: "Seleccioná un plan",
  }),
});

const baseDocsSchema = z.object({
  matricula: z
    .instanceof(File, { message: "Subí tu Matrícula Profesional" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "El archivo no debe superar 10MB"),
  polizaRC: z
    .instanceof(File, { message: "Subí tu Póliza de Seguro RC" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "El archivo no debe superar 10MB"),
  constanciaAFIP: z
    .instanceof(File, { message: "Subí tu Constancia de Inscripción AFIP" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "El archivo no debe superar 10MB"),
  aceptoConvenio: z.literal(true, {
    errorMap: () => ({ message: "Debés aceptar el Convenio de Organización" }),
  }),
  aceptoNDA: z.literal(true, {
    errorMap: () => ({
      message: "Debés aceptar el Acuerdo de Confidencialidad",
    }),
  }),
});

const fullDocsSchema = baseDocsSchema.extend({
  aceptoMembresia: z.literal(true, {
    errorMap: () => ({
      message: "Debés aceptar el Contrato de Membresía",
    }),
  }),
  aceptoFee: z.literal(true, {
    errorMap: () => ({
      message: "Debés dar consentimiento expreso del Fee",
    }),
  }),
  comprobanteCBU: z
    .instanceof(File, { message: "Subí tu comprobante de CBU/Tarjeta" })
    .refine((f) => f.size <= MAX_FILE_SIZE, "El archivo no debe superar 10MB"),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

interface FileUploadZoneProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  error?: string;
  accept?: string;
}

function FileUploadZone({
  label,
  file,
  onFileSelect,
  onFileClear,
  error,
  accept = ".pdf,.jpg,.jpeg,.png",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) onFileSelect(droppedFile);
    },
    [onFileSelect]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-accent" />
          <span className="flex-1 truncate text-sm text-foreground">
            {file.name}
          </span>
          <button
            type="button"
            onClick={onFileClear}
            className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Quitar archivo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 transition-all",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-secondary/50",
            error && "border-destructive"
          )}
        >
          <Upload
            className={cn(
              "h-6 w-6",
              isDragging ? "text-primary" : "text-muted-foreground"
            )}
          />
          <div className="text-center">
            <span className="text-sm font-medium text-foreground">
              Arrastrá o{" "}
            </span>
            <span className="text-sm font-medium text-primary">
              seleccioná un archivo
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            PDF, JPG o PNG (max. 10MB)
          </span>
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) onFileSelect(selected);
            }}
          />
        </div>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface RegistrationFormProps {
  initialPlan?: "A" | "B";
}

export function RegistrationForm({ initialPlan }: RegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Step 1 Form
  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      domicilio: "",
      email: "",
      telefono: "",
      facturacionMensual: "",
    },
  });

  // Step 2 Form
  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      plan: initialPlan || undefined,
    },
  });

  // Step 3 - file states (managed manually since zod file validation is complex with react-hook-form)
  const [files, setFiles] = useState<Record<string, File | null>>({
    matricula: null,
    polizaRC: null,
    constanciaAFIP: null,
    comprobanteCBU: null,
  });
  const [checks, setChecks] = useState<Record<string, boolean>>({
    aceptoConvenio: false,
    aceptoNDA: false,
    aceptoMembresia: false,
    aceptoFee: false,
  });
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});

  const selectedPlan = step2Form.watch("plan");

  const setFile = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    if (file) {
      setStep3Errors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const setCheck = (key: string, val: boolean) => {
    setChecks((prev) => ({ ...prev, [key]: val }));
    if (val) {
      setStep3Errors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!files.matricula)
      errors.matricula = "Subí tu Matrícula Profesional";
    if (!files.polizaRC)
      errors.polizaRC = "Subí tu Póliza de Seguro RC";
    if (!files.constanciaAFIP)
      errors.constanciaAFIP = "Subí tu Constancia de Inscripción AFIP";
    if (!checks.aceptoConvenio)
      errors.aceptoConvenio = "Debés aceptar el Convenio de Organización";
    if (!checks.aceptoNDA)
      errors.aceptoNDA = "Debés aceptar el Acuerdo de Confidencialidad";

    if (selectedPlan === "B") {
      if (!checks.aceptoMembresia)
        errors.aceptoMembresia = "Debés aceptar el Contrato de Membresía";
      if (!checks.aceptoFee)
        errors.aceptoFee = "Debés dar consentimiento expreso del Fee";
      if (!files.comprobanteCBU)
        errors.comprobanteCBU = "Subí tu comprobante de CBU/Tarjeta";
    }

    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      const valid = await step1Form.trigger();
      if (!valid) return;
    } else if (currentStep === 1) {
      const valid = await step2Form.trigger();
      if (!valid) return;
    } else if (currentStep === 2) {
      if (!validateStep3()) return;
    }
    setCurrentStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call / form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Build form data for future integration (Formspree, mailto, etc.)
    const _formData = {
      ...step1Form.getValues(),
      plan: step2Form.getValues().plan,
      files: Object.entries(files)
        .filter(([, f]) => f !== null)
        .map(([key, f]) => ({ key, name: f!.name, size: f!.size })),
      agreements: checks,
    };

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-16 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
          Solicitud Recibida
        </h2>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          Hemos enviado los detalles a{" "}
          <span className="font-semibold text-primary">
            agustintiberio@lumina-org.com
          </span>
          . Te contactaremos en 24hs para darte el alta.
        </p>
        <a
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </a>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  i < currentStep
                    ? "border-accent bg-accent text-accent-foreground"
                    : i === currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-muted-foreground"
                )}
              >
                {i < currentStep ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "hidden text-center text-xs font-medium sm:block",
                  i <= currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mb-5 hidden h-0.5 flex-1 rounded-full sm:block",
                  i < currentStep ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Form {...step1Form}>
              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={step1Form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Juan"
                            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="apellido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Apellido</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pérez"
                            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={step1Form.control}
                    name="dni"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">DNI</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="12345678"
                            inputMode="numeric"
                            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={step1Form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+54 11 1234-5678"
                            type="tel"
                            className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={step1Form.control}
                  name="domicilio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Domicilio</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Av. Libertador 1234, CABA"
                          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan@email.com"
                          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name="facturacionMensual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Facturación Mensual Estimada (ARS)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="500000"
                          inputMode="numeric"
                          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Form {...step2Form}>
              <form className="space-y-6">
                <FormField
                  control={step2Form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Seleccioná tu plan
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          {/* Option A */}
                          <label
                            className={cn(
                              "group relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-6 transition-all",
                              field.value === "A"
                                ? "border-accent bg-accent/5"
                                : "border-border bg-card hover:border-accent/30"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl",
                                    field.value === "A"
                                      ? "bg-accent/20"
                                      : "bg-secondary"
                                  )}
                                >
                                  <Smartphone
                                    className={cn(
                                      "h-5 w-5",
                                      field.value === "A"
                                        ? "text-accent"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-foreground">
                                    Opción A
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Solo Organización
                                  </p>
                                </div>
                              </div>
                              <RadioGroupItem value="A" className="mt-1" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold text-foreground">
                                $0
                                <span className="text-base font-normal text-muted-foreground">
                                  {" "}
                                  / mes
                                </span>
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Operá con las mejores comisiones del mercado sin
                                costos fijos. Acceso digital completo.
                              </p>
                            </div>
                          </label>

                          {/* Option B */}
                          <label
                            className={cn(
                              "group relative flex cursor-pointer flex-col gap-4 rounded-2xl border-2 p-6 transition-all",
                              field.value === "B"
                                ? "border-primary bg-primary/5"
                                : "border-border bg-card hover:border-primary/30"
                            )}
                          >
                            <div className="absolute -top-3 right-4">
                              <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase text-primary-foreground">
                                Recomendado
                              </span>
                            </div>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl",
                                    field.value === "B"
                                      ? "bg-primary/20"
                                      : "bg-secondary"
                                  )}
                                >
                                  <Building2
                                    className={cn(
                                      "h-5 w-5",
                                      field.value === "B"
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-foreground">
                                    Opción B
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Híbrido (Organización + Servicios)
                                  </p>
                                </div>
                              </div>
                              <RadioGroupItem value="B" className="mt-1" />
                            </div>
                            <div>
                              <p className="text-3xl font-bold text-foreground">
                                $150
                                <span className="text-base font-normal text-muted-foreground">
                                  {" "}
                                  USD / mes
                                </span>
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Todo lo del Plan Digital más Coworking Premium,
                                Media Hub, eventos y networking.
                              </p>
                            </div>
                          </label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Documentación Requerida
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedPlan === "B"
                  ? "Subí la documentación requerida para el Plan Híbrido"
                  : "Subí la documentación requerida para el Alta Gratuita"}
              </p>
            </div>

            <div className="space-y-5">
              <FileUploadZone
                label="Foto Matrícula Profesional (Credencial SSN)"
                file={files.matricula}
                onFileSelect={(f) => setFile("matricula", f)}
                onFileClear={() => setFile("matricula", null)}
                error={step3Errors.matricula}
              />
              <FileUploadZone
                label="Póliza de Seguro RC (Responsabilidad Civil)"
                file={files.polizaRC}
                onFileSelect={(f) => setFile("polizaRC", f)}
                onFileClear={() => setFile("polizaRC", null)}
                error={step3Errors.polizaRC}
              />
              <FileUploadZone
                label="Constancia de Inscripción AFIP"
                file={files.constanciaAFIP}
                onFileSelect={(f) => setFile("constanciaAFIP", f)}
                onFileClear={() => setFile("constanciaAFIP", null)}
                error={step3Errors.constanciaAFIP}
              />

              {selectedPlan === "B" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-5"
                >
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm font-semibold text-primary">
                      Documentación adicional para Membresía Full
                    </p>
                  </div>
                  <FileUploadZone
                    label="Comprobante de CBU/Tarjeta para Débito Automático"
                    file={files.comprobanteCBU}
                    onFileSelect={(f) => setFile("comprobanteCBU", f)}
                    onFileClear={() => setFile("comprobanteCBU", null)}
                    error={step3Errors.comprobanteCBU}
                  />
                </motion.div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Acuerdos Legales
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="aceptoConvenio"
                    checked={checks.aceptoConvenio}
                    onCheckedChange={(val) =>
                      setCheck("aceptoConvenio", val === true)
                    }
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="aceptoConvenio"
                      className="cursor-pointer text-sm leading-relaxed text-foreground"
                    >
                      Acepto el{" "}
                      <span className="font-semibold text-primary underline">
                        Convenio de Organización
                      </span>
                    </label>
                    {step3Errors.aceptoConvenio && (
                      <p className="text-sm text-destructive">
                        {step3Errors.aceptoConvenio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="aceptoNDA"
                    checked={checks.aceptoNDA}
                    onCheckedChange={(val) =>
                      setCheck("aceptoNDA", val === true)
                    }
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor="aceptoNDA"
                      className="cursor-pointer text-sm leading-relaxed text-foreground"
                    >
                      Acepto el{" "}
                      <span className="font-semibold text-primary underline">
                        NDA (Acuerdo de Confidencialidad)
                      </span>
                    </label>
                    {step3Errors.aceptoNDA && (
                      <p className="text-sm text-destructive">
                        {step3Errors.aceptoNDA}
                      </p>
                    )}
                  </div>
                </div>

                {selectedPlan === "B" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3 border-t border-border pt-3"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="aceptoMembresia"
                        checked={checks.aceptoMembresia}
                        onCheckedChange={(val) =>
                          setCheck("aceptoMembresia", val === true)
                        }
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor="aceptoMembresia"
                          className="cursor-pointer text-sm leading-relaxed text-foreground"
                        >
                          Acepto el{" "}
                          <span className="font-semibold text-primary underline">
                            Contrato de Membresía Lumina Coworking S.A.
                          </span>{" "}
                          ($150 USD)
                        </label>
                        {step3Errors.aceptoMembresia && (
                          <p className="text-sm text-destructive">
                            {step3Errors.aceptoMembresia}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="aceptoFee"
                        checked={checks.aceptoFee}
                        onCheckedChange={(val) =>
                          setCheck("aceptoFee", val === true)
                        }
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor="aceptoFee"
                          className="cursor-pointer text-sm leading-relaxed text-foreground"
                        >
                          Consentimiento expreso de{" "}
                          <span className="font-semibold text-primary underline">
                            Fee
                          </span>
                        </label>
                        {step3Errors.aceptoFee && (
                          <p className="text-sm text-destructive">
                            {step3Errors.aceptoFee}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-6 text-lg font-bold text-foreground">
                Resumen de tu Solicitud
              </h3>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <SummaryItem
                    label="Nombre"
                    value={`${step1Form.getValues("nombre")} ${step1Form.getValues("apellido")}`}
                  />
                  <SummaryItem
                    label="DNI"
                    value={step1Form.getValues("dni")}
                  />
                  <SummaryItem
                    label="Email"
                    value={step1Form.getValues("email")}
                  />
                  <SummaryItem
                    label="Teléfono"
                    value={step1Form.getValues("telefono")}
                  />
                  <SummaryItem
                    label="Domicilio"
                    value={step1Form.getValues("domicilio")}
                  />
                  <SummaryItem
                    label="Facturación Mensual"
                    value={`$${Number(step1Form.getValues("facturacionMensual")).toLocaleString("es-AR")} ARS`}
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <SummaryItem
                    label="Plan Seleccionado"
                    value={
                      selectedPlan === "A"
                        ? "Opción A - Solo Organización (Gratis)"
                        : "Opción B - Híbrido ($150 USD/mes)"
                    }
                    highlight
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Documentos Adjuntos
                  </p>
                  <div className="space-y-1.5">
                    {Object.entries(files)
                      .filter(([, f]) => f !== null)
                      .map(([key, f]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 text-sm text-foreground/80"
                        >
                          <FileText className="h-4 w-4 text-accent" />
                          <span className="truncate">{f!.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground transition-all hover:border-primary/30 hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Siguiente
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Enviar Solicitud de Alta
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 text-sm",
          highlight ? "font-bold text-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
