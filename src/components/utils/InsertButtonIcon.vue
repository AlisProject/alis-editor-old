<template>
  <div class="editor-insert-button__icon" :class="{ 'is-active': active }">
    <div class="editor-insert-button__iconContent" v-html="src" />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    active: Boolean,
    src: String
  }
}
</script>

<style>
.editor-insert-button__icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
}

.editor-insert-button__iconContent {
  transform: scale(0.6);
}

.editor-insert-button__icon .fill-target {
  fill: #5e5e5e;
}

.editor-insert-button__icon.is-active {
  background: #0086cc;
}

.editor-insert-button__icon.is-active .fill-target {
  fill: #fff;
}
</style>
