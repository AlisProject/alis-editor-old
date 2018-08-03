<template>
  <div class="wrapper">
    <div
    contenteditable="true"
    class="target paragraph"
    @click="handleClick"
    @keydown="handleKeyDown"
    @input="handleInput"
    @paste="handlePaste"
    ></div>
    <div
      class="toolbar"
      v-if="isTextSelecting"
      :style="toolbarStyle"
    >
      Link
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, ParagraphBlock, BlockType } from '../types/Blocks'
import { cloneDeep, debounce } from 'lodash'
import { setTimeout } from 'timers'
const sanitize = require('sanitize-html/src/index.js')

export default Vue.extend({
  props: {
    block: Object
  },
  data() {
    return {
      isKeydown: false,
      isTextSelecting: false,
      v: (this as any).block.payload.body,
      toolbar: {
        left: '0px',
        top: '-30px'
      }
    }
  },
  mounted() {
    this.$el.querySelector('.target')!.innerHTML = this.v
  },
  computed: {
    typedBlock(): ParagraphBlock {
      return this.block
    },
    toolbarStyle(): any {
      const style = {...this.toolbar}

      return style
    }
  },
  methods: {
    handleClick() {
      this.isTextSelecting = false
    },
    handleKeyDown(event: KeyboardEvent) {
      const target = event.target! as any
      if (event.keyCode === 229) {
        event.preventDefault()
        return
      }
      if (event.keyCode === 8 && !target.innerHTML) {
        this.$emit('delete', this.typedBlock)
      }
      setTimeout(() => {
        const selection = document.getSelection()
        const range = selection.getRangeAt(0)
        const rect = range.getClientRects()[0]
        console.log(rect)
        if (!range.collapsed) {
          // if()
          this.toolbar.left = `${rect.left - 40 + rect.width*0.4}px`
          this.isTextSelecting = true
        } else {
          this.isTextSelecting = false
        }
        this.toolbar = {...this.toolbar}
      }, 0)
    },
    handlePaste(event: any) {
      this.handleInput(event, true)
    },
    handleInput(event: KeyboardEvent, requireUpdateDOM?: boolean) {
      this.updateDOM(event.target, requireUpdateDOM || false)
    },
    updateDOM(target: any, requireUpdateDOM?: boolean) {
      setTimeout(() => {
        const selection = document.getSelection()
        const sanitizedHtml = sanitize(target.innerHTML, {
          allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br']
        })
        if (sanitizedHtml) {
          if (requireUpdateDOM) {
            this.$el.querySelector('.target')!.innerHTML = sanitizedHtml
          }
          this.$emit('input', sanitizedHtml)
        } else {
          this.$emit('delete', this.typedBlock)
        }
        setTimeout(() => {
          try {
            const node = selection.anchorNode
            const offset = selection.anchorOffset
            selection.removeAllRanges()
            const range = document.createRange()
            range.setStart(node, offset)
            range.setEnd(node, offset)
            selection.addRange(range)
          } catch (e) {}
        }, 0)
      }, 0)
    }
  }
})
</script>

<style scoped>
.wrapper {
  position: relative;
}

.toolbar {
  position: absolute;
  background: rgba(0,0,0,0.9);
  color: #fff;
  padding: 4px;
  border-radius: 2px;
  overflow: hidden;
  z-index: 1000000;
  cursor: pointer;
}

.toolbar:hover {
  opacity: 0.8;
}

div.target {
  border: 0;
  outline: none;
  resize: none;
  width: 100%;
  overflow: hidden;
  background: transparent;
  padding: 8px 8px 0;
  min-height: 46px;
}
</style>
