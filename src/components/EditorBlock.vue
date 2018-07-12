<template>
  <div
    class="block"
    :class="{
      'block--ondrag': onDrag
    }"
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Block } from "../types/Blocks";
import ImageBlock from "./ImageBlock.vue";
import ParagraphBlock from "./ParagraphBlock.vue";

export default Vue.extend({
  components: {
    ImageBlock,
    ParagraphBlock
  },
  props: {
    block: Object
  },
  data (): { onDrag: boolean } {
    return {
      onDrag: false
    }
  },
  computed: {
    typedBlock(): Block {
      return this.block;
    }
  },
  methods: {
    handleDragover() {
      this.onDrag = true
    },
    handleDragLeave() {
      this.onDrag = false
    },
    handleDrop(event: Event) {
      event.preventDefault()
      event.stopPropagation()
      this.$emit('drop', event)
    },
    handleUpdate(event: any) {
      this.$emit("update", event);
    },
    handleDelete(event: any) {
      this.$emit("delete", event);
    }
  }
});
</script>

<style scoped>
.block {
  border: solid 2px transparent;
}

.block.block--ondrag {
  border: dotted 2px #555;
}

.block.block--ondrag * {
  pointer-events: none;
}
</style>
