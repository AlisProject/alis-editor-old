<template lang="html">
  <div id="ALISEditor">
    <EditorToolbar
      @append="createNewBlockFromBlockId(active, { type: $event })"
      @upload="insertImageBlock(active, $event)"
    />
    <div
      @keydown="handleKeydown($event, getIdx(block.id))"
      @keydown.enter="handleKeydownEnter(getIdx(block.id), $event)"
      v-for="block in store.state.blocks"
      :key="block.id"
    >
      <EditorBlock
        @update="updateBlock"
        @delete="deleteBlock"
        @append="createNewBlock({idx: getIdx(block.id), type: $event})"
        @upload="insertImageBlock(block.id, $event)"
        @active="setActive($event)"
        @addimageuri="addImageURI(block.id, $event)"
        :block="block"
        :active="active === block.id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import EditorBlock from './components/blocks/EditorBlock.vue'
import EditorToolbar from './components/menu/EditorToolbar.vue'
import { Block, BlockType } from './types/Blocks'
import { createBlock } from './utils/createBlock'
import { createDataURIImage } from './utils/createImage'
import { isMobile } from './utils/deviceUtil'
import { findRootIdByBlockId, findTreeContentById } from './utils/applyTree'
import { EditorStore } from './store/'

interface EditorState {
  blocks: Block[]
  active: string | null
  activeIdx: number | null,
  store: EditorStore
}

export default Vue.extend({
  data(): EditorState {
    const store = new EditorStore({ blocks: this.initialState})
    return {
      store,
      blocks: this.initialState,
      active: null,
      activeIdx: null
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
  methods: {
    getIdx(id: string): number {
      const rootBlockId = findRootIdByBlockId(id, this.store.state.blocks)
      const idx = this.store.state.blocks.findIndex((b) => b.id == rootBlockId)
      return idx as number
    },
    setActive(block: Block) {
      this.active = block.id
    },
    addImageURI(id: string, src: string) {
      this.createNewBlockFromBlockId(
        id,
        {
          type: BlockType.Image,
          payload: { src },
          children: []
        }
      )
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      if (isMobile()) {
        // モバイルではキーバインドを殺す
        return
      }
      const allowKeyCode = [8, 37, 38, 39, 40]
      if (!allowKeyCode.includes(event.keyCode) || event.shiftKey) {
        // 何もせず本来の DOM イベントを実行
        return
      }
      const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
      if (targetDOM.tagName === 'TEXTAREA') {
        this.injectTextArea(event, idx)
      }
    },
    injectTextArea(event: KeyboardEvent, idx: number) {
      const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
      const { selectionStart: beforeSelectionStart, selectionEnd: beforeSelectionEnd } = targetDOM
      setTimeout(() => {
        const isDeleteOrLeftByTextStart = event.keyCode === 8 || event.keyCode === 37
        const isTopByFirstLine = event.keyCode === 38 && beforeSelectionStart !== 0

        const isRightByTextEnd = event.keyCode === 39 && beforeSelectionEnd === targetDOM.value.length
        const isBottomByLastLine =
          event.keyCode === 40 &&
          (beforeSelectionEnd !== targetDOM.value.length ||
            (beforeSelectionEnd === targetDOM.value.length && targetDOM.selectionEnd === targetDOM.value.length))

        // 前のブロックにフォーカスを動かす処理
        if (isDeleteOrLeftByTextStart || isTopByFirstLine) {
          if (targetDOM.selectionStart === 0 && idx != 0) {
            this.setFocus(idx - 1)
            const ta = this.getTargetTextArea(idx - 1)
            ta.setSelectionRange(ta.value.length, ta.value.length)
          }
          return
        }

        // 次のブロックにフォーカスを動かす処理
        if (isRightByTextEnd || isBottomByLastLine) {
          if (targetDOM.selectionEnd === targetDOM.value.length && idx + 1 < this.store.state.blocks.length) {
            this.setFocus(idx + 1)
            const ta = this.getTargetTextArea(idx + 1)
            ta.setSelectionRange(0, 0)
          }
        }
      }, 20)
    },
    handleKeydownEnter(idx: number, event: KeyboardEvent) {
      const target = event.target as HTMLInputElement
      if (
        event.keyCode === 229 ||
        event.shiftKey ||
        (!target.classList.contains('shadow-input') && isMobile())
      ) {
        return
      }

      event.preventDefault()
      let body = ''
      const id = (target.getAttribute('data-id') as any) as string
      if (target.tagName === 'TEXTAREA' && id) {
        const block = findTreeContentById(id, this.store.state.blocks)
        if (block) {
          body = block.payload.body.slice(target.selectionStart, block.payload.body.length)
          block.payload.body = block.payload.body.slice(0, target.selectionStart)
          this.updateBlock(block)
        }
      }

      const newId = uuid()
      this.createNewBlock({
        idx,
        type: BlockType.Paragraph,
        children: [
          {
            id: newId,
            type: BlockType.Text,
            payload: {
              body
            },
            children: []
          }
        ]
      })
      // setTimeout(() => {
      //   const el = (this.$el.querySelector(`[data-id="${newId}"]`) as any) as HTMLInputElement
      //   el.focus()
      //   el.setSelectionRange(0, 0)
      // }, 0)
    },
    async setFocus(idx?: number) {
      await Vue.nextTick()
      this.getTargetTextArea(idx).focus()
    },
    getTargetTextArea(idx?: number) {
      const targets = this.$el.querySelectorAll('textarea')
      if (idx !== undefined) {
        return targets[idx]
      } else {
        return targets[targets.length - 1]
      }
    },
    deleteBlock(content: Block) {
      this.store.deleteBlock(content)
    },
    updateBlock(content: Block) {
      this.store.updateBlock(content)
    },
    insertImageBlock(id: string, event: DragEvent) {
      ;(async () => {
        const src = await createDataURIImage(event)
        this.createNewBlockFromBlockId(
          id,
          {
            type: BlockType.Image,
            payload: { src },
            children: []
          }
        )
      })()
    },
    publish() {
      this.$emit('export', this.store.state.blocks)
    },
    createNewBlockFromBlockId(id: string, extend: { type: BlockType; payload?: any; children?: Block[] }) {
      const { type } = extend
      delete extend.type
      const beforeContent = findTreeContentById(id, this.store.state.blocks)
      if(!id || !beforeContent) {
        console.log('idかbeforeContentがないよ')
        return
      }
      this.store.appendBlock(createBlock(type, extend), beforeContent)
    },
    createNewBlock(extend: { idx: number; type: BlockType; payload?: any; children?: Block[] }) {
      // 古いので使わない
      const { idx, type } = extend
      delete extend.idx
      delete extend.type
      const beforeContent = this.blocks[idx]
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
