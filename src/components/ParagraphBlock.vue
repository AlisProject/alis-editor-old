<template>
  <p>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
      @splittext="handleSplit(i, $event)"
    />
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, ParagraphBlock } from '../types/Blocks'
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
    typedBlock(): ParagraphBlock {
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
    },
    async handleSplit(i: number, { start, end, event }: { start: number; end: number; event: any }) {
      console.log(uuid(), uuid())
      const block = cloneDeep(this.typedBlock)
      const original = cloneDeep(block.children[i])
      const prevContent = Object.assign(cloneDeep(original), {
        id: uuid(),
        payload: { body: original.payload.body.slice(0, start) }
      })
      const afterContent = Object.assign(cloneDeep(original), {
        id: uuid(),
        payload: { body: original.payload.body.slice(end, original.payload.body.length) }
      })
      block.children.splice(i, 0, prevContent)
      block.children.splice(i + 2, 0, afterContent)
      block.children[i + 1].payload.body = original.payload.body.slice(start, end)
      this.$emit('update', block)
    }
  }
})
</script>
