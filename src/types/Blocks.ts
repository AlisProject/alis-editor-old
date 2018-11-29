export enum BlockType {
  Blank = 'Blank',
  Rule = 'Rule',
  Paragraph = 'Paragraph',
  Image = 'Image',
  Embed = 'Embed'
}

export interface Block {
  id: string
  type: BlockType
  payload?: any
  children?: Block[]
}

export interface BlankBlock extends Block {}

export interface RuleBlock extends Block {
  type: BlockType.Rule
}

export interface EmbedBlock extends Block {
  type: BlockType.Embed
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

export interface ImageBlock extends Block {
  type: BlockType.Image
  payload: {
    src: string
    align?: string
    caption?: string
  }
  children: Block[]
}
