import uuid from 'uuid/v4'
import { BlockType } from '../../src/types/Blocks'

export default [
  {
    id: '9cf0f329-e53b-4340-a96b-e58a9ef8b61e',
    type: BlockType.Image,
    payload: {
      src: 'https://i.imgur.com/JAumQrd.png'
    },
    children: []
  },
  {
    id: uuid(),
    type: BlockType.Heading,
    payload: {
      size: 'h2',
      body: 'ALIS Editor'
    }
  },
  {
    id: uuid(),
    type: BlockType.Rule
  },
  {
    id: uuid(),
    type: BlockType.Paragraph,
    payload: {
      body: 'これは<a href="https://alis.to">ALIS</a>の投稿画面のために作られた専用のエディタです。'
    }
  },
  {
    id: uuid(),
    type: BlockType.Paragraph,
    payload: {
      body: '画像や罫線、引用の挿入や、リッチテキストの操作が可能です。'
    }
  }
]
