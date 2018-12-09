import uuid from 'uuid/v4'
import { Block, BlockType } from '../types/Blocks'

export function isContentEditableBlock(block: Block) {
  return isContentEditableBlockType(block.type)
}

export function isContentEditableBlockType(type: BlockType) {
  return [BlockType.Paragraph].includes(type)
}

export function createBlock(type: BlockType, extend?: any): Block {
  extend = extend || {}
  return Object.assign({ id: uuid() }, createBlockTemplate(type), extend)
}

function createBlockTemplate(type: BlockType) {
  switch (type) {
    case BlockType.Embed: {
      return {
        type: BlockType.Embed,
        payload: {
          src: ''
        }
      }
    }
    case BlockType.Paragraph: {
      return {
        type: BlockType.Paragraph,
        payload: {
          body: '<p><br></p>'
        }
      }
    }
    case BlockType.Image: {
      return {
        type: BlockType.Image,
        payload: {
          src: '',
          align: 'center',
          caption: ''
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
