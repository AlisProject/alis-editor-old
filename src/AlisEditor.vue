<template lang="html">
  <div id="ALISEditor">
    <button type="button" @click="exportJSON">Export</button>
    <div
      @keydown="handleKeydown($event, i)"
      @keydown.enter="handleKeydownEnter(i, $event)"
      v-for="(block, i) in blocks"
      :key="block.id"
    >
      <EditorBlock
        @drop="insertImageBlock(i, $event)"
        @update="updateBlock(i, $event)"
        @delete="deleteBlock(i)"
        @append="createNewBlock({idx: i, type: $event})"
        @upload="insertImageBlock(i, $event)"
        :block="block"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import uuid from "uuid/v4"
import EditorBlock from "./components/EditorBlock.vue"
import { Block, TextBlock, BlockType } from "./types/Blocks"
import { cloneDeep } from "lodash"
import { createBlock } from './utils/createBlock'
import initalState from "../spec/mock/initialState"
import { createDataURIImage } from './utils/createImage'

interface EditorState {
  blocks: Block[]
  active: number
}

export default Vue.extend({
  data(): EditorState {
    return {
      blocks: initalState,
      active: 0
    }
  },
  components: {
    EditorBlock
  },
  methods: {
    setActive(idx: number) {
      this.active = idx
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      const allowKeyCode = [8, 37, 39]
      if (!allowKeyCode.includes(event.keyCode) || event.shiftKey) {
        // 何もせず本来の DOM イベントを実行
        return
      }

      const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
      if (targetDOM.tagName === 'TEXTAREA') {

        // 先頭で delete もしくは ← を押下した時に前のブロックにフォーカスを動かす処理
        if (event.keyCode === 8 || event.keyCode === 37) {
          if (targetDOM.selectionStart === 0 && idx != 0) {
            this.setFocus(idx - 1)
            const ta = this.getTargetTextArea(idx - 1)
            ta.setSelectionRange(ta.value.length, ta.value.length)
          }
          return
        }

        // 末尾で → を押下した時に次のブロックにフォーカスを動かす処理
        if (event.keyCode === 39) {
          if (targetDOM.selectionEnd === targetDOM.value.length && idx + 1 < this.blocks.length) {
            this.setFocus(idx + 1)
            const ta = this.getTargetTextArea(idx + 1)
            ta.setSelectionRange(0, 0)
          }
        }
      }
    },
    handleKeydownEnter(idx: number, event: KeyboardEvent) {
      if (event.shiftKey) {
        return
      } else {
        event.preventDefault()
        this.createNewBlock({
          idx,
          type: BlockType.Paragraph,
          payload: { body: '' },
          children: [
            {
              id: uuid(),
              type: BlockType.Text,
              payload: {
                body: ''
              },
              children: []
            }
          ]
        })
        this.setFocus(idx + 1)
      }
    },
    async setFocus(idx?: number) {
      await Vue.nextTick()
      this.getTargetTextArea(idx).focus()
    },
    getTargetTextArea(idx?: number) {
      const targets = this.$el.querySelectorAll("textarea")
      if (idx !== undefined) {
        return targets[idx]
      } else {
        return targets[targets.length - 1]
      }
    },
    deleteBlock(idx: number) {
      if (this.blocks.length < 2) return
      const { blocks } = this
      blocks.splice(idx, 1)
      this.blocks = blocks
      this.setFocus(idx - 1)
    },
    updateBlock(idx: number, content: Block) {
      this.setActive(idx)
      const { blocks } = this
      blocks[idx] = content
      this.blocks = [...blocks]
    },
    insertImageBlock(idx:number, event: DragEvent) {
      (async () => {
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
      console.log(JSON.stringify(this.blocks, null, '  '))
    },
    createNewBlock(extend: { idx: number, type: BlockType, payload?: any, children?: Block[] }) {
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
  -webkit-font-smoothing: antialiased
}

input, textarea {
  font-size: 20px
}
</style>
