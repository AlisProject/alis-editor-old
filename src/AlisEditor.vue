<template lang="html">
  <div id="ALISEditor">
    <EditorToolbar
      @append="appendNewBlock(active, { type: $event })"
      @upload="insertImageBlock(active, $event)"
      :activeRoot="activeRoot || {}"
    />
    <div
      @keydown="handleKeydown($event, getIdx(block.id))"
      @keydown.enter="handleKeydownEnter(block.id, $event)"
      v-for="block in store.state.blocks"
      :key="block.id"
    >
      <EditorBlock
        @update="updateBlock"
        @delete="deleteBlock"
        @append="appendNewBlock(block.id, {type: $event})"
        @upload="insertImageBlock(block.id, $event)"
        @active="setActive($event)"
        @addimageuri="addImageURI(block.id, $event)"
        :block="block"
        :active="activeRoot && activeRoot.id === block.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import EditorBlock from './components/blocks/EditorBlock.vue'
import EditorToolbar from './components/menu/EditorToolbar.vue'
import { Block, BlockType, ParagraphBlock } from './types/Blocks'
import { createBlock } from './utils/createBlock'
import { createDataURIImage } from './utils/createImage'
import { isMobile } from './utils/deviceUtil'
import { findRootIdByBlockId, findTreeContentById } from './utils/applyTree'
import { EditorStore } from './store/'
import { cloneDeep } from 'lodash'

interface EditorState {
  blocks: Block[]
  active: string | null
  activeIdx: number | null
  store: EditorStore
  isPressedEnter: boolean
}

export default Vue.extend({
  data(): EditorState {
    const store = new EditorStore({ blocks: this.initialState })
    return {
      store,
      blocks: this.initialState,
      active: null,
      activeIdx: null,
      isPressedEnter: false
    }
  },
  props: ['initialState'],
  components: {
    EditorBlock,
    EditorToolbar
  },
  mounted() {
    window.addEventListener('blur', () => {
      // this.active = null
    })
  },
  computed: {
    activeRoot(): Block | null {
      const id = findRootIdByBlockId(this.active || '', this.store.state.blocks)
      if (!id) return null
      return findTreeContentById(id, this.store.state.blocks) || null
    }
  },
  methods: {
    getIdx(id: string): number {
      const rootBlockId = findRootIdByBlockId(id, this.store.state.blocks)
      const idx = this.store.state.blocks.findIndex(b => b.id == rootBlockId)
      return idx as number
    },
    setActive(block: Block) {
      this.active = block.id
    },
    addImageURI(id: string, src: string) {
      this.appendNewBlock(id, {
        type: BlockType.Image,
        payload: { src },
        children: []
      })
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      if (event.keyCode === 13) return
      this.isPressedEnter = false
    },
    handleKeydownEnter(id: string, event: KeyboardEvent) {
      if (!this.isPressedEnter) {
        this.isPressedEnter = true
        return
      }
      requestAnimationFrame(() => {
        const index = Array.prototype.indexOf.call(
          document.querySelector(':focus')!.childNodes,
          window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
        )
        const l = document.querySelector(':focus')!.childNodes.length

        const nowElement = document.createElement('div')
        const newElement = document.createElement('div')
        document.querySelector(':focus')!.childNodes.forEach((child, i) => {
          child = child.cloneNode(true) as Node & ChildNode
          if (index === -1) {
            if (i !== l - 2) {
              nowElement.appendChild(child)
            }
          } else {
            if (i >= index - 1) {
              console.log(child)
              if (child.textContent) newElement.appendChild(child)
            } else if (i < index - 1) {
              if (child.textContent) nowElement.appendChild(child)
            }
          }
        })
        const nowBlock = { ...findTreeContentById(id, this.store.state.blocks) } as ParagraphBlock
        nowBlock.payload.body = `${nowElement.innerHTML}`
        this.updateBlock(nowBlock)
        document.querySelector(':focus')!.innerHTML = `${nowElement.innerHTML}`
        const newId = uuid()
        this.appendNewBlock(id, {
          type: BlockType.Paragraph,
          payload: {
            body: newElement.innerHTML
          }
        })
        requestAnimationFrame(() => {
          document.querySelector('body')!.click
          this.active = null
        })
      })
      this.isPressedEnter = false
    },
    insertImageBlock(id: string, event: DragEvent) {
      ;(async () => {
        const src = await createDataURIImage(event)
        this.appendNewBlock(id, {
          type: BlockType.Image,
          payload: { src },
          children: []
        })
      })()
    },
    publish() {
      this.$emit('export', this.store.state.blocks)
    },
    deleteBlock(content: Block) {
      this.store.deleteBlock(content)
    },
    updateBlock(content: Block) {
      this.store.updateBlock(content)
    },
    appendNewBlock(id: string, extend: { type: BlockType; payload?: any; children?: Block[] }) {
      const { type } = extend
      delete extend.type
      const beforeContent = findTreeContentById(id, this.store.state.blocks)
      if (!id || !beforeContent) {
        console.log('idかbeforeContentがないよ')
        return
      }
      this.store.appendBlock(createBlock(type, extend), beforeContent)
    }
  }
})
</script>

<style>
#ALISEditor {
  font-size: 2rem;
  -webkit-font-smoothing: antialiased;
}

#ALISEditor * {
  box-sizing: border-box;
}

input,
textarea {
  font-size: 2rem;
}
</style>
