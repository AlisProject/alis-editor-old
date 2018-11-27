import * as offsetCalculator from '@/utils/offsetCalculator'

describe('utils/offsetCalculator.ts', () => {
  describe('getChildrenOffset', () => {
    test('returns 2', () => {
      const a = { previousSibling: null }
      const b = { previousSibling: a }
      const c = { previousSibling: b }
      expect(offsetCalculator.getChildrenOffset(c as any)).toBe(2)
    })
    test('returns 3', () => {
      const a = { previousSibling: null }
      const b = { previousSibling: a }
      const c = { previousSibling: b }
      const d = { previousSibling: c }
      expect(offsetCalculator.getChildrenOffset(d as any)).toBe(3)
    })
    test('returns 0', () => {
      const foo = { previousSibling: null }
      expect(offsetCalculator.getChildrenOffset(foo as any)).toBe(0)
    })
  })
})
