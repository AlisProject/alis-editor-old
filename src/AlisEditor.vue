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
        @addimageuri="addImageURI(idx, $event)"
        :block="block"
        :active="active === block.id"
      />
    </div>
    <!-- <MobileInsert :hasactive="!!active" /> -->
    <button type="button" class="export-button" @click="publish">公開する</button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import MobileInsert from './components/MobileInsert.vue'
import EditorBlock from './components/EditorBlock.vue'
import { Block, BlockType } from './types/Blocks'
import { cloneDeep } from 'lodash'
import { createBlock } from './utils/createBlock'
import initalState from '../spec/mock/initialState'
import { createDataURIImage } from './utils/createImage'
import { isMobile } from './utils/deviceUtil'
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
    EditorBlock,
    MobileInsert
  },
  mounted() {
    window.addEventListener('blur', () => {
      this.active = null
    })
  },
  methods: {
    setActive(block: Block) {
      this.active = block.id
    },
    addImageURI(idx: number, src: string) {
      this.createNewBlock({
        idx,
        type: BlockType.Image,
        payload: { src },
        children: []
      })
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
          if (targetDOM.selectionEnd === targetDOM.value.length && idx + 1 < this.blocks.length) {
            this.setFocus(idx + 1)
            const ta = this.getTargetTextArea(idx + 1)
            ta.setSelectionRange(0, 0)
          }
        }
      }, 20)
    },
    handleKeydownEnter(idx: number, event: KeyboardEvent) {
      const target = event.target as HTMLInputElement
      if (event.keyCode === 229) {
        return
      }
      if (event.shiftKey) {
        return
      }
      if (!target.classList.contains('shadow-input') && isMobile()) {
        // モバイルではcontentEditableのキーバインドを殺す
        return
      }

      event.preventDefault()
      let body = ''
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
    publish() {
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

.export-button {
  background: #858dda;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.13), 0 4px 7px 0 rgba(0, 0, 0, 0.11);
  padding: 10px 50px;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2.25rem;
  -webkit-appearance: none;
  transition: all 0.15s ease-out;
  letter-spacing: 2.5px;
  cursor: pointer;
  font-weight: 300;
  border-radius: 200px;
  border: 0;
  font-weight: bold;
}

.export-button:hover {
  color: #fff;
  background: #b0b8fe;
}

@media (max-width: 768px) {
  .export-button {
    margin: 15px auto;
  }
}
</style>
