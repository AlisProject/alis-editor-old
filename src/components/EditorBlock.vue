<template>
  <div
    class="block"
    :class="{
      'block--ondrag': onDrag
    }"
    @keydown="handleDisable"
    @click="handleClick"
    @drop.prevent="handleDrop"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragLeave"
  >
    <component
      :is="`${typedBlock.type}Block`"
      :block="block"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    <InsertButton
      v-if="typedBlock.type === 'Paragraph' && isActive"
      @disable="handleDisable"
      @append="handleAppendBlock"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '../types/Blocks'
import RuleBlock from './RuleBlock.vue'
import ImageBlock from './ImageBlock.vue'
import ParagraphBlock from './ParagraphBlock.vue'
import InsertButton from './InsertButton.vue'
import { setTimeout } from 'timers';

export default Vue.extend({
  components: {
    ImageBlock,
    ParagraphBlock,
    RuleBlock,
    InsertButton
  },
  props: {
    block: Object
  },
  data(): { onDrag: boolean, isActive: boolean } {
    return {
      onDrag: false,
      isActive: true
    }
  },
  computed: {
    typedBlock(): Block {
      return this.block
    }
  },
  methods: {
    handleAppendBlock() {
      this.$emit('append')
    },
    handleDisable() {
      setTimeout(() => {
        this.isActive = true
      }, 20)
    },
    handleClick() {
      this.isActive = true
    },
    handleDragover() {
      this.onDrag = true
    },
    handleDragLeave() {
      this.onDrag = false
    },
    handleDrop(event: Event) {
      event.preventDefault()
      event.stopPropagation()
      this.onDrag = false
      this.$emit('drop', event)
    },
    handleUpdate(event: any) {
      this.$emit('update', event)
    },
    handleDelete(event: any) {
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

.block.block--ondrag {
  border: dotted 2px #555;
}

.block.block--ondrag * {
  pointer-events: none;
}
</style>
