import { BlockType } from '../../../src/types/Blocks'
import { createBlock } from '../../../src/utils/createBlock'

describe('utils/createBlock.ts', () => {
  Object.entries(BlockType).forEach(([K, V]) => {
    test(K, () => {
      expect(
        Object.assign(
          {},
          createBlock(V, {}),
          {
            id: 'VVVV-XXXX-YYYY-ZZZZ'
          }
        )
      ).toMatchSnapshot()
    })
  })
})
