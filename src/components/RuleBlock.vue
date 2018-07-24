<template>
  <div class="rule">
    <hr/>
    <ShadowInput @delete="handleDelete" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ShadowInput from './ShadowInput.vue'

export default Vue.extend({
  props: {
    block: Object
  },
  methods: {
    handleDelete() {
      this.$emit('delete', this.block)
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
