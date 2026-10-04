---
description: Deploy InsiderLaun landing page to production (Google Cloud Run)
---

# Despliegue a producción — Google Cloud Run

## Dominio y servicio

- **Dominio objetivo:** www.insiderlaun.com
- **Dominio de producción actual:** lumina-org.com / www.lumina-org.com
- **Plataforma:** Google Cloud Run
- **Project ID:** fluent-crossbar-354505
- **Región:** us-central1
- **Servicio:** lumina-app
- **URL directa Cloud Run:** https://lumina-app-965484649316.us-central1.run.app
- **Registrador DNS informado:** Squarespace
- **Dockerfile:** multi-stage (node:20-alpine), output standalone, puerto 8080

El código usa `https://www.insiderlaun.com` como URL canónica. El dominio público solo cambiará cuando se configure y verifique el mapeo personalizado de Cloud Run y sus registros DNS. Hasta completar ese paso, el dominio actual sigue siendo el de producción. Mantener los registros de correo que ya existan al editar DNS.

## Pasos para desplegar

1. Verificar que compile sin errores:
```bash
npm run build
```

2. Desplegar la revisión aprobada en Cloud Run:
```bash
gcloud run deploy lumina-app --source . --region=us-central1 --port=8080 --allow-unauthenticated --min-instances=0 --max-instances=1 --project=fluent-crossbar-354505
```

3. Configurar el dominio personalizado `www.insiderlaun.com` en Cloud Run y aplicar los registros DNS que Google Cloud indique en Squarespace. No copiar los registros A del dominio anterior sin validarlos para el nuevo dominio.

4. Verificar resolución y sitio:
```bash
nslookup www.insiderlaun.com
```

## Notas

- **No usar Vercel.** La publicación se hace manualmente en Google Cloud Run.
- Un cambio en GitHub no dispara el despliegue.
- El Dockerfile usa pnpm y `output: "standalone"` en `next.config.mjs`.
- Mantener min instances = 0 y max instances = 1 salvo cambio explícito.
- El DNS del dominio anterior se documenta abajo como referencia de estado actual; no se debe reutilizar automáticamente.

## DNS actual de lumina-org.com (Squarespace)

Estos registros pertenecen al dominio anterior y no configuran `insiderlaun.com`.

| Host | Tipo | Valor actual |
|---|---|---|
| @ | A | 216.239.32.21 |
| @ | A | 216.239.34.21 |
| @ | A | 216.239.36.21 |
| @ | A | 216.239.38.21 |
| www | CNAME | ghs.googlehosted.com. |
| @ | TXT | verificación de Google Cloud y correo existentes |
| @ | MX | smtp.google.com |
