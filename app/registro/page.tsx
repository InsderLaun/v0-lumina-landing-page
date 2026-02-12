import { Suspense } from "react";
import { RegistrationContent } from "./registration-content";

export const metadata = {
  title: "Registro | Lumina - Organización de Seguros",
  description:
    "Completá tu solicitud de alta en Lumina. Elegí entre el Plan Digital gratuito o la Membresía Full con acceso a Coworking Premium.",
};

export default function RegistroPage() {
  return (
    <Suspense>
      <RegistrationContent />
    </Suspense>
  );
}
