import { BlockType } from '../../../src/types/Blocks'
import * as createBlock from '../../../src/utils/createBlock'

describe('utils/createBlock.ts', () => {
  describe('isContentEditableBlock', () => {
    test('valid', () => {
      expect(createBlock.isContentEditableBlock(createBlock.createBlock(BlockType.Paragraph))).toBe(true)
    })
    test('invalid', () => {
      expect(createBlock.isContentEditableBlock(createBlock.createBlock(BlockType.Rule))).toBe(false)
    })
  })
  describe('isContentEditableBlockType', () => {
    test('valid', () => {
      expect(createBlock.isContentEditableBlockType(createBlock.createBlock(BlockType.Paragraph).type)).toBe(true)
    })
    test('invalid', () => {
      expect(createBlock.isContentEditableBlockType(createBlock.createBlock(BlockType.Rule).type)).toBe(false)
    })
  })
  Object.entries(BlockType).forEach(([K, V]) => {
    test(`${K}-extend`, () => {
      expect(
        Object.assign({}, createBlock.createBlock(V, {}), {
          id: 'VVVV-XXXX-YYYY-ZZZZ'
        })
      ).toMatchSnapshot()
    })
    test(`${K}-default`, () => {
      expect(
        Object.assign({}, createBlock.createBlock(V), {
          id: 'VVVV-XXXX-YYYY-ZZZZ'
        })
      ).toMatchSnapshot()
    })
  })
})
