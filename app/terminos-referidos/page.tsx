import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones - Programa de Referidos | Lumina",
  description:
    "Términos y Condiciones del Programa de Referidos 'Membresía Full 100% Bonificada' de Lumina.",
};

export default function TerminosReferidosPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Back button */}
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        {/* Title */}
        <h1 className="text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {"Términos y Condiciones: Programa de Referidos"}
        </h1>
        <p className="mt-2 text-lg font-semibold text-primary/80">
          {'"Membresía Full 100% Bonificada"'}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {"Lumina \u2013 Red de Productores Asesores de Seguros"}
        </p>

        <hr className="my-10 border-border" />

        {/* Article 1 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 1: Objeto del Programa"}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {"El presente documento regula los Términos y Condiciones del Programa de Referidos de Lumina (en adelante, \u00ABel Programa\u00BB), cuyo objeto es incentivar el crecimiento de la red de Productores Asesores de Seguros (PAS) mediante la bonificación total del fee mensual de la Membresía Full para aquellos miembros que refieran exitosamente a nuevos colegas."}
          </p>
        </article>

        {/* Article 2 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 2: Definiciones"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"A los efectos del presente documento, se establecen las siguientes definiciones:"}
          </p>
          <ul className="list-inside list-disc space-y-3 text-muted-foreground">
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"PAS Referente:"}
              </span>{" "}
              {"Productor Asesor de Seguros activo en Lumina, suscrito a la Membresía Full, que refiere a nuevos productores."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"PAS Referido:"}
              </span>{" "}
              {"Nuevo Productor Asesor de Seguros que ingresa a Lumina mediante la recomendación de un PAS Referente y contrata la Membresía Full."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Código de Referido:"}
              </span>{" "}
              {"Número de Matrícula de la Superintendencia de Seguros de la Nación (SSN) del PAS Referente, utilizado para el tracking digital."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Objetivo 5x2:"}
              </span>{" "}
              {"Acumulación de cinco (5) PAS Referidos que permanezcan activos y abonen su fee mensual de la Membresía Full durante dos (2) meses consecutivos."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Bonificación:"}
              </span>{" "}
              {"Exención del 100% del fee mensual de la Membresía Full del PAS Referente."}
            </li>
          </ul>
        </article>

        {/* Article 3 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 3: Requisitos de Elegibilidad"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"3.1 Del PAS Referente:"}
          </h3>
          <p className="mb-3 leading-relaxed text-muted-foreground">
            {"Podrá participar del Programa todo PAS que cumpla los siguientes requisitos al momento de la referencia:"}
          </p>
          <ul className="mb-6 list-inside list-[lower-alpha] space-y-2 pl-4 text-muted-foreground">
            <li className="leading-relaxed">
              {"Tener un Contrato de Adhesión vigente con Lumina bajo la modalidad Membresía Full."}
            </li>
            <li className="leading-relaxed">
              {"Estar al día con el pago de su fee mensual."}
            </li>
            <li className="leading-relaxed">
              {"No registrar sanciones disciplinarias ni incumplimientos éticos en el ejercicio de la profesión."}
            </li>
          </ul>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"3.2 Del PAS Referido:"}
          </h3>
          <p className="mb-3 leading-relaxed text-muted-foreground">
            {"Será considerado PAS Referido válido quien cumpla taxativamente con lo siguiente:"}
          </p>
          <ul className="list-inside list-[lower-alpha] space-y-2 pl-4 text-muted-foreground">
            <li className="leading-relaxed">
              {"No haber operado previamente bajo el ecosistema de Lumina."}
            </li>
            <li className="leading-relaxed">
              {"Completar el proceso de onboarding digital ingresando el Código de Referido (Matrícula SSN) del PAS Referente en el formulario de alta."}
            </li>
            <li className="leading-relaxed">
              {"Suscribirse a la Membresía Full y abonar el fee correspondiente."}
            </li>
          </ul>
        </article>

        {/* Article 4 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 4: Mecánica y Tracking del Programa"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"4.1 Registro de Referidos:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"La asignación del referido se realiza de forma exclusiva y automatizada mediante el ingreso del número de matrícula del PAS Referente en la plataforma web al momento del alta. No se aceptarán reclamos de referidos que no hayan ingresado dicho código en su formulario inicial."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"4.2 Período de Validación (Maduración de 2 Meses):"}
          </h3>
          <p className="mb-3 leading-relaxed text-muted-foreground">
            {"Para que un PAS Referido sea validado dentro del \u00ABObjetivo 5x2\u00BB, deberá:"}
          </p>
          <ul className="list-inside list-[lower-alpha] space-y-2 pl-4 text-muted-foreground">
            <li className="leading-relaxed">
              {"Abonar su fee mensual de forma completa y antes del vencimiento durante sus primeros dos (2) meses calendario consecutivos."}
            </li>
            <li className="leading-relaxed">
              {"Mantener su producción y contrato activos sin suspensiones."}
            </li>
          </ul>
        </article>

        {/* Article 5 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 5: Aplicación de la Bonificación"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"5.1 Activación y Forma de Aplicación:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"Al consolidar el Objetivo 5x2, la Bonificación se activará el mes calendario inmediato siguiente. Lumina aplicará un descuento del 100% directamente en la facturación del fee mensual del PAS Referente."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"5.2 Permanencia de la Bonificación:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"El fee a costo $0 se mantendrá de forma indefinida mes a mes, estrictamente condicionado a que, en cada período de facturación, exista un mínimo de cinco (5) PAS Referidos de su red directa con contrato activo y cuota al día."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"5.3 Suspensión de la Bonificación:"}
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            {"Si la cantidad de PAS Referidos activos y al día desciende a cuatro (4) o menos (por baja, morosidad o rescisión), la Bonificación se suspenderá automáticamente. El PAS Referente volverá a abonar su fee mensual estándar a partir del mes siguiente al quiebre de la condición, hasta que logre ingresar un nuevo referido que complete su Período de Validación."}
          </p>
        </article>

        {/* Article 6 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 6: Acumulación y Referidos Excedentes (\u00ABBuffer\u00BB)"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"6.1 Tope de Bonificación:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"La bonificación máxima aplicable es del 100% del fee mensual del PAS Referente. Los saldos no son monetizables, reembolsables en efectivo, ni transferibles a terceros."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"6.2 Sistema de Reserva (Buffer):"}
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            {"Los PAS Referidos que excedan el mínimo de cinco (5) funcionarán como reserva. Si un PAS Referente cuenta con ocho (8) referidos activos y tres (3) se dan de baja, mantendrá su Bonificación del 100% de manera ininterrumpida al conservar el mínimo exigido de cinco (5) referidos activos."}
          </p>
        </article>

        {/* Article 7 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 7: Restricciones y Prohibiciones"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"7.1 Fraude y Autorreferencia:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"Queda estrictamente prohibida la creación de perfiles ficticios, la autorreferencia o el pago de fees por parte del PAS Referente en nombre del PAS Referido para simular actividad. La detección de estas prácticas implicará la expulsión inmediata de la red Lumina y el reclamo de los montos bonificados indebidamente."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"7.2 Intransferibilidad:"}
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            {"El derecho a la Bonificación es personal, intransferible y está atado a la vigencia de la matrícula SSN del titular."}
          </p>
        </article>

        {/* Article 8 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 8: Privacidad y Protección de Datos"}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {"Lumina tratará los datos de los PAS Referentes y Referidos en estricto cumplimiento de la Ley 25.326 de Protección de Datos Personales. El estado de facturación y morosidad de los referidos podrá ser informado al PAS Referente únicamente a los fines de justificar el mantenimiento o suspensión de su Bonificación."}
          </p>
        </article>

        {/* Article 9 */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Artículo 9: Modificación, Jurisdicción y Vigencia"}
          </h2>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"9.1 Modificaciones y Cancelación:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"Lumina se reserva el derecho de modificar o dar por finalizado el Programa mediante preaviso de 30 días corridos. Los PAS Referentes que ya gocen de la Bonificación al momento de la cancelación mantendrán su beneficio mientras cumplan las condiciones de permanencia estipuladas en el Artículo 5.2."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"9.2 Jurisdicción:"}
          </h3>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            {"Toda controversia derivada de este Programa se someterá a la jurisdicción de los Tribunales Ordinarios competentes correspondientes a la sede principal de Lumina."}
          </p>

          <h3 className="mb-3 text-base font-semibold text-foreground">
            {"9.3 Vigencia:"}
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            {"Condiciones vigentes a partir del 31 de octubre de 2026."}
          </p>
        </article>

        <hr className="my-10 border-border" />

        {/* Back to home */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
          <Link
            href="/registro"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Registrarme
          </Link>
        </div>
      </div>
    </main>
  );
}
