import { google, type docs_v1, type drive_v3 } from "googleapis";
import * as admin from "firebase-admin";

/* ─── Lazy-initialized clients ─── */
let _drive: drive_v3.Drive | null = null;
let _docs: docs_v1.Docs | null = null;
let _db: admin.firestore.Firestore | null = null;

function getServiceAccountCredentials() {
    const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!base64Key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not set");
    return JSON.parse(Buffer.from(base64Key, "base64").toString("utf-8"));
}

function getAuth() {
    const credentials = getServiceAccountCredentials();
    return new google.auth.GoogleAuth({
        credentials,
        scopes: [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/documents",
        ],
    });
}

export function getDrive(): drive_v3.Drive {
    if (!_drive) {
        _drive = google.drive({ version: "v3", auth: getAuth() });
    }
    return _drive;
}

export function getDocs(): docs_v1.Docs {
    if (!_docs) {
        _docs = google.docs({ version: "v1", auth: getAuth() });
    }
    return _docs;
}

export function getDb(): admin.firestore.Firestore {
    if (!_db) {
        const credentials = getServiceAccountCredentials();
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(credentials),
                projectId: process.env.FIRESTORE_PROJECT_ID,
            });
        }
        _db = admin.firestore();
    }
    return _db;
}
