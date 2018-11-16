import { BlockType } from '../../../src/types/Blocks'
import { createBlock, isContentEditableBlock } from '../../../src/utils/createBlock'

describe('utils/createBlock.ts', () => {
  describe('isContentEditableBlock', () => {
    test('valid', () => {
      expect(isContentEditableBlock(createBlock(BlockType.Paragraph))).toBe(true)
    })
    test('invalid', () => {
      expect(isContentEditableBlock(createBlock(BlockType.Rule))).toBe(false)
    })
  })
  Object.entries(BlockType).forEach(([K, V]) => {
    test(K, () => {
      expect(
        Object.assign({}, createBlock(V, {}), {
          id: 'VVVV-XXXX-YYYY-ZZZZ'
        })
      ).toMatchSnapshot()
    })
  })
})
