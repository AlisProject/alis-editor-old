export enum BlockType {
  Rule = 'Rule',
  Paragraph = 'Paragraph',
  Text = 'Text',
  Link = 'Link',
  Image = 'Image',
  Quote = 'Quote',
  Heading = 'Heading'
}

export interface Block {
  id: string
  type: BlockType
  payload?: any
  children?: Block[]
}

export interface RuleBlock extends Block {
  type: BlockType.Rule
}

export interface ParagraphBlock extends Block {
  type: BlockType.Paragraph
  children: Block[]
}

export interface TextBlock extends Block {
  type: BlockType.Text
  payload: {
    body: string
  }
}

export interface LinkBlock extends Block {
  type: BlockType.Link
  payload: {
    href: string
  }
  children: TextBlock[] | ImageBlock[]
}

export interface ImageBlock extends Block {
  type: BlockType.Image
  payload: {
    src: string
  }
  children: Block[]
}

export interface HeadingBlock extends Block {
  type: BlockType.Heading
  payload: {
    size: 'h2' | 'h3'
  }
  children: Block[]
}

export interface QuoteBlock extends Block {
  type: BlockType.Quote
  children: Block[]
}

/*
「詳細は [こちら](https://example.com) から確認できます」を再現する場合
[
  {
    type: 'Paragraph',
    children: [
      {
        type: 'Text',
        payload: {
          body: '詳細は'
        }
      },
      {
        type: 'Link',
        payload: {
          href: 'https://example.com'
        },
        children: [
          {
            type: 'Text',
            payload: {
              body: 'こちら'
            }
          }
        ]
      },
      {
        type: 'Text',
        payload: {
          body: 'から確認できます'
        }
      }
    ]
  }
]

*/
