import uuid from 'uuid/v4'

export default [
  {
    id: uuid(),
    type: 'Paragraph',
    children: [
      {
        id: uuid(),
        type: 'Text',
        payload: {
          body: 'Hello, world'
        },
        children: []
      }
    ]
  },
  {
    id: uuid(),
    type: 'Paragraph',
    children: [
      {
        id: uuid(),
        type: 'Text',
        payload: {
          body: 'AAAAAAAAAAAAAAAAAAAAA'
        },
        children: []
      }
    ]
  },
  {
    id: uuid(),
    type: 'Paragraph',
    children: [
      {
        id: uuid(),
        type: 'Text',
        payload: {
          body: 'BBBBBBBBBBBBBBBBBBBBB'
        },
        children: []
      }
    ]
  }
]
