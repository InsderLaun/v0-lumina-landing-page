import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GITHUB_REPO = "agustintiberio10/LUMINA";

const VISITOR_PATHS = [
    "docs/adquisicion-pas/propuesta-valor.md",
    "docs/adquisicion-pas/objection-handling.md",
    "docs/glosario-seguros.md",
];

/* ─── Fetch a raw .md file from GitHub ─── */
async function fetchRawFile(path: string): Promise<string> {
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${path}`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.warn(`[chat] Could not fetch ${url}: ${res.status}`);
            return "";
        }
        return await res.text();
    } catch (err) {
        console.warn(`[chat] fetch error for ${url}:`, err);
        return "";
    }
}

/* ─── Build RAG context ─── */
async function buildContext(): Promise<string> {
    const parts = await Promise.all(
        VISITOR_PATHS.map(async (p) => {
            const text = await fetchRawFile(p);
            return text ? `### ${p}\n${text}` : "";
        })
    );
    const context = parts.filter(Boolean).join("\n\n---\n\n");
    console.log(`[chat] Context loaded: ${context.length} chars from ${VISITOR_PATHS.length} files`);
    return context;
}

/* ─── Visitor system prompt ─── */
function systemPrompt(context: string): string {
    return `Sos "Lumi", asistente virtual de Lumina — organización de seguros de élite para Productores Asesores de Seguros (PAS) en Argentina.

Rol: RECRUITER COMERCIAL. Captás PAS, explicás el ecosistema Lumina y los motivás a registrarse.

Personalidad: Profesional, cálida, propositiva. Lenguaje rioplatense argentino (vos, te). Directa, sin rodeos.

Base de conocimiento (usá esto como fuente de verdad):
---
${context || "Lumina es una organización de seguros que ofrece 100% comisiones en automotores, alta gratis y membresía full con beneficios premium para PAS argentinos."}
---

REGLAS ESTRICTAS DE FORMATO:
1. LONGITUD: Máximo 3 oraciones cortas. No más. Nunca uses listas con viñetas (- o •).
2. PRECISIÓN: Respondé SOLO la pregunta que te hicieron, sin agregar información extra no pedida.
3. SIEMPRE terminá con UNA sola pregunta o llamada a la acción breve.
4. No inventés datos fuera de la base de conocimiento.
5. Si no sabés: "Para eso completá el formulario y te contactamos."
6. Solo temas de Lumina y seguros. Español rioplatense argentino.`;
}

/* ─── POST /api/chat ─── */
export async function POST(req: NextRequest) {
    try {
        if (!GEMINI_API_KEY) {
            console.error("[chat] GEMINI_API_KEY is not set");
            return NextResponse.json({ error: "Configuración incompleta" }, { status: 500 });
        }

        const body = await req.json();
        const message: string = body.message ?? "";
        const history: Array<{ role: string; text: string }> = body.history ?? [];

        if (!message.trim()) {
            return NextResponse.json({ error: "Mensaje vacío" }, { status: 400 });
        }

        // 1. Load GitHub docs context
        const context = await buildContext();

        // 2. Build conversation contents (history + new message)
        const contents = [
            ...history.map((h: { role: string; text: string }) => ({
                role: h.role === "assistant" ? "model" : "user",
                parts: [{ text: h.text }],
            })),
            { role: "user", parts: [{ text: message }] },
        ];

        // 3. Call Gemini 2.5 Flash (confirmed available for this API key)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        console.log(`[chat] Calling gemini-2.5-flash with ${contents.length} turns`);

        const geminiRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt(context) }] },
                contents,
                generationConfig: { temperature: 0.5, maxOutputTokens: 1024 },
            }),
        });

        const geminiBody = await geminiRes.text();

        if (!geminiRes.ok) {
            console.error(`[chat] Gemini error ${geminiRes.status}:`, geminiBody);
            return NextResponse.json({ error: "Error del modelo IA" }, { status: 500 });
        }

        const geminiData = JSON.parse(geminiBody);
        const reply =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
            "Disculpá, no pude generar una respuesta. ¿Intentamos de nuevo?";

        return NextResponse.json({ reply });
    } catch (err) {
        console.error("[chat] Unhandled error:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
