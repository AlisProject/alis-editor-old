<template>
  <h2>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      :placeholder="'Type heading here...'"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
    />
  </h2>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, TitleBlock } from '../types/Blocks'
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
    typedBlock(): TitleBlock {
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
      this.$emit('delete', event)
    }
  }
})
</script>

<style scoped>
h2 {
  margin: 8px 0;
}
</style>

<style>
.block h2 textarea {
  font-weight: bold;
  font-size: 24px;
}
</style>
