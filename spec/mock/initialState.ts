import uuid from 'uuid/v4'
import { BlockType } from '../../src/types/Blocks'

export default [
  {
    id: uuid(),
    type: BlockType.Paragraph,
    children: [
      {
        id: uuid(),
        type: BlockType.Text,
        payload: {
          body: 'Hello, world'
        },
        children: []
      }
    ]
  },
  {
    id: uuid(),
    type: BlockType.Paragraph,
    children: [
      {
        id: uuid(),
        type: BlockType.Text,
        payload: {
          body: 'AAAAAAAAAAAAAAAAAAAAA'
        },
        children: []
      }
    ]
  },
  {
    id: uuid(),
    type: BlockType.Paragraph,
    children: [
      {
        id: 'test-text',
        type: BlockType.Text,
        payload: {
          body: 'BBBBBBBBBBBBBBBBBBBBB'
        },
        children: []
      }
    ]
  }
]
