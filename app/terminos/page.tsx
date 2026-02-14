import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso | Lumina",
  description:
    "Términos y Condiciones de Uso de la Red Lumina para Productores Asesores de Seguros.",
};

export default function TerminosPage() {
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
          {"Términos y Condiciones de Uso"}
        </h1>
        <p className="mt-2 text-lg font-semibold text-primary/80">
          {"Red Lumina"}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {"Fecha de última actualización: 14/02/2026"}
        </p>

        <hr className="my-10 border-border" />

        {/* Intro */}
        <div className="mb-10">
          <p className="leading-relaxed text-muted-foreground">
            {"El presente documento (en adelante, los \"Términos y Condiciones\") establece las reglas, obligaciones y derechos que rigen la relación entre LUMINA (en adelante, la \"Organización\" o \"Lumina\") y el Productor Asesor de Seguros registrado en la plataforma (en adelante, el \"PAS\" o el \"Usuario\")."}
          </p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {"La aceptación de estos Términos y Condiciones es un requisito indispensable para operar dentro de la red Lumina y acceder a sus beneficios."}
          </p>
        </div>

        {/* Clausula Primera */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Primera: Naturaleza del Servicio y Objeto"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"Lumina es una organización que brinda servicios integrales, infraestructura tecnológica y respaldo estratégico exclusivamente a Productores Asesores de Seguros (PAS) independientes."}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {"Queda expresamente establecido que Lumina no es una compañía de seguros, no comercializa pólizas al público general ni actúa como agente instigador frente a los asegurables. Lumina funciona estrictamente como una red de apoyo y ecosistema colaborativo, garantizando la no competencia directa o indirecta con la cartera de clientes del PAS."}
          </p>
        </article>

        {/* Clausula Segunda */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Segunda: Independencia y Responsabilidad Profesional"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"El PAS reconoce y acepta que ejerce su actividad de manera autónoma e independiente, asumiendo la totalidad de las responsabilidades profesionales, civiles y penales derivadas de su gestión, conforme a las exigencias de la Ley N° 22.400 y las normativas dictadas por la Superintendencia de Seguros de la Nación (SSN)."}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {"Lumina provee soporte operativo y estratégico, pero en ningún caso sustituye, asume, ni resulta solidariamente responsable por las obligaciones legales, administrativas o de asesoramiento que recaen de manera exclusiva e indelegable sobre el productor."}
          </p>
        </article>

        {/* Clausula Tercera */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Tercera: Esquema de Comisiones y Retribución"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"El ecosistema Lumina está diseñado para maximizar la rentabilidad del profesional. En tal sentido, se establecen las siguientes condiciones comerciales:"}
          </p>
          <ul className="list-inside list-disc space-y-3 text-muted-foreground">
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Rubro Automotor:"}
              </span>{" "}
              {"El PAS percibirá el 100% de las comisiones generadas por la intermediación de pólizas de vehículos."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Demás Ramos:"}
              </span>{" "}
              {"El PAS percibirá las máximas comisiones vigentes y acordadas en el mercado según el convenio específico con cada aseguradora."}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold text-foreground">
                {"Liquidación Directa:"}
              </span>{" "}
              {"La relación de cobro y liquidación de las comisiones se efectuará de manera directa entre el PAS y la compañía aseguradora correspondiente, garantizando la transparencia y el flujo inmediato de los ingresos del productor."}
            </li>
          </ul>
        </article>

        {/* Clausula Cuarta */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Cuarta: Alianza Estratégica con Lumina Business Hub"}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {"Lumina ofrece a sus miembros una plataforma prestacional de excelencia física y presencial. Se deja expresa constancia de que los servicios de infraestructura de alta gama, acceso a espacios de coworking y la organización de charlas presenciales de capacitación, son provistos a través de una alianza estratégica vinculante con la empresa independiente Lumina Business Hub. El uso de las instalaciones y la participación en dichos eventos quedarán sujetos a los reglamentos internos de disponibilidad y convivencia dictados por dicha entidad."}
          </p>
        </article>

        {/* Clausula Quinta */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Quinta: Plan de Referidos 5x2 (Bonificación de Membresía)"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"Lumina fomenta el crecimiento colaborativo de su red mediante el \"Plan de Referidos 5x2\". Este programa permite al PAS bonificar el 100% del costo de su membresía operativa mensual."}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {"Para acceder a dicha bonificación, el PAS titular deberá incorporar y mantener activos en la red a cinco (5) nuevos productores referidos de forma directa. Mientras los referidos mantengan su estatus de miembros activos y cumplan con los volúmenes operativos mínimos, el PAS referente gozará de la exención total del canon de membresía. La Organización se reserva el derecho de auditar y modificar las métricas de este programa previa notificación por canales oficiales."}
          </p>
        </article>

        {/* Clausula Sexta */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Sexta: Propiedad Intelectual"}
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            {"Todo el contenido, diseño, logotipos, isotipos, marcas, bases de datos, software y material publicitario disponible en la plataforma es propiedad exclusiva de Lumina y/o de Lumina Business Hub, encontrándose protegidos por la Ley de Marcas (N° 22.362) y la Ley de Propiedad Intelectual (N° 11.723)."}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {"Queda terminantemente prohibido al PAS el uso de la marca \"Lumina\", su logo o cualquier activo intelectual para la promoción personal frente a clientes, salvo autorización previa, expresa y por escrito otorgada por las autoridades de la Organización."}
          </p>
        </article>

        {/* Clausula Septima */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Séptima: Modificaciones"}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {"Lumina se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Toda modificación será notificada al PAS a través de la plataforma o vía correo electrónico. El uso continuado de los servicios tras la notificación implicará la aceptación de los nuevos términos."}
          </p>
        </article>

        {/* Clausula Octava */}
        <article className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            {"Cláusula Octava: Jurisdicción y Ley Aplicable"}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {"Para cualquier controversia, divergencia o reclamo derivado de la interpretación, validez, ejecución o cumplimiento de los presentes Términos y Condiciones, las partes se someten a la jurisdicción y competencia exclusiva de los Tribunales Ordinarios en lo Comercial con asiento en la Ciudad Autónoma de Buenos Aires (CABA), o de manera alternativa, a los tribunales del Departamento Judicial de San Isidro, Provincia de Buenos Aires, a elección de la parte actora, renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponderles."}
          </p>
        </article>

        <hr className="my-10 border-border" />

        {/* Back to home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
