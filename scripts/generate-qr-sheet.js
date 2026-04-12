#!/usr/bin/env node
/**
 * Lee scripts/e2e-seed-latest.json y escribe public/tools/test-registration-qrs.html
 * con los mismos QR que el email (URL de check-in).
 *
 *   node scripts/generate-qr-sheet.js
 */

const fs = require('fs')
const path = require('path')

let QRCode
try {
  QRCode = require('qrcode')
} catch {
  console.error('Instala dependencias en la raíz: npm install')
  process.exit(1)
}

const SEED = path.join(__dirname, 'e2e-seed-latest.json')
const OUT = path.join(__dirname, '..', 'public', 'tools', 'test-registration-qrs.html')

async function main() {
  if (!fs.existsSync(SEED)) {
    console.error('Falta', SEED, '— ejecuta: node scripts/seed-test-registrations.js')
    process.exit(1)
  }

  const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'))
  const rows = []

  for (const r of seed.registrations) {
    const dataUrl = await QRCode.toDataURL(r.checkinUrl, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
    rows.push({ ...r, dataUrl })
  }

  const cards = rows
    .map(
      (r) => `
    <div class="card">
      <h2>${escapeHtml(r.name)}</h2>
      <p class="note">${escapeHtml(r.note)}</p>
      <img src="${r.dataUrl}" alt="QR ${escapeHtml(r.name)}" width="220" height="220" />
      <p class="url"><a href="${escapeHtml(r.checkinUrl)}">${escapeHtml(r.checkinUrl)}</a></p>
      <p class="meta">reg: <code>${escapeHtml(r.registrationId)}</code></p>
    </div>`
    )
    .join('\n')

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>QR prueba — Doce25</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 24px; background: #f8fafc; }
    h1 { font-size: 1.25rem; color: #0f172a; }
    .hint { color: #64748b; font-size: 0.9rem; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.08); }
    .card h2 { margin: 0 0 8px; font-size: 1rem; color: #0ea5e9; }
    .note { font-size: 0.8rem; color: #64748b; margin: 0 0 12px; }
    .url { font-size: 0.7rem; word-break: break-all; }
    .url a { color: #0369a1; }
    .warn { background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 14px; border-radius: 8px; font-size: 0.85rem; color: #9a3412; margin-bottom: 20px; }
    .meta { font-size: 0.65rem; color: #94a3b8; }
    code { font-size: 0.65rem; }
    img { display: block; margin: 0 auto; }
  </style>
</head>
<body>
  <h1>Códigos QR — registros de prueba</h1>
  <p class="hint">Misma URL que en el correo y en S3. Abre desde <code>public/tools/</code> o con <code>npm run dev</code> → <code>/tools/test-registration-qrs.html</code>. Generado: ${escapeHtml(seed.createdAt || new Date().toISOString())}</p>
  <p class="warn"><strong>Estado limpio:</strong> tras un <code>seed</code> + <code>prune</code>, cada persona está <strong>sin check-in</strong> y <strong>sin tipo de participación</strong> (Individual/Dúo/Grupo/Org) hasta que abras <code>/checkin/…</code>. No ejecutes <code>e2e-api-smoke.js</code> si quieres probar eso desde cero.</p>
  <div class="grid">
${cards}
  </div>
</body>
</html>`

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, html, 'utf8')
  console.log('Escrito:', OUT)
  console.log('Abre en el navegador o sirve con: npm run dev → http://localhost:3000/tools/test-registration-qrs.html')
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
