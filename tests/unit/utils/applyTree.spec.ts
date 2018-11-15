import { BlockType } from '../../../src/types/Blocks'
import { createBlock } from '../../../src/utils/createBlock'
import * as applyTree from '../../../src/utils/applyTree'

describe('applyTree.ts', () => {
  describe('.findBeforeRootContentByRootBlockId', () => {
    describe(`('456', [{id: '123'}, {id:'456'}])`, () => {
      it('shoud returns "123"', () => {
        const blocks = [
          createBlock(BlockType.Paragraph, { id: '123' }),
          createBlock(BlockType.Paragraph, { id: '456' })
        ]
        expect(applyTree.findBeforeRootContentByRootBlockId('456', blocks)).toMatchObject(
          createBlock(BlockType.Paragraph, { id: '123' })
        )
      })
    })

    describe(`('1000', [{id: '123'}, {id:'456'}])`, () => {
      it('shoud returns null', () => {
        const blocks = [
          createBlock(BlockType.Paragraph, { id: '123' }),
          createBlock(BlockType.Paragraph, { id: '456' })
        ]
        expect(applyTree.findBeforeRootContentByRootBlockId('1000', blocks)).toBe(null)
      })
    })
  })
  describe(`.findRootIdByBlockId('456',  [{id:'123',children:[{id:'456'}]}])`, () => {
    it('should returns "123"', () => {
      expect(applyTree.findRootIdByBlockId('456', [{ id: '123', children: [{ id: '456' }] }] as any)).toBe('123')
    })
  })
})
