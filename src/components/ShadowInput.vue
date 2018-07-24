<template>
  <textarea
    @keydown="handleKeydown"
  ></textarea>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode !== 8) {
        return
      }
      this.$emit('delete', event)
    }
  }
})
</script>

<style scoped>
textarea {
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
