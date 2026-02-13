"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const registrationSchema = z.object({
  nombreApellido: z
    .string()
    .min(3, "El nombre completo debe tener al menos 3 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  telefono: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .regex(/^[\d\s\-+()]+$/, "Formato de teléfono inválido"),
  matriculaSSN: z.string().optional(),
  experiencia: z.string().min(1, "Selecciona tu experiencia"),
  operaOrganizacion: z.enum(["si", "no"], {
    required_error: "Selecciona una opción",
  }),
  facturacion: z.string().min(1, "Selecciona tu rango de facturación"),
  plan: z.enum(["gratis", "full"], {
    required_error: "Selecciona un plan",
  }),
});

type RegistrationData = z.infer<typeof registrationSchema>;

interface RegistrationFormProps {
  initialPlan?: "gratis" | "full";
}

export function RegistrationForm({ initialPlan }: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nombreApellido: "",
      email: "",
      telefono: "",
      matriculaSSN: "",
      experiencia: "",
      operaOrganizacion: undefined,
      facturacion: "",
      plan: initialPlan || undefined,
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);

    try {
      const formPayload = {
        nombre: data.nombreApellido,
        email: data.email,
        whatsapp: data.telefono,
        matricula_ssn: data.matriculaSSN || "No proporcionada",
        experiencia: data.experiencia,
        organizacion: data.operaOrganizacion === "si" ? "Sí" : "No",
        facturacion: data.facturacion,
        plan:
          data.plan === "gratis"
            ? "Plan Digital ($0)"
            : "Membresía Full ($150 USD)",
      };

      const response = await fetch("https://formspree.io/f/mnjbpyry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el formulario");
      }

      setIsSuccess(true);
    } catch {
      form.setError("root", {
        message:
          "Hubo un error al enviar tu solicitud. Por favor intentá de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-12 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {"¡Postulación Recibida con Éxito!"}
        </h2>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          {"Nuestros asesores se contactará con vos a la brevedad para enviarte tu Diagnóstico de Rentabilidad."}
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Inicio
        </Link>
      </motion.div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nombre y Apellido */}
        <FormField
          control={form.control}
          name="nombreApellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                Nombre y Apellido
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Juan Pérez"
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email & Teléfono */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  Correo Electrónico Profesional
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan@tuseguros.com"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  {"Teléfono / WhatsApp"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+54 11 1234-5678"
                    className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Matrícula SSN */}
        <FormField
          control={form.control}
          name="matriculaSSN"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {"Matrícula SSN"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ej: 12345"
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-muted-foreground/70">
                Opcional. Si ya tenés tu matrícula de la SSN.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experiencia & Facturación */}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="experiencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  {"Años de Experiencia"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-primary">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="menos-2">
                      {"Menos de 2 años"}
                    </SelectItem>
                    <SelectItem value="2-5">{"2 a 5 años"}</SelectItem>
                    <SelectItem value="mas-5">
                      {"Más de 5 años"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facturacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">
                  {"Facturación Mensual Aprox."}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-border bg-secondary text-foreground focus:ring-primary">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hasta-1m">Hasta $1M</SelectItem>
                    <SelectItem value="1m-5m">$1M a $5M</SelectItem>
                    <SelectItem value="mas-5m">{"Más de $5M"}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Opera Organización */}
        <FormField
          control={form.control}
          name="operaOrganizacion"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-foreground">
                {"¿Operás actualmente a través de una Organización?"}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="si" id="opera-si" />
                    <Label
                      htmlFor="opera-si"
                      className="cursor-pointer text-sm font-medium text-foreground"
                    >
                      {"Sí"}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="opera-no" />
                    <Label
                      htmlFor="opera-no"
                      className="cursor-pointer text-sm font-medium text-foreground"
                    >
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Plan Selection */}
        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-foreground">
                {"Plan de Interés"}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  {/* Plan Gratis */}
                  <label
                    className={cn(
                      "group relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-5 transition-all",
                      field.value === "gratis"
                        ? "border-accent bg-accent/5"
                        : "border-border bg-card hover:border-accent/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          Plan Digital
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {"Solo Organización"}
                        </p>
                      </div>
                      <RadioGroupItem value="gratis" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      $0
                      <span className="text-sm font-normal text-muted-foreground">
                        {" / mes"}
                      </span>
                    </p>
                  </label>

                  {/* Membresía Full */}
                  <label
                    className={cn(
                      "group relative flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-5 transition-all",
                      field.value === "full"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="absolute -top-2.5 right-3">
                      <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                        Recomendado
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">
                          {"Membresía Full"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {"Organización + Servicios"}
                        </p>
                      </div>
                      <RadioGroupItem value="full" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      $150
                      <span className="text-sm font-normal text-muted-foreground">
                        {" USD / mes"}
                      </span>
                    </p>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Root error */}
        {form.formState.errors.root && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Solicitar mi Alta
              </>
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
