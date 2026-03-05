import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/google";

export const dynamic = "force-dynamic";

/**
 * Dropbox Sign Webhook Endpoint
 * Receives events: signature_request_sent, signature_request_viewed,
 * signature_request_signed, signature_request_all_signed
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Dropbox Sign sends a test event to verify the webhook
        if (body.event?.event_type === "callback_test") {
            return new NextResponse("Hello API Event Received", { status: 200 });
        }

        const eventType = body.event?.event_type;
        const signatureRequest = body.signature_request;

        if (!signatureRequest?.signature_request_id) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const signatureRequestId = signatureRequest.signature_request_id;

        const statusMap: Record<string, string> = {
            signature_request_sent: "enviado",
            signature_request_viewed: "visto",
            signature_request_signed: "firmado",
            signature_request_all_signed: "completo",
            signature_request_declined: "rechazado",
            signature_request_invalid: "inválido",
        };

        const newStatus = statusMap[eventType] || eventType;

        const db = getDb();

        /* ─── 1. Update registration status ─── */
        const registrosQuery = await db
            .collection("registros")
            .where("signatureRequestId", "==", signatureRequestId)
            .limit(1)
            .get();

        if (!registrosQuery.empty) {
            const registroDoc = registrosQuery.docs[0];
            await registroDoc.ref.update({
                signatureStatus: newStatus,
                lastUpdated: new Date().toISOString(),
            });
        }

        /* ─── 2. Audit trail ─── */
        const signerInfo = signatureRequest.signatures?.[0] || {};

        await db.collection("audit_trail").add({
            signatureRequestId,
            event: eventType,
            status: newStatus,
            signerEmail: signerInfo.signer_email_address || null,
            signerName: signerInfo.signer_name || null,
            signedAt: signerInfo.signed_at
                ? new Date(signerInfo.signed_at * 1000).toISOString()
                : null,
            lastViewedAt: signerInfo.last_viewed_at
                ? new Date(signerInfo.last_viewed_at * 1000).toISOString()
                : null,
            statusCode: signerInfo.status_code || null,
            timestamp: new Date().toISOString(),
            ip:
                req.headers.get("x-forwarded-for") ||
                req.headers.get("x-real-ip") ||
                "unknown",
        });

        console.log(
            `[Webhook] ${eventType} for ${signatureRequestId} — Status: ${newStatus}`
        );

        return new NextResponse("Hello API Event Received", { status: 200 });
    } catch (error) {
        console.error("Error en webhook Dropbox Sign:", error);
        return NextResponse.json(
            { error: "Error processing webhook" },
            { status: 500 }
        );
    }
}

export async function GET() {
    return new NextResponse("Dropbox Sign Webhook Active", { status: 200 });
}
