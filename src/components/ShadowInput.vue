<template>
  <textarea
    @keydown="handleKeydown"
    @paste="handlePaste"
  ></textarea>
</template>

<script lang="ts">
import Vue from 'vue'
import { createDataURIImage } from '../utils/createImage'

export default Vue.extend({
  methods: {
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode !== 8) {
        return
      }
      this.$emit('delete', event)
    },
    handlePaste(event: any) {
      ;(async () => {
        const src = await createDataURIImage(event)
        this.$emit('addimageuri', src)
      })()
    }
  }
})
</script>

<style scoped>
textarea {
  font-size: 20px !important;
  color: transparent !important;
  background: transparent !important;
  resize: none !important;
  opacity: 0 !important;
  outline: none !important;
  display: block !important;
  position: absolute !important;
  z-index: 100000 !important;
  width: 100% !important;
  height: 100% !important;
  left: 0 !important;
  top: 0 !important;
  border: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
}
</style>
