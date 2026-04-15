import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import {
  CERT_NAME_RGB,
  CERT_NAME_SIZE,
  CERT_NAME_X,
  CERT_NAME_Y,
  CERT_SIGNATURE_MAX_HEIGHT,
  CERT_SIGNATURE_MAX_WIDTH,
  CERT_SIGNATURE_X,
  CERT_SIGNATURE_Y,
} from '@/lib/certificatePdfLayout'

/**
 * Compone el PDF del certificado: nombre tipográfico + imagen PNG de firma (opcional).
 * Debe ejecutarse en el cliente (fetch del PDF base desde /public).
 */
export async function buildCertificatePdfFromBase(
  basePdfBytes: ArrayBuffer,
  options: { displayName: string; signaturePng?: Uint8Array | null }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(basePdfBytes)
  const page = pdfDoc.getPages()[0]
  const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  page.drawText(options.displayName, {
    x: CERT_NAME_X,
    y: CERT_NAME_Y,
    size: CERT_NAME_SIZE,
    font,
    color: rgb(CERT_NAME_RGB.r, CERT_NAME_RGB.g, CERT_NAME_RGB.b),
  })

  const sig = options.signaturePng
  if (sig && sig.byteLength > 0) {
    try {
      const img = await pdfDoc.embedPng(sig)
      const iw = img.width
      const ih = img.height
      let w = CERT_SIGNATURE_MAX_WIDTH
      let h = (ih / iw) * w
      if (h > CERT_SIGNATURE_MAX_HEIGHT) {
        h = CERT_SIGNATURE_MAX_HEIGHT
        w = (iw / ih) * h
      }
      page.drawImage(img, {
        x: CERT_SIGNATURE_X,
        y: CERT_SIGNATURE_Y,
        width: w,
        height: h,
      })
    } catch {
      // PNG inválido: omitir firma
    }
  }

  return pdfDoc.save()
}
