/**
 * Nombre tal como se imprime en el PDF del certificado: espacios normalizados
 * y mayúscula inicial en cada palabra (locale es-PR), estilo constancia.
 */
export function formatCertificateName(raw: string): string {
  const collapsed = raw.trim().replace(/\s+/g, ' ')
  if (!collapsed) return collapsed
  return collapsed
    .split(/\s+/)
    .map((part) => {
      if (!part) return part
      const lower = part.toLocaleLowerCase('es-PR')
      return lower.charAt(0).toLocaleUpperCase('es-PR') + lower.slice(1)
    })
    .join(' ')
}
