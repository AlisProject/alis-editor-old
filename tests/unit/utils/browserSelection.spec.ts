import * as browserSelection from '../../../src/utils/browserSelection'

describe('utils/browserSelection', () => {
  describe('getEndNodeByElement', () => {
    test('have text', () => {
      const element = {
        id: 'root',
        childNodes: [
          {
            id: 'child1',
            childNodes: [
              {
                childNodes: [],
                children: []
              }
            ],
            children: []
          },
          {
            id: 'child2',
            childNodes: [
              {
                childNodes: [],
                children: []
              }
            ],
            children: []
          }
        ],
        children: [
          {
            id: 'child3',
            childNodes: [
              {
                childNodes: [],
                children: []
              }
            ],
            children: []
          },
          {
            id: 'child4',
            childNodes: [
              {
                id: 'grand-child1',
                childNodes: [],
                children: []
              }
            ],
            children: []
          }
        ]
      }
      const node = browserSelection.getEndNodeByElement(element) as any
      expect(node.id).toBe('grand-child1')
    })
  })
})
