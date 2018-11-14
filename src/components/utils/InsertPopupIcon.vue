<template>
  <div class="editor-insert-popup__icon" :class="{ 'is-active': active }">
    <div class="editor-insert-popup__iconContent" v-html="src" />
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

<style scoped>
.editor-insert-popup__icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
  cursor: pointer;
}

.editor-insert-popup__iconContent {
  transform: scale(1);
}

.editor-insert-popup__icon .fill-target {
  fill: #fff;
}

.editor-insert-popup__icon.is-active .fill-target,
.editor-insert-popup__icon:hover .fill-target {
  fill: #848cd9;
}
</style>
