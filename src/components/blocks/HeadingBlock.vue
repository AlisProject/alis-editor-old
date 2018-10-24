<template>
  <h2 v-if="block.payload.size === 'h2'">
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      :placeholder="'Type heading here...'"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
      :preview="preview"
    />
    {{block.payload.body}}
  </h2>
  <h3 v-else>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      :placeholder="'Type heading here...'"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
      :preview="preview"
    />
    {{block.payload.body}}
  </h3>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, HeadingBlock } from '../../types/Blocks'
import TextBlock from './TextBlock.vue'
import { cloneDeep } from 'lodash'

export default Vue.extend({
  components: {
    TextBlock
  },
  props: {
    block: Object as () => HeadingBlock,
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
h2,
h3 {
  line-height: 1;
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: bold;
  color: #030303;
  letter-spacing: 1px;
  text-align: left;
  padding: 0;
}

h2 {
  margin: 6px 0;
  font-size: 18px;
}

h3 {
  margin: 6px 0;
  font-size: 16px;
}
</style>

<style>
.block h2 textarea {
  line-height: 1;
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: bold;
  font-size: 18px;
  color: #030303;
  letter-spacing: 1px;
  text-align: left;
  line-height: 25px;
}

.block h3 textarea {
  line-height: 1;
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: bold;
  font-size: 16px;
  color: #030303;
  letter-spacing: 1px;
  text-align: left;
  line-height: 24px;
}
</style>
