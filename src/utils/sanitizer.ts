const sanitize = require('sanitize-html/src/index.js')

export function sanitizeAllTags(html: string): string {
  return sanitize(html, {
    allowedTags: []
  })
}

export function sanitizeCommonTags(html: string): string {
  return sanitize(html, {
    allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'br']
  })
}
