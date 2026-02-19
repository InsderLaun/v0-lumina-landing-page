"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsReferidosModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TermsReferidosModal({
    open,
    onOpenChange,
}: TermsReferidosModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] border-border/50 bg-background text-foreground sm:max-w-2xl p-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-bold text-primary">
                        Términos y Condiciones: Programa de Referidos
                    </DialogTitle>
                    <DialogDescription className="text-primary/80 font-medium">
                        {'"Membresía Full 100% Bonificada"'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[65vh] px-6 pb-6">
                    <div className="space-y-8 pr-4 text-sm">
                        <p className="text-muted-foreground">
                            Lumina – Red de Productores Asesores de Seguros
                        </p>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 1: Objeto del Programa
                            </h3>
                            <p className="leading-relaxed text-muted-foreground">
                                El presente documento regula los Términos y Condiciones del
                                Programa de Referidos de Lumina (en adelante, «el Programa»),
                                cuyo objeto es incentivar el crecimiento de la red de
                                Productores Asesores de Seguros (PAS) mediante la bonificación
                                total del fee mensual de la Membresía Full para aquellos
                                miembros que refieran exitosamente a nuevos colegas.
                            </p>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 2: Definiciones
                            </h3>
                            <p className="mb-3 leading-relaxed text-muted-foreground">
                                A los efectos del presente documento, se establecen las
                                siguientes definiciones:
                            </p>
                            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                                <li>
                                    <span className="font-semibold text-foreground">
                                        PAS Referente:
                                    </span>{" "}
                                    Productor Asesor de Seguros activo en Lumina, suscrito a la
                                    Membresía Full, que refiere a nuevos productores.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        PAS Referido:
                                    </span>{" "}
                                    Nuevo Productor Asesor de Seguros que ingresa a Lumina
                                    mediante la recomendación de un PAS Referente y contrata la
                                    Membresía Full.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        Código de Referido:
                                    </span>{" "}
                                    Número de Matrícula de la Superintendencia de Seguros de la
                                    Nación (SSN) del PAS Referente, utilizado para el tracking
                                    digital.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        Objetivo 5x2:
                                    </span>{" "}
                                    Acumulación de cinco (5) PAS Referidos que permanezcan
                                    activos y abonen su fee mensual de la Membresía Full durante
                                    dos (2) meses consecutivos.
                                </li>
                                <li>
                                    <span className="font-semibold text-foreground">
                                        Bonificación:
                                    </span>{" "}
                                    Exención del 100% del fee mensual de la Membresía Full del
                                    PAS Referente.
                                </li>
                            </ul>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 3: Requisitos de Elegibilidad
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                3.1 Del PAS Referente:
                            </h4>
                            <p className="mb-2 text-muted-foreground">
                                Podrá participar del Programa todo PAS que cumpla los
                                siguientes requisitos al momento de la referencia:
                            </p>
                            <ol className="mb-4 list-[lower-alpha] space-y-1 pl-5 text-muted-foreground">
                                <li>
                                    Tener un Contrato de Adhesión vigente con Lumina bajo la
                                    modalidad Membresía Full.
                                </li>
                                <li>Estar al día con el pago de su fee mensual.</li>
                                <li>
                                    No registrar sanciones disciplinarias ni incumplimientos
                                    éticos en el ejercicio de la profesión.
                                </li>
                            </ol>

                            <h4 className="mb-1 font-semibold text-foreground">
                                3.2 Del PAS Referido:
                            </h4>
                            <p className="mb-2 text-muted-foreground">
                                Será considerado PAS Referido válido quien cumpla taxativamente
                                con lo siguiente:
                            </p>
                            <ol className="list-[lower-alpha] space-y-1 pl-5 text-muted-foreground">
                                <li>No haber operado previamente bajo el ecosistema de Lumina.</li>
                                <li>
                                    Completar el proceso de onboarding digital ingresando el
                                    Código de Referido (Matrícula SSN) del PAS Referente en el
                                    formulario de alta.
                                </li>
                                <li>
                                    Suscribirse a la Membresía Full y abonar el fee
                                    correspondiente.
                                </li>
                            </ol>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 4: Mecánica y Tracking del Programa
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                4.1 Registro de Referidos:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                La asignación del referido se realiza de forma exclusiva y
                                automatizada mediante el ingreso del número de matrícula del
                                PAS Referente en la plataforma web al momento del alta. No se
                                aceptarán reclamos de referidos que no hayan ingresado dicho
                                código en su formulario inicial.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                4.2 Período de Validación (Maduración de 2 Meses):
                            </h4>
                            <p className="mb-2 text-muted-foreground">
                                Para que un PAS Referido sea validado dentro del «Objetivo
                                5x2», deberá:
                            </p>
                            <ol className="list-[lower-alpha] space-y-1 pl-5 text-muted-foreground">
                                <li>
                                    Abonar su fee mensual de forma completa y antes del
                                    vencimiento durante sus primeros dos (2) meses calendario
                                    consecutivos.
                                </li>
                                <li>
                                    Mantener su producción y contrato activos sin suspensiones.
                                </li>
                            </ol>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 5: Aplicación de la Bonificación
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                5.1 Activación y Forma de Aplicación:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                Al consolidar el Objetivo 5x2, la Bonificación se activará el
                                mes calendario inmediato siguiente. Lumina aplicará un
                                descuento del 100% directamente en la facturación del fee
                                mensual del PAS Referente.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                5.2 Permanencia de la Bonificación:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                El fee a costo $0 se mantendrá de forma indefinida mes a mes,
                                estrictamente condicionado a que, en cada período de
                                facturación, exista un mínimo de cinco (5) PAS Referidos de su
                                red directa con contrato activo y cuota al día.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                5.3 Suspensión de la Bonificación:
                            </h4>
                            <p className="leading-relaxed text-muted-foreground">
                                Si la cantidad de PAS Referidos activos y al día desciende a
                                cuatro (4) o menos, la Bonificación se suspenderá
                                automáticamente. El PAS Referente volverá a abonar su fee
                                mensual estándar a partir del mes siguiente al quiebre de la
                                condición, hasta que logre ingresar un nuevo referido que
                                complete su Período de Validación.
                            </p>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 6: Acumulación y Referidos Excedentes («Buffer»)
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                6.1 Tope de Bonificación:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                La bonificación máxima aplicable es del 100% del fee mensual
                                del PAS Referente. Los saldos no son monetizables,
                                reembolsables en efectivo, ni transferibles a terceros.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                6.2 Sistema de Reserva (Buffer):
                            </h4>
                            <p className="leading-relaxed text-muted-foreground">
                                Los PAS Referidos que excedan el mínimo de cinco (5)
                                funcionarán como reserva. Si un PAS Referente cuenta con ocho
                                (8) referidos activos y tres (3) se dan de baja, mantendrá su
                                Bonificación del 100% de manera ininterrumpida al conservar el
                                mínimo exigido de cinco (5) referidos activos.
                            </p>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 7: Restricciones y Prohibiciones
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                7.1 Fraude y Autorreferencia:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                Queda estrictamente prohibida la creación de perfiles ficticios,
                                la autorreferencia o el pago de fees por parte del PAS
                                Referente en nombre del PAS Referido para simular actividad. La
                                detección de estas prácticas implicará la expulsión inmediata
                                de la red Lumina y el reclamo de los montos bonificados
                                indebidamente.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                7.2 Intransferibilidad:
                            </h4>
                            <p className="leading-relaxed text-muted-foreground">
                                El derecho a la Bonificación es personal, intransferible y está
                                atado a la vigencia de la matrícula SSN del titular.
                            </p>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 8: Privacidad y Protección de Datos
                            </h3>
                            <p className="leading-relaxed text-muted-foreground">
                                Lumina tratará los datos de los PAS Referentes y Referidos en
                                estricto cumplimiento de la Ley 25.326 de Protección de Datos
                                Personales. El estado de facturación y morosidad de los
                                referidos podrá ser informado al PAS Referente únicamente a los
                                fines de justificar el mantenimiento o suspensión de su
                                Bonificación.
                            </p>
                        </article>

                        <article>
                            <h3 className="mb-2 font-bold text-foreground">
                                Artículo 9: Modificación, Jurisdicción y Vigencia
                            </h3>
                            <h4 className="mb-1 font-semibold text-foreground">
                                9.1 Modificaciones y Cancelación:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                Lumina se reserva el derecho de modificar o dar por finalizado
                                el Programa mediante preaviso de 30 días corridos. Los PAS
                                Referentes que ya gocen de la Bonificación al momento de la
                                cancelación mantendrán su beneficio mientras cumplan las
                                condiciones de permanencia estipuladas en el Artículo 5.2.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                9.2 Jurisdicción:
                            </h4>
                            <p className="mb-4 leading-relaxed text-muted-foreground">
                                Toda controversia derivada de este Programa se someterá a la
                                jurisdicción de los Tribunales Ordinarios competentes
                                correspondientes a la sede principal de Lumina.
                            </p>
                            <h4 className="mb-1 font-semibold text-foreground">
                                9.3 Vigencia:
                            </h4>
                            <p className="leading-relaxed text-muted-foreground">
                                Condiciones vigentes a partir del 14 de febrero de 2026.
                            </p>
                        </article>
                    </div>
                </ScrollArea>

                <div className="flex justify-end border-t border-border px-6 py-4">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            Cerrar
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
