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
  cursor: pointer;
}

.editor-insert-button__iconContent {
  transform: scale(1);
}

.editor-insert-button__icon .fill-target {
  fill: #fff;
}

.editor-insert-button__icon.is-active .fill-target,
.editor-insert-button__icon:hover .fill-target {
  fill: #848cd9;
}
</style>
