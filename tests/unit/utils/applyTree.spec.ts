import * as applyTree from '../../../src/utils/applyTree'

describe('applyTree.ts', () => {
  describe(`.findRootIdByBlockId('456',  [{id:'123',children:[{id:'456'}]}])`, () => {
    it('should returns "123"', () => {
      expect(applyTree.findRootIdByBlockId('456', [{ id: '123', children: [{ id: '456' }] }] as any)).toBe('123')
    })
  })
})
