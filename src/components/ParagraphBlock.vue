<template>
  <div
    contenteditable="true"
    class="target paragraph"
    @keydown="handleKeyDown"
    @input="handleInput"
    @paste="handlePaste"
    v-html="v"
  ></div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, ParagraphBlock, BlockType } from '../types/Blocks'
import { cloneDeep, debounce } from 'lodash'
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
  methods: {
    handleKeyDown(event: KeyboardEvent) {
      const target = event.target! as any
      if (event.keyCode === 229) {
        event.preventDefault()
        return
      }
      this.isKeydown = true
      if (!target.innerHTML) {
        this.$emit('delete', this.typedBlock)
      }
    },
    handlePaste(event: any) {
      this.isKeydown = true
      this.handleInput(event)
    },
    handleInput(event: KeyboardEvent) {
      if (!this.isKeydown) return
      this.isKeydown = false
      const target = event.target! as any
      this.updateDOM(this, target)
    },
    updateDOM: debounce((root, target) => {
      const selection = document.getSelection()
      const offset = selection.anchorOffset
      selection.removeAllRanges()
      const sanitizedHtml = sanitize(target.innerHTML, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br']
      })
      if (sanitizedHtml) {
        target.innerHTML = sanitizedHtml
        root.$emit('input', sanitizedHtml)
      } else {
        root.$emit('delete', root.typedBlock)
      }
      try {
        const range = document.createRange()
        range.selectNodeContents(root.$el)
        range.setStart((root as any).$el.firstChild, offset)
        range.setEnd((root as any).$el.firstChild, offset)
        selection.addRange(range)
      } catch (e) {}
    }, 60)
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
