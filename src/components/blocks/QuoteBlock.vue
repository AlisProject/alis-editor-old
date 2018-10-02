<template>
  <blockquote>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
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
    block: Object
  },
  computed: {
    typedBlock(): QuoteBlock {
      return this.block
    }
  },
  methods: {
    handleInput(idx: number, value: string) {
      const { typedBlock: block } = this
      block.children[idx].payload.body = value
      this.$emit('update', cloneDeep(block))
    },
    handleDelete(idx: number) {
      this.$emit('delete', this.typedBlock)
    }
  }
})
</script>

<style scoped>
blockquote {
  background: #f0f0f0;
  border-radius: 4px;
  margin: 8px 0;
  padding: 8px;
}

@media (max-width: 768px) {
  blockquote {
    margin: 8px;
  }
}
</style>
