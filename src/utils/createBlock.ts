import uuid from 'uuid/v4'
import { Block, BlockType } from '../types/Blocks'

export function isContentEditableBlock(block: Block) {
  return isContentEditableBlockType(block.type)
}

export function isContentEditableBlockType(type: BlockType) {
  return [BlockType.Paragraph, BlockType.Quote].includes(type)
}

export function createBlock(type: BlockType, extend?: any): Block {
  extend = extend || {}
  return Object.assign({ id: uuid() }, createBlockTemplate(type), extend)
}

function createBlockTemplate(type: BlockType) {
  switch (type) {
    case BlockType.Text: {
      return {
        type: BlockType.Text,
        payload: {
          body: ''
        }
      }
    }
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
          body: '<p></p>'
        }
      }
    }
    case BlockType.Quote: {
      return {
        type: BlockType.Quote,
        payload: {
          body: ''
        }
      }
    }
    case BlockType.Heading: {
      return {
        type: BlockType.Heading,
        payload: {
          size: 'h2'
        },
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
