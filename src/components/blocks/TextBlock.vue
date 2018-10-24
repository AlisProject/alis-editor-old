<template>
  <textarea
    @click="handleFocus"
    @input="handleInput"
    @keydown="handleKeydown"
    :rows="rows"
    :data-id="block.id"
    :placeholder="placeholder || ''"
    v-if="!preview"
  >{{block.payload.body}}</textarea>
  <span
    v-else
    class="text preview"
  >
    {{block.payload.body}}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { TextBlock, BlockType } from '../../types/Blocks'

export default Vue.extend({
  props: {
    block: Object as () => TextBlock,
    placeholder: String,
    preview: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    rows() {
      return (this as any).block.payload.body.split('\n').length
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus')
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode !== 8 || this.block.payload.body) {
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
}

.text.preview {
  line-height: 1.65;
  padding: 0 8px;
}
</style>
