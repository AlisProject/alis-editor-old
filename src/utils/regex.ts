import urlregex from 'url-regex'

export function isURL(str: string) {
  return urlregex().test(str)
}

export function isAlphaNumericSymbol(str: string) {
  return !!str.match(/^[\x21-\x7e]+$/)
}

export function isNotAlphaNumericSymbol(str: string) {
  return !!str.match(/^[^\x21-\x7e]+$/)
}

export function isJapanese(str: string) {
  return !!str.match(/([亜-熙ぁ-んァ-ヶ]+)/g)
}

export function isValidEmbedString(str: string) {
  return isURL(str) && !isNotAlphaNumericSymbol(str)
}
