import Vue from 'vue'
import { Block, BlockType } from '../types/Blocks'
import { deleteTreeContentById, applyTreeById, findRootIdByBlockId } from '../utils/applyTree'

class Store<State> {
  private instance: Vue

  constructor(initialState: State) {
    this.instance = new Vue({
      data: initialState
    })
  }

  get state(): State {
    return this.instance.$data as State
  }

  setBlocks(blocks: Block[]) {
    this.instance.$data.blocks = [...blocks]
    console.log('UPDATE BLOCK:', this.instance.$data.blocks)
  }

  updateBlock(content: Block) {
    this.setBlocks([...applyTreeById(content.id, content, this.instance.$data.blocks)])
  }

  deleteBlock(content: Block) {
    if (this.instance.$data.blocks.length < 2) return
    this.setBlocks([...deleteTreeContentById(content.id, this.instance.$data.blocks)])
  }

  appendBlock(content: Block, beforeContent: Block) {
    console.log(beforeContent.id)
    const { blocks } = this.instance.$data
    const beforeId = findRootIdByBlockId(beforeContent.id, blocks)
    const beforeIndex = blocks.findIndex((b: Block) => b.id === beforeId)
    if (!beforeIndex) {
      return
    }
    blocks.splice(beforeIndex + 1, 0, content)
    this.setBlocks([...blocks])
  }

  prependBlock(content: Block, afterContent: Block) {}
}

interface EditorState {
  blocks: Block[]
}

export class EditorStore extends Store<EditorState> {}

// const store = new EditorStore({ blocks: [] })

// export const editorStote = store
