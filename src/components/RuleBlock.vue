<template>
  <div class="rule">
    <hr/>
    <textarea @keydown="handleKeydown" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode === 8) {
        this.$emit('delete')
      }
    }
  }
})
</script>

<style scoped>
.rule {
  position: relative;
  padding: 10px 0;
}

.rule hr {
  margin: 0;
}

.rule textarea {
  color: transparent;
  background: transparent;
  resize: none;
  opacity: 0;
  outline: none;
  display: block;
  position: absolute;
  z-index: 100000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
