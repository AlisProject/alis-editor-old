<template>
  <blockquote>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
      :preview="preview"
    />
  </blockquote>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, QuoteBlock } from '../../types/Blocks'
import TextBlock from './TextBlock.vue'
import { cloneDeep } from 'lodash'

export default Vue.extend({
  components: {
    TextBlock
  },
  props: {
    block: Object as () => QuoteBlock,
    preview: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleInput(idx: number, value: string) {
      const { block } = this
      block.children[idx].payload.body = value
      this.$emit('update', cloneDeep(block))
    },
    handleDelete(idx: number) {
      this.$emit('delete', this.block)
    }
  }
})
</script>

<style scoped>
blockquote {
  font-family: 'YuGothic', 'Yu Gothic';
  background: #f6f6f6;
  font-size: 16px;
  letter-spacing: 0.1em;
  line-height: 1.5;
  margin: 0.5em 0;
  padding: 20px 20px 15px;
  word-break: break-word;
}

blockquote textarea {
  font-family: 'YuGothic', 'Yu Gothic';
  font-size: 16px;
  letter-spacing: 0.1em;
  line-height: 1.75;
  margin: 0;
  word-break: break-word;
}

@media (max-width: 640px) {
  blockquote {
    font-size: 14px;
  }
}
</style>
