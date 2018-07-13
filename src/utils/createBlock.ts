import { Block, BlockType } from '../types/Blocks'

export function createBlock(type: BlockType, extend?: any): Block {
  extend = extend || {}
  return Object.assign(
    createBlockTemplate(type),
    extend
  )
}

function createBlockTemplate(type: BlockType) {
  switch (type) {
    case BlockType.Paragraph: {
      return {
        type: BlockType.Paragraph,
        children: [
          {
            type: BlockType.Text,
            payload: {
              body: ''
            }
          }
        ]
      }
    }
    case BlockType.Image: {
      return {
        type: BlockType.Image,
        payload: {
          src: ''
        }
      }
    }
    case BlockType.Rule: {
      return {
        type: BlockType.Rule
      }
    }
  }
}
