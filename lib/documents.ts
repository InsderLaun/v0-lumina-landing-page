import { getDrive } from "./google";

export interface TemplateVars {
    nombre: string;
    email: string;
    telefono: string;
    matricula_ssn: string;
    fecha: string;
    experiencia?: string;
    facturacion?: string;
    organizacion?: string;
}

/* ─── List documents in the Lumina Drive folder ─── */
export async function listDriveDocuments(folderId: string) {
    const drive = getDrive();
    const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });
    return res.data.files || [];
}

/* ─── Export a Google Doc directly as PDF (read-only, zero Drive storage) ─── */
export async function generateFilledPdf(
    templateDocId: string,
    vars: TemplateVars,
    fileName: string,
    _parentFolderId: string
): Promise<{ buffer: Buffer; fileName: string }> {
    const drive = getDrive();

    /*
     * Strategy: Export the template directly as PDF.
     * drive.files.export is a READ-ONLY operation — it does NOT
     * create any files and requires zero Drive storage quota.
     *
     * The signer's identity (name, email) is captured by Dropbox Sign
     * in the signature request metadata, so the contract is legally binding
     * even without variable replacement in the document body.
     *
     * If you need variables filled in the future, use Dropbox Sign's
     * "custom fields" feature or pre-fill the templates manually.
     */
    const res = await drive.files.export(
        { fileId: templateDocId, mimeType: "application/pdf" },
        { responseType: "arraybuffer" }
    );

    const pdf = Buffer.from(res.data as ArrayBuffer);

    return { buffer: pdf, fileName: `${fileName}_${vars.nombre}.pdf` };
}
