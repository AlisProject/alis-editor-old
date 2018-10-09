<template>
  <div class="wrapper paragraph">
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
import { Block, ParagraphBlock, BlockType } from '../../types/Blocks'
import { cloneDeep, debounce } from 'lodash'
import { setTimeout } from 'timers'
import Autolinker from 'autolinker'
const autolinker = new Autolinker()
const sanitize = require('sanitize-html/src/index.js')

export default Vue.extend({
  props: {
    block: Object as () => ParagraphBlock
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
    this.$el.querySelector('.target')!.innerHTML = autolinker.link(this.v)
  },
  computed: {
    toolbarStyle(): any {
      const style = { ...this.toolbar }

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
        this.$emit('delete', this.block)
      }
    },
    handlePaste(event: any) {
      this.handleInput(event, true)
    },
    handleInput(event: KeyboardEvent, requireUpdateDOM?: boolean) {
      this.updateDOM(event.target, requireUpdateDOM || false)
    },
    updateDOM(target: any, requireUpdateDOM?: boolean) {
      requestAnimationFrame(() => {
        const selection = document.getSelection()
        const sanitizedHtml = sanitize(target.innerHTML, {
          allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'br']
        })
        if (sanitizedHtml) {
          if (requireUpdateDOM) {
            this.$el.querySelector('.target')!.innerHTML = sanitizedHtml
          }
          const block = cloneDeep(this.block)
          block.payload.body = sanitizedHtml
          this.$emit('input', block)
        } else {
          this.$emit('delete', this.block)
        }
        // setTimeout(() => {
        //   try {
        //     const node = selection.anchorNode
        //     const offset = selection.anchorOffset
        //     selection.removeAllRanges()
        //     const range = document.createRange()
        //     range.setStart(node, offset)
        //     range.setEnd(node, offset)
        //     selection.addRange(range)
        //   } catch (e) {}
        // }, 0)
      })
    }
  }
})
</script>

<style>
.paragraph.wrapper {
  position: relative;
  font-size: 2rem;
}

.paragraph .toolbar {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 4px;
  border-radius: 2px;
  overflow: hidden;
  z-index: 1000000;
  cursor: pointer;
}

.paragraph .toolbar:hover {
  opacity: 0.8;
}

.paragraph div.target {
  border: 0;
  outline: none;
  resize: none;
  width: 100%;
  overflow: hidden;
  background: transparent;
  padding: 8px 8px 0;
  min-height: 46px;
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: 400;
  font-size: 16px;
  color: #030303;
  letter-spacing: 0.3px;
  text-align: left;
  line-height: 28px;
}

.target.paragraph:empty::before {
  content: 'Type here...';
  color: #999;
  font-size: 1em;
}
</style>
