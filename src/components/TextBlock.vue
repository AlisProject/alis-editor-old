<template>
  <textarea
    @click="handleFocus"
    @input="handleInput"
    @keydown="handleKeydown"
    :rows="rows"
  >{{block.payload.body}}</textarea>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    block: Object
  },
  computed: {
    rows () {
      return Math.max(
        1,
        (this as any).block.payload.body.split("\n").length
      )
    }
  },
  methods: {
    handleFocus() {
      this.$emit('focus')
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode !== 8 || this.block.payload.body) {
        return
      }
      this.$emit('delete')
    },
    handleInput(event: KeyboardEvent) {
      console.log('hoge')
      const value = (event.target! as HTMLTextAreaElement).value
      this.$emit('input', value)
    }
  }
})
</script>

<style scoped>
textarea{
  border: 0;
  outline: none;
  resize: none;
  width: 100%;
  line-height: 1.65;
}
</style>
