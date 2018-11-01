import uuid from 'uuid/v4'
import { Block, BlockType } from '../types/Blocks'

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
          body: ''
        }
      }
    }
    case BlockType.Quote: {
      return {
        type: BlockType.Quote,
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
