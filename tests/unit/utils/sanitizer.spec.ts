import * as sanitizer from '@/utils/sanitizer'

describe('utils/sanitizer', () => {
  test('sanitizeAllTags', () => {
    expect(
      sanitizer.sanitizeAllTags(
        '<p><b>foobar</b><script>alert(1)</script><div onClick="alert(1)"></div><a href="javascript:alert(1)">baz</a></p>'
      )
    ).toBe('foobarbaz')
  })
  test('sanitizeCommonTags', () => {
    expect(
      sanitizer.sanitizeCommonTags(
        '<p><b>foobar</b><script>alert(1)</script><div onClick="alert(1)"></div><a href="javascript:alert(1)">baz</a><a href="https://example.com">link</a></p>'
      )
    ).toBe('<p><b>foobar</b><a>baz</a><a href="https://example.com">link</a></p>')
  })
})
