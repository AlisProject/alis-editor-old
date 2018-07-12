<template>
  <div class="insert-button">
    <div
      class="insert-button__toggle"
      @click="toggleIsOpen"
      :class="{
        'is-open': isOpen
      }"
    >
      <span>+</span>
    </div>
    <ul class="insert-button__list" v-if="isOpen">
      <li class="insert-button__listItem">
        画像
      </li>
      <li class="insert-button__listItem">
        画像
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleIsOpen() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        this.$emit('disable')
      }
    }
  }
})
</script>

<style scoped>
.insert-button {
  position: absolute;
  left: -44px;
  top: 2px;
  margin: 8px;
  cursor: pointer;
  z-index: 10000;
}

.insert-button .insert-button__toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #000;
  border-radius: 50%;
  font-weight: bold;
  line-height: 0;
  padding-left: 1px;
  padding-bottom: 1px;
  transition: all 0.05s linear;
  transform: rotate(0deg);
}

.insert-button__toggle span {
  pointer-events: event;
  user-select: none;
}

.insert-button .insert-button__toggle.is-open {
  transform: rotate(45deg);
}

.insert-button .insert-button__list {
  margin: 4px 0 0px 2px;
  padding: 0;
  color: #fff;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  list-style-type: none;
  font-size: 14px;
}

.insert-button__list .insert-button__listItem {
  padding: 4px 16px;
}

.insert-button__list .insert-button__listItem:hover {
  background: rgba(255, 255, 255, 0.2);
}

.insert-button__list .insert-button__listItem + .insert-button__listItem {
  border-left: solid 1px #fff;
}
</style>
