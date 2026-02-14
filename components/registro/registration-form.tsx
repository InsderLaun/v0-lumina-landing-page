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
import { Button } from "@/components/ui/button";
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
  referidoPor: z.string().optional(),
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
      referidoPor: "",
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
        referido_por: data.referidoPor || "Ninguno",
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
        className="flex flex-col items-center gap-8 py-12 text-center"
      >
        {/* Success message */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
          {"¡Postulación Recibida con Éxito!"}
        </h2>
        <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
          {"Gracias por sumarte a la evolución de Lumina. Analizaremos tu perfil y uno de nuestros agentes se comunicará con vos por WhatsApp a la brevedad."}
        </p>

        {/* Referral Card */}
        <div className="mt-2 w-full max-w-md rounded-2xl border border-primary/30 bg-card/60 p-6 text-left backdrop-blur-sm">
          <h3 className="text-lg font-bold text-foreground">
            {"🎁 ¿Querés tu Membresía Full GRATIS?"}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {"Referí a 5 colegas Productores. Compartí tu link y pediles que ingresen tu N° de Matrícula al registrarse. Cuando se activen, tu cuota queda 100% bonificada."}
          </p>
          <p className="mt-1 text-sm font-semibold text-primary">
            {"Tu red paga tu oficina."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full mt-6">
            <Button
              asChild
              className="flex-1 bg-[#F5C347] text-black hover:bg-[#F5C347]/90 font-semibold"
            >
              <a
                href="https://api.whatsapp.com/send?text=%C2%A1Hola%21%20Me%20acabo%20de%20sumar%20a%20Lumina%2C%20la%20nueva%20red%20para%20Productores%20de%20Seguros.%20Te%20dan%20comisiones%20del%20100%25%20directo%20de%20compa%C3%B1%C3%ADa.%20Anotate%20ac%C3%A1%3A%20https%3A%2F%2Flumina-org.com%20y%20pon%C3%A9%20mi%20N%C2%B0%20de%20Matr%C3%ADcula%20como%20referido%20as%C3%AD%20sumamos%20beneficios."
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Obtener mi Link de Referido
              </a>
            </Button>
            <Link href="/terminos-referidos" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-[#F5C347] text-[#F5C347] hover:bg-[#F5C347]/10"
              >
                {"Términos y Condiciones"}
              </Button>
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
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

        {/* Referido */}
        <FormField
          control={form.control}
          name="referidoPor"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">
                {"¿Fuiste referido por un colega?"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresá su N° de Matrícula o Nombre"
                  className="border-border bg-secondary text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
                  {...field}
                  name="referido_por"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground/70">
                {"Opcional. Si alguien te recomendó Lumina."}
              </FormDescription>
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
