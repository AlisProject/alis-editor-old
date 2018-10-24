export enum BlockType {
  Rule = 'Rule',
  Text = 'Text',
  Paragraph = 'Paragraph',
  Image = 'Image',
  Quote = 'Quote',
  Heading = 'Heading',
  Embed = 'Embed'
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

export interface EmbedBlock extends Block {
  type: BlockType.Embed,
  payload: {
    src: string
  }
}

export interface ParagraphBlock extends Block {
  type: BlockType.Paragraph
  payload: {
    body: string
  }
}

export interface TextBlock extends Block {
  type: BlockType.Text
  payload: {
    body: string
  }
}

export interface ImageBlock extends Block {
  type: BlockType.Image
  payload: {
    src: string
    align?: string
  }
  children: Block[]
}

export interface HeadingBlock extends Block {
  type: BlockType.Heading
  payload: {
    size: 'h2' | 'h3'
    body: string
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
