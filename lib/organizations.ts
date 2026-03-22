/**
 * Configuración de organizaciones predefinidas
 * Estas organizaciones aparecerán por defecto en el dropdown
 */

export const PREDEFINED_ORGANIZATIONS = [
  'Starbucks',
  'Mapfre',
]

export const getDefaultOrganizations = (): string[] => {
  return [...PREDEFINED_ORGANIZATIONS]
}
