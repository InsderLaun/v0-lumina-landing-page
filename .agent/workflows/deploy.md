---
description: Deploy Lumina landing page to production (Google Cloud Run)
---

# Deploy a Producción — Google Cloud Run

## Datos de Producción

- **Dominio:** lumina-org.com / www.lumina-org.com
- **Plataforma:** Google Cloud Run
- **Project ID:** fluent-crossbar-354505
- **Región:** us-central1
- **Servicio:** lumina-app
- **URL directa Cloud Run:** https://lumina-app-965484649316.us-central1.run.app
- **Registrador DNS:** Squarespace
- **Dockerfile:** Multi-stage (node:20-alpine), output standalone, puerto 8080

## Pasos para Deploy

// turbo-all

1. Verificar que compile sin errores:
```bash
npm run build
```

2. Deploy a Cloud Run (construye imagen Docker en la nube y despliega):
```bash
gcloud run deploy lumina-app --source . --region=us-central1 --port=8080 --allow-unauthenticated --min-instances=0 --max-instances=1 --project=fluent-crossbar-354505
```

3. Verificar que el sitio esté online:
```bash
nslookup lumina-org.com
```
Debe resolver a IPs de Google: `216.239.32.21`, `216.239.34.21`, `216.239.36.21`, `216.239.38.21`

## Notas Importantes

- **NO usar Vercel.** El dominio fue migrado de Vercel a Google Cloud Run el 2026-02-19.
- El repo GitHub (`agustintiberio10/v0-lumina-landing-page`) YA NO auto-despliega en Vercel. Solo usar `gcloud run deploy`.
- El `git push` sigue siendo útil para versionar código, pero no dispara deploy automático.
- El Dockerfile usa `pnpm` y `output: "standalone"` en `next.config.mjs`.
- Min instances = 0 (free tier, se apaga cuando nadie visita).

## DNS (configurados en Squarespace)

| Alojamiento | Tipo  | Datos                      |
|-------------|-------|----------------------------|
| @           | A     | 216.239.32.21              |
| @           | A     | 216.239.34.21              |
| @           | A     | 216.239.36.21              |
| @           | A     | 216.239.38.21              |
| www         | CNAME | ghs.googlehosted.com.      |
| @           | TXT   | google-site-verification=… |
| @           | TXT   | v=spf1 include:_spf.google.com ~all |
| @           | MX    | smtp.google.com            |
