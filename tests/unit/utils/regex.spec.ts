import * as regex from '~/utils/regex'

describe('utils/regex.ts', () => {
  describe('isURL', () => {
    test('valid', () => {
      expect(regex.isURL('https://example.com/')).toBeTruthy()
    })
    test('invalid', () => {
      expect(regex.isURL('not url text')).toBeFalsy()
    })
  })
  describe('isIncludeNotAlphaNumericSymbol', () => {
    test('valid without alphanumericsymbol', () => {
      expect(regex.isIncludeNotAlphaNumericSymbol('あいうえお')).toBeTruthy()
    })
    test('valid with alphanumericsymbol', () => {
      expect(regex.isIncludeNotAlphaNumericSymbol('foobarあいうえお')).toBeTruthy()
    })
    test('invalid only alphanumericsymbol', () => {
      expect(regex.isIncludeNotAlphaNumericSymbol('foobar')).toBeFalsy()
    })
  })
  describe('isValidEmbedString', () => {
    test('valid without japanese', () => {
      expect(regex.isValidEmbedString('https://example.com')).toBeTruthy()
    })
    test('invalid with japanese', () => {
      expect(regex.isValidEmbedString('https://example.comあいうえお')).toBeFalsy()
    })
    test('invalid without japanese', () => {
      expect(regex.isValidEmbedString('foobar200')).toBeFalsy()
    })
  })
})
