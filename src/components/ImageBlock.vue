<template>
  <img :src="block.payload.src">
</template>

<script lang="ts">
import Vue from 'vue'
import { ImageBlock } from '../types/Blocks'

export default Vue.extend({
  props: {
    block: Object
  },
  computed: {
    typedBlock(): ImageBlock {
      return this.block
    }
  }
})
</script>

<style scoped>
img {
  max-width: 100%;
}
</style>
