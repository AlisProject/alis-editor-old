import Vue from 'vue'
import { Block, BlockType } from '../types/Blocks'
import { deleteTreeContentById, optimizeTree, applyTreeById, findRootIdByBlockId } from '../utils/treeUtil'
import { cloneDeep } from 'lodash'

class Store<S> {
  private instance: Vue

  constructor(initialState: S) {
    this.instance = new Vue({
      data: Object.assign({}, initialState, { isInitilized: false })
    })
  }

  get state(): EditorState {
    return this.instance.$data as EditorState
  }

  get isSaving(): boolean {
    return this.state.isSaving
  }

  get blocks(): Block[] {
    return (this.instance.$data as EditorState).blocks
  }

  initState(state: any) {
    Object.entries(state).forEach(([k, v]) => {
      this.instance.$data[k] = v
    })
    this.instance.$data.isInitialized = true
  }

  optimizeTree(blocks: Block[]) {
    this.instance.$data.blocks = optimizeTree([...blocks])
  }

  setIsSaving(next: boolean) {
    this.instance.$data.isSaving = !!next
  }

  setBlocks(blocks: Block[]) {
    this.instance.$data.blocks = cloneDeep([...blocks])
  }

  updateBlock(content: Block) {
    this.setBlocks([...applyTreeById(content.id, content, this.blocks)])
  }

  deleteBlock(content: Block) {
    if (this.blocks.length < 2) return
    this.setBlocks([...deleteTreeContentById(content.id, this.blocks)])
  }

  appendBlock(content: Block, beforeContent: Block) {
    const { blocks } = this.instance.$data
    const beforeId = findRootIdByBlockId(beforeContent.id, blocks)
    const beforeIndex = blocks.findIndex((b: Block) => b.id === beforeId)
    if (!(beforeIndex + 1)) {
      return
    }
    blocks.splice(beforeIndex + 1, 0, content)
    this.setBlocks([...blocks])
    return content
  }

  appendParagraphBlockInitialPosition(content: Block) {
    const { blocks } = this.instance.$data
    blocks.splice(0, 0, content)
    this.setBlocks([...blocks])
    return content
  }

  prependBlock(content: Block, afterContent: Block) {}
}

interface EditorState {
  isInitilized?: boolean
  isSaving: boolean
  blocks: Block[]
}

export class EditorStore extends Store<EditorState> {}

// const store = new EditorStore({ blocks: [] })

// export const editorStote = store
