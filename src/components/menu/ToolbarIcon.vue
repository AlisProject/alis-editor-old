<template>
  <div class="editor-toolbar__icon" :class="{ 'is-active': active }">
    <div class="editor-toolbar__iconContent" v-html="src" />
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
.editor-toolbar__icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
}

.editor-toolbar__icon .fill-target {
  fill: #5e5e5e;
}

.editor-toolbar__icon.is-active {
  background: #0086cc;
}

.editor-toolbar__icon.is-active .fill-target {
  fill: #fff;
}
</style>
