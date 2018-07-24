<template>
  <textarea
    @click="handleFocus"
    @input="handleInput"
    @keydown="handleKeydown"
    :rows="rows"
    :data-id="typedBlock.id"
    :placeholder="placeholder || ''"
  >{{typedBlock.payload.body}}</textarea>
</template>

<script lang="ts">
import Vue from 'vue'
import { BoldBlock, BlockType } from '../types/Blocks'

export default Vue.extend({
  props: {
    block: Object,
    placeholder: String
  },
  computed: {
    rows() {
      return (this as any).typedBlock.payload.body.split('\n').length
    },
    typedBlock(): BoldBlock {
      return this.block
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus')
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode === 18) {
        const target = (event.target as any) as HTMLInputElement
        if (target.selectionStart === target.selectionEnd) return
        this.$emit('splittext', {
          type: BlockType.Bold,
          start: target.selectionStart,
          end: target.selectionEnd,
          event
        })
        return
      }
      if (event.keyCode !== 8 || this.typedBlock.payload.body) {
        return
      }
      this.$emit('delete', this.block)
    },
    handleInput(event: KeyboardEvent) {
      const value = (event.target! as HTMLTextAreaElement).value
      this.$emit('input', value)
    }
  }
})
</script>

<style scoped>
textarea {
  border: 0;
  outline: none;
  resize: none;
  width: 100%;
  line-height: 1.65;
  overflow: hidden;
  background: transparent;
  padding: 0 8px;
  color: #5d96ff;
  text-decoration: underline;
}
</style>
