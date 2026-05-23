export const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export function validateEmail(value: string): string {
  if (!value) return ''
  return EMAIL_RE.test(value.trim()) ? '' : 'contact.form.emailError'
}

/**
 * Name: ASCII letters only, digits, hyphens, single spaces.
 * No accented / non-ASCII letters allowed.
 */
export function sanitizeName(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9 \-]/g, '')             // keep only ASCII letters, digits, hyphens, spaces
    .replace(/ {2,}/g, ' ')                        // collapse double spaces
    .toUpperCase()                                 // all letters uppercase
}

/**
 * Message: ASCII letters/digits/common punctuation only.
 * Strips accented chars and code/injection characters.
 * Preserves newlines; collapses consecutive spaces.
 */
export function sanitizeMessage(value: string): string {
  return value.replace(/[^a-zA-Z0-9 \-]/g, '')             // keep only ASCII letters, digits, hyphens, spaces
    .replace(/ {2,}/g, ' ')                        // collapse double spaces
}

/**
 * URL: allows only RFC 3986 valid characters.
 * Strips spaces, accented chars, and injection characters.
 */
export function sanitizeUrl(value: string): string {
  return value.replace(/[^a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=%]/g, '')
}