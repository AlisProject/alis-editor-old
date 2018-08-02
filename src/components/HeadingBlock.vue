<template>
  <h2 v-if="typedBlock.payload.size === 'h2'">
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in typedBlock.children"
      :key="childBlock.id"
      :placeholder="'Type heading here...'"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
    />
    {{typedBlock.payload.body}}
  </h2>
  <h3 v-else>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in typedBlock.children"
      :key="childBlock.id"
      :placeholder="'Type heading here...'"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
    />
    {{typedBlock.payload.body}}
  </h3>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, HeadingBlock } from '../types/Blocks'
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
    typedBlock(): HeadingBlock {
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
h2 {
  margin: 8px 0;
  padding: 0;
  line-height: 0;
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande',
    'sans-serif', Sans-Serif;
}
</style>

<style>
.block h2 textarea {
  font-weight: bold;
  font-size: 32px;
  margin: 0;
  line-height: 1;
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', 'Helvetica', 'Arial', 'Lucida Grande',
    'sans-serif', Sans-Serif;
}
</style>
