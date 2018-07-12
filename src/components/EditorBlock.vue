<template>
  <div class="block">
    <component
      :is="`${block.type}Block`"
      :block="block"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '../types/Blocks'
import ParagraphBlock from './ParagraphBlock.vue'

export default Vue.extend({
  components: {
    ParagraphBlock
  },
  props: {
    block: Object
  },
  methods: {
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

</style>
