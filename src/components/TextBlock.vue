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
import { TextBlock } from '../types/Blocks'

export default Vue.extend({
  props: {
    block: Object,
    placeholder: String
  },
  computed: {
    rows() {
      return (this as any).typedBlock.payload.body.split('\n').length
    },
    typedBlock(): TextBlock {
      return this.block
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus')
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode !== 8 || this.typedBlock.payload.body) {
        return
      }
      this.$emit('delete')
    },
    handleInput(event: KeyboardEvent) {
      console.log('hoge')
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
}
</style>
