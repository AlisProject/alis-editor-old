<template lang="html">
  <div id="ALISEditor">
    <div
      @keydown="handleKeydown($event, idx)"
      @keydown.enter="handleKeydownEnter(idx, $event)"
      v-for="(block, idx) in blocks"
      :key="block.id"
    >
      <EditorBlock
        @drop="insertImageBlock(idx, $event)"
        @update="updateBlock"
        @delete="deleteBlock"
        @append="createNewBlock({idx, type: $event})"
        @upload="insertImageBlock(idx, $event)"
        @active="setActive($event)"
        :block="block"
        :active="active === block.id"
      />
    </div>
    <button type="button" class="export-button" @click="exportJSON">Export</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import EditorBlock from './components/EditorBlock.vue'
import { Block, BlockType } from './types/Blocks'
import { cloneDeep } from 'lodash'
import { createBlock } from './utils/createBlock'
import initalState from '../spec/mock/initialState'
import { createDataURIImage } from './utils/createImage'
import { findRootContentById, findTreeContentById, applyTreeById, deleteTreeContentById } from './utils/applyTree'

interface EditorState {
  blocks: Block[]
  active: string | null
}

export default Vue.extend({
  data(): EditorState {
    return {
      blocks: initalState,
      active: null
    }
  },
  components: {
    EditorBlock
  },
  mounted() {
    console.log(findRootContentById('test-text', this.blocks))
  },
  methods: {
    setActive(block: Block) {
      this.active = block.id
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      // const allowKeyCode = [8, 37, 38, 39, 40]
      // if (!allowKeyCode.includes(event.keyCode) || event.shiftKey) {
      //   // 何もせず本来の DOM イベントを実行
      //   return
      // }
      // const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
      // if (targetDOM.tagName === 'TEXTAREA') {
      //   this.injectTextArea(event, idx)
      // }
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
          if (targetDOM.selectionEnd === targetDOM.value.length && idx + 1 < this.blocks.length) {
            this.setFocus(idx + 1)
            const ta = this.getTargetTextArea(idx + 1)
            ta.setSelectionRange(0, 0)
          }
        }
      }, 20)
    },
    handleKeydownEnter(idx: number, event: KeyboardEvent) {
      if (event.keyCode === 229) {
        return
      }
      if (event.shiftKey) {
        return
      }
      event.preventDefault()
      let body = ''

      const target = event.target as HTMLInputElement
      const id = (target.getAttribute('data-id') as any) as string
      if (target.tagName === 'TEXTAREA' && id) {
        const block = findTreeContentById(id, this.blocks)
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
      if (this.blocks.length < 2) return
      this.blocks = [...deleteTreeContentById(content.id, this.blocks)]
    },
    updateBlock(content: Block) {
      this.blocks = [...applyTreeById(content.id, content, this.blocks)]
    },
    insertImageBlock(idx: number, event: DragEvent) {
      ;(async () => {
        const src = await createDataURIImage(event)
        this.createNewBlock({
          idx,
          type: BlockType.Image,
          payload: { src },
          children: []
        })
      })()
    },
    exportJSON() {
      this.$emit('export', this.blocks)
    },
    createNewBlock(extend: { idx: number; type: BlockType; payload?: any; children?: Block[] }) {
      const { idx, type } = extend
      delete extend.idx
      delete extend.type
      const { blocks } = this
      blocks.splice(idx + 1, 0, createBlock(type, extend))
      this.blocks = blocks
    }
  }
})
</script>

<style>
#ALISEditor {
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
}

input,
textarea {
  font-size: 20px;
}

.export-button {
  width: 100%;
  height: 60px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b0b8fe;
  font-size: 24px;
  background: #fff;
  border: solid 1px #b0b8fe;
  -webkit-appearance: none;
  transition: all 0.15s ease-out;
  cursor: pointer;
  font-weight: 300;
  border-radius: 2px;
  letter-spacing: 1.5px;
}

.export-button:hover {
  color: #fff;
  background: #b0b8fe;
}
</style>
