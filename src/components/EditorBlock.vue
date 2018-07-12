<template>
  <div class="block">
    <component
      :is="`${typedBlock.type}Block`"
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
  computed: {
    typedBlock(): Block {
      return this.block
    }
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
