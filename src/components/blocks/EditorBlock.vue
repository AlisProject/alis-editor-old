<template>
  <div
    class="block"
    :class="{
      'block--ondrag': onDrag,
      'is-active': active
    }"
    :data-block-id="block.id"
    @click="handleClick"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragLeave"
    v-if="!config.preview"
  >
    <template v-if="block.type">
      <component
        :is="`${block.type}Block`"
        :block="block"
        v-bind="config"
        @input="handleInput"
        @update="handleUpdate"
        @delete="handleDelete"
        @append="handleAppendBlock"
        @addimageuri="handleAddImage"
        @moveToNextBlock="moveToNextBlock"
        @addEvent="addEvent"
      />
    </template>
  </div>
  <div class="block" v-else>
    <template v-if="block.type">
      <component :is="`${block.type}Block`" :block="block" v-bind="config" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block, BlockType } from '../../types/Blocks'
import BlankBlock from './BlankBlock.vue'
import RuleBlock from './RuleBlock.vue'
import ImageBlock from './ImageBlock.vue'
import ParagraphBlock from './ParagraphBlock.vue'
import EmbedBlock from './EmbedBlock.vue'
import InsertButton from '../menu/InsertButton.vue'
import { configProps } from '../../utils/config'
import { isContentEditableBlock } from '../../utils/createBlock'
import * as sanitizer from '../../utils/sanitizer'

interface LocalState {
  onDrag: boolean
}

export default Vue.extend({
  components: {
    ImageBlock,
    ParagraphBlock,
    RuleBlock,
    EmbedBlock,
    InsertButton,
    BlankBlock
  },
  props: {
    block: Object as () => Block,
    active: Boolean,
    config: configProps
  },
  data(): LocalState {
    return {
      onDrag: false
    }
  },
  methods: {
    isContentEditableBlock(val: Block) {
      return isContentEditableBlock(val)
    },
    handleClick() {
      this.$emit('active', this.block)
    },
    handleDragover() {
      this.onDrag = true
    },
    handleDragLeave() {
      this.onDrag = false
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
    },
    isVisibleInsertButton(block: Block) {
      if (!(this.isContentEditableBlock(block) && this.active)) {
        return false
      }
      return !sanitizer.sanitizeAllTags((block.payload || { body: '' }).body)
    },
    moveToNextBlock() {
      this.$emit('moveToNextBlock')
    },
    addEvent() {
      this.$emit('addEvent')
    }
  }
})
</script>

<style scoped>
.block {
  position: relative;
  border: solid 2px transparent;
}

.block.block--ondrag {
  background: rgba(0, 0, 0, 0.1);
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
