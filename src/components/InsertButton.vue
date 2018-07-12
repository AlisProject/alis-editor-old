<template>
  <div class="insert-button">
    <div class="insert-button__toggle">
      +
    </div>
    <ul class="insert-button__list">
      <li class="insert-button__listItem">
        画像
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {}
})
</script>

<style scoped>
.insert-button {
  position: absolute;
  left: -32px;
  top: 0;
}
</style>
