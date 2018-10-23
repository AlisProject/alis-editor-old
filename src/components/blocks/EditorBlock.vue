<template>
  <div
    class="block"
    :class="{
      'block--ondrag': onDrag,
      'is-active': active
    }"
    @keydown="handleDisable"
    @click="handleClick"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragLeave"
  >
    <template v-if="block.type">
      <component
        :is="`${block.type}Block`"
        :block="block"
        @input="handleInput"
        @update="handleUpdate"
        @delete="handleDelete"
        @append="handleAppendBlock"
        @addimageuri="handleAddImage"
      />
    </template>
    <InsertButton
      v-if="block.type === 'Paragraph' && active"
      @disable="handleDisable"
      @append="handleAppendBlock"
      @upload="handleUpload"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block, BlockType } from '../../types/Blocks'
import RuleBlock from './RuleBlock.vue'
import ImageBlock from './ImageBlock.vue'
import ParagraphBlock from './ParagraphBlock.vue'
import HeadingBlock from './HeadingBlock.vue'
import QuoteBlock from './QuoteBlock.vue'
import InsertButton from '../InsertButton.vue'
import { setTimeout } from 'timers'

export default Vue.extend({
  components: {
    ImageBlock,
    ParagraphBlock,
    HeadingBlock,
    QuoteBlock,
    RuleBlock,
    InsertButton
  },
  props: {
    block: Object as () => Block,
    active: Boolean
  },
  data(): { onDrag: boolean, showInsertButton: boolean } {
    return {
      onDrag: false,
      showInsertButton: false
    }
  },
  methods: {
    handleDisable() {},
    handleClick() {
      this.$emit('active', this.block)
    },
    handleDragover() {
      this.onDrag = true
    },
    handleDragLeave() {
      this.onDrag = false
    },
    handleUpload(event: Event) {
      this.$emit('upload', event)
    },
    handleAddImage(src: string) {
      this.$emit('addimageuri', src)
    },
    handleDrop(event: Event) {
      event.preventDefault()
      event.stopPropagation()
      this.onDrag = false
      this.$emit('drop', event)
    },
    handleAppendBlock(type: BlockType) {
      this.$emit('append', type)
    },
    handleInput(event: any) {
      this.$emit('update', event)
    },
    handleUpdate(event: any) {
      this.$emit('update', event)
    },
    handleDelete(event: Block) {
      this.$emit('delete', event)
    }
  }
})
</script>

<style scoped>
.block {
  position: relative;
  border: solid 2px transparent;
}

.block.is-active {
  background: rgba(0, 0, 0, 0.01);
}

.block.block--ondrag {
  border: dotted 2px #555;
}

.block.block--ondrag * {
  pointer-events: none;
}

.mobile-space {
  display: none;
}

@media (max-width: 768px) {
  .mobile-space {
    display: block;
    padding-bottom: 60px;
  }

  .block.is-active {
    background: rgba(0, 0, 0, 0.05);
  }
}
</style>
