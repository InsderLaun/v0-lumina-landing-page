import * as DropboxSign from "@dropbox/sign";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

/* ─── Lazy-initialized API client ─── */
let _signApi: DropboxSign.SignatureRequestApi | null = null;

function getSignApi(): DropboxSign.SignatureRequestApi {
    if (!_signApi) {
        _signApi = new DropboxSign.SignatureRequestApi();
        _signApi.username = process.env.DROPBOX_SIGN_API_KEY!;
    }
    return _signApi;
}

export interface SignatureFile {
    buffer: Buffer;
    fileName: string;
}

/**
 * Convert a Buffer to a temp file path that Dropbox Sign can read.
 */
function bufferToTempFile(buffer: Buffer, fileName: string): string {
    const tempDir = os.tmpdir();
    const tempPath = path.join(tempDir, `lumina_${Date.now()}_${fileName}`);
    fs.writeFileSync(tempPath, buffer);
    return tempPath;
}

/**
 * Send documents for signature via Dropbox Sign.
 * - signingDocs: documents that require a signature (Convenio, NDA)
 * - readOnlyDocs: documents sent for reading only (Manual de Compliance)
 */
export async function sendForSignature(params: {
    signerEmail: string;
    signerName: string;
    subject: string;
    message: string;
    signingDocs: SignatureFile[];
    readOnlyDocs?: SignatureFile[];
}): Promise<{ signatureRequestId: string }> {
    const { signerEmail, signerName, subject, message, signingDocs, readOnlyDocs } = params;
    const signApi = getSignApi();

    const signers: DropboxSign.SubSignatureRequestSigner[] = [
        {
            emailAddress: signerEmail,
            name: signerName,
            order: 0,
        },
    ];

    // Write buffers to temp files so the SDK can read them as streams
    const tempFiles: string[] = [];
    const fileStreams: fs.ReadStream[] = [];

    try {
        for (const doc of signingDocs) {
            const tempPath = bufferToTempFile(doc.buffer, doc.fileName);
            tempFiles.push(tempPath);
            fileStreams.push(fs.createReadStream(tempPath));
        }

        if (readOnlyDocs) {
            for (const doc of readOnlyDocs) {
                const tempPath = bufferToTempFile(doc.buffer, doc.fileName);
                tempFiles.push(tempPath);
                fileStreams.push(fs.createReadStream(tempPath));
            }
        }

        const data: DropboxSign.SignatureRequestSendRequest = {
            title: subject,
            subject,
            message,
            signers,
            files: fileStreams,
            testMode: false,
        };

        let result;
        try {
            result = await signApi.signatureRequestSend(data);
        } catch (err: unknown) {
            // Log the full Dropbox Sign error details
            const dsError = err as { body?: unknown; statusCode?: number; response?: { text?: string } };
            console.error("Dropbox Sign API error details:", JSON.stringify({
                statusCode: dsError.statusCode,
                body: dsError.body,
                responseText: dsError.response?.text,
            }, null, 2));
            throw err;
        }
        const signatureRequestId =
            result.body.signatureRequest?.signatureRequestId || "";

        return { signatureRequestId };
    } finally {
        // Cleanup temp files
        for (const tempPath of tempFiles) {
            try { fs.unlinkSync(tempPath); } catch { }
        }
    }
}
