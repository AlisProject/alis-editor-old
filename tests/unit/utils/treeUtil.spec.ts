import { BlockType } from '../../../src/types/Blocks'
import { createBlock } from '../../../src/utils/createBlock'
import * as treeUtil from '../../../src/utils/treeUtil'

describe('treeUtil.ts', () => {
  describe('.findBeforeRootContentByRootBlockId', () => {
    describe(`('456', [{id: '123'}, {id:'456'}])`, () => {
      it('shoud returns "123"', () => {
        const blocks = [
          createBlock(BlockType.Paragraph, { id: '123' }),
          createBlock(BlockType.Paragraph, { id: '456' })
        ]
        expect(treeUtil.findBeforeRootContentByRootBlockId('456', blocks)).toMatchObject(
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
        expect(treeUtil.findBeforeRootContentByRootBlockId('1000', blocks)).toBe(null)
      })
    })
  })
  describe(`.findRootIdByBlockId('456',  [{id:'123',children:[{id:'456'}]}])`, () => {
    it('should returns "123"', () => {
      expect(treeUtil.findRootIdByBlockId('456', [{ id: '123', children: [{ id: '456' }] }] as any)).toBe('123')
    })
  })

  describe('applyTreeById', () => {
    test('valid', () => {
      const blocks = [
        createBlock(BlockType.Paragraph, { id: '123Paragraph' }),
        createBlock(BlockType.Paragraph, { id: '789Paragraph' })
      ]
      const resultBlocks = [
        createBlock(BlockType.Rule, { id: '123Rule' }),
        createBlock(BlockType.Paragraph, { id: '789Paragraph' })
      ]
      const transformedBlocks = treeUtil.applyTreeById(
        '123Paragraph',
        createBlock(BlockType.Rule, { id: '123Rule' }),
        blocks
      )
      expect(transformedBlocks).toHaveLength(2)
      expect(transformedBlocks).toEqual(resultBlocks)
    })
    test('skip', () => {
      const blocks = [
        createBlock(BlockType.Paragraph, { id: '123Paragraph' }),
        createBlock(BlockType.Paragraph, { id: '789Paragraph' })
      ]
      const transformedBlocks = treeUtil.applyTreeById(
        '456Paragraph',
        createBlock(BlockType.Rule, { id: '123Rule' }),
        blocks
      )
      expect(transformedBlocks).toHaveLength(2)
      expect(transformedBlocks).toEqual(blocks)
    })
  })

  describe('deleteTreeContentById', () => {
    test('remove parent', () => {
      const blocks = [
        createBlock(BlockType.Paragraph, { id: '123Paragraph' }),
        createBlock(BlockType.Paragraph, { id: '789Paragraph' })
      ]
      const transformedBlocks = treeUtil.deleteTreeContentById('789Paragraph', blocks)
      expect(transformedBlocks).toHaveLength(1)
      expect(transformedBlocks).toEqual(
        expect.arrayContaining([createBlock(BlockType.Paragraph, { id: '123Paragraph' })])
      )
    })
    test('skip', () => {
      const blocks = [
        createBlock(BlockType.Paragraph, { id: '123Paragraph' }),
        createBlock(BlockType.Paragraph, { id: '789Paragraph' })
      ]
      const transformedBlocks = treeUtil.deleteTreeContentById('456Paragrapha', blocks)
      expect(transformedBlocks).toHaveLength(2)
      expect(transformedBlocks).toEqual(blocks)
    })
  })
})
