<template lang="html">
  <div id="ALISEditor">
    <button type="button" @click="exportJSON">Export</button>
    <div
      @keydown="handleKeydown($event, i)"
      v-for="(block, i) in blocks"
      :key="block.id"
    >
      <EditorBlock
        @drop="insertImageBlock(i, $event)"
        @update="updateBlock(i, $event)"
        @delete="deleteBlock(i)"
        @append="insertRuleBlock(i, $event)"
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
      const allowKeyCode = [8, 13]
      if (!allowKeyCode.includes(event.keyCode)) {
        // 何もせず本来の DOM イベントを実行
        return
      }

      const targetDOM = this.$el.querySelector(':focus')! as HTMLInputElement
      if (targetDOM.tagName === 'TEXTAREA') {
        if (event.keyCode === 8) {
          if (targetDOM.selectionStart === 0) {
            console.log(idx)
            this.setFocus(idx - 1)
            const ta = this.getTargetTextArea(idx - 1)
            ta.setSelectionRange(ta.value.length, ta.value.length)
          }
          return
        }
      }
      // onEnter
      if (event.keyCode === 13) {
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
      }
      console.log("1")
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
      const { blocks } = this
      blocks.splice(idx, 1)
      this.blocks = blocks
      this.setFocus(idx - 1)
    },
    updateBlock(idx: number, content: Block) {
      this.setActive(idx)
      const { blocks } = this
      blocks[idx] = content
      this.blocks = blocks
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
    insertRuleBlock(idx: number, type: BlockType) {
      this.createNewBlock({
        idx,
        type
      })
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
