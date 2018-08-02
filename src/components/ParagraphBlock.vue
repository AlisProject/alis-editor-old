<template>
  <div
    contenteditable="true"
    class="target paragraph"
    @keydown="handleKeyDown"
    @input="handleInput"
    @paste="handlePaste"
  ></div>
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
  computed: {
    typedBlock(): ParagraphBlock {
      return this.block
    }
  },
  data() {
    return {
      isKeydown: false,
      v: (this as any).block.payload.body
    }
  },
  mounted() {
    this.$el.innerHTML = this.v
  },
  methods: {
    handleKeyDown(event: KeyboardEvent) {
      const target = event.target! as any
      if (event.keyCode === 229) {
        event.preventDefault()
        return
      }
      if (event.keyCode === 8 && !target.innerHTML) {
        this.$emit('delete', this.typedBlock)
      }
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
            this.$el.innerHTML = sanitizedHtml
          }
          this.$emit('input', sanitizedHtml)
        } else {
          this.$emit('delete', this.typedBlock)
        }
        setTimeout(() => {
          try {
            const node = selection.anchorNode
            const offset = selection.anchorOffset
            console.log(node)
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
div {
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
