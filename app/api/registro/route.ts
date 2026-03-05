import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/google";

export const dynamic = "force-dynamic";

const CALENDAR_URL = process.env.CALENDAR_URL || "https://calendly.com/lumina/reunion";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            nombre,
            email,
            telefono,
            matricula_ssn,
            plan,
            experiencia,
            facturacion,
            organizacion,
            referido_por,
            nombre_referente,
            matricula_referente,
            addons,
            whatsapp,
            continuacion, // "firmar" | "agendar"
        } = body;

        const db = getDb();

        /* ─────────────────────────────────────────────
         *  Save registration in Firestore
         * ───────────────────────────────────────────── */
        const registroRef = db.collection("registros").doc();
        await registroRef.set({
            nombre,
            email,
            telefono: telefono || whatsapp || null,
            matricula_ssn,
            plan,
            experiencia: experiencia || null,
            facturacion: facturacion || null,
            organizacion: organizacion || null,
            referido_por: referido_por || null,
            nombre_referente: nombre_referente || null,
            matricula_referente: matricula_referente || null,
            addons: addons || null,
            continuacion: continuacion || "firmar",
            signatureStatus: continuacion === "agendar"
                ? "pendiente_videollamada"
                : "pendiente_firma_manual",
            createdAt: new Date().toISOString(),
        });

        // Audit trail
        await db.collection("audit_trail").add({
            registroId: registroRef.id,
            event: continuacion === "agendar"
                ? "lead_agendar_videollamada"
                : "lead_quiere_firmar",
            email,
            nombre,
            timestamp: new Date().toISOString(),
            ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown",
        });

        /* ─────────────────────────────────────────────
         *  Forward to Formspree for email notification
         * ───────────────────────────────────────────── */
        const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
        if (formspreeEndpoint) {
            const emoji = continuacion === "agendar" ? "📞" : "✍️";
            const tipo = continuacion === "agendar" ? "videollamada" : "firma";
            await fetch(formspreeEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    _subject: `${emoji} Nuevo registro Lumina (${tipo}): ${nombre} — ${plan}`,
                    nombre,
                    email,
                    telefono: telefono || whatsapp || "No proporcionado",
                    matricula_ssn,
                    plan,
                    continuacion: continuacion === "agendar"
                        ? "Prefiere videollamada"
                        : "Quiere firmar contratos",
                    addons: addons || "Ninguno",
                    referido_por: referido_por || "Ninguno",
                }),
            }).catch(() => { });
        }

        /* ─────────────────────────────────────────────
         *  Response
         * ───────────────────────────────────────────── */
        if (continuacion === "agendar") {
            return NextResponse.json({
                success: true,
                message: "Registro exitoso. Te redirigimos para agendar tu videollamada.",
                calendarUrl: CALENDAR_URL,
                registroId: registroRef.id,
            });
        }

        // Option A: "firmar"
        // NOTE: Dropbox Sign requires a paid API plan for production use.
        // When you upgrade, uncomment the signature flow in this section.
        // For now, we save the lead and notify you to send contracts manually.
        return NextResponse.json({
            success: true,
            message: "Registro exitoso. Nos pondremos en contacto para enviarte los contratos.",
            registroId: registroRef.id,
        });

    } catch (error: unknown) {
        console.error("Error en /api/registro:", error);
        const errorMessage = error instanceof Error ? error.message : "Error interno";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
