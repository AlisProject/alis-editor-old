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
    {{ block.payload.body }}
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
    {{ block.payload.body }}
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
  color: #030303;
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: bold;
  letter-spacing: 0.1em;
  line-height: 1.5;
  padding: 0;
  text-align: left;
  word-break: break-word;
  margin: 8px 0;
}

h2 {
  font-size: 20px;
}

h3 {
  font-size: 16px;
}

@media screen and (max-width: 640px) {
  h2 {
    font-size: 18px;
  }

  h3 {
    font-size: 16px;
  }
}
.block h2 textarea,
.block h3 textarea {
  font-family: 'YuGothic', 'Yu Gothic';
  font-weight: bold;
  text-align: left;
  letter-spacing: 0.1em;
  color: #030303;
  line-height: 1.5;
}

.block h2 textarea {
  font-size: 20px;
}

.block h3 textarea {
  font-size: 16px;
}

@media screen and (max-width: 640px) {
  .block h2 textarea {
    font-size: 18px;
  }

  .block h3 textarea {
    font-size: 16px;
  }
}
</style>
