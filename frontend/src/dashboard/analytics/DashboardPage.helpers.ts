export const GA4_PATTERN = /^G-[A-Z0-9]{4,20}$/

/** Strip any character that can never be part of a valid GA4 ID */
export function sanitizeGa4Input(raw: string): string {
  return raw.toUpperCase().replace(/[^G\-A-Z0-9]/g, '')
}
