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
      <li class="insert-button__listItem" @click="dispatchUpload"><InsertButtonIcon :src="SvgIcon.image" /></li>
      <li class="insert-button__listItem" @click="appendRule"><InsertButtonIcon :src="SvgIcon.rule" /></li>
    </ul>
    <input type="file" @change="handleUpload" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InsertButtonIcon from './InsertButtonIcon.vue'
import { BlockType } from '../../types/Blocks'
import * as SvgIcon from '../vector/SvgIcon'

export default Vue.extend({
  data() {
    return {
      isOpen: false
    }
  },
  components: {
    InsertButtonIcon
  },
  computed: {
    SvgIcon() {
      return SvgIcon
    }
  },
  methods: {
    toggleIsOpen() {
      this.isOpen = !this.isOpen
    },
    dispatchUpload() {
      ;(this.$el.querySelector('[type="file"]') as any).click()
    },
    appendRule() {
      this.$emit('append', BlockType.Rule)
    },
    handleUpload(event: Event) {
      this.isOpen = false
      this.$emit('disable')
      this.$emit('upload', event)
    }
  }
})
</script>

<style scoped>
.insert-button {
  position: absolute;
  left: -100px;
  top: -100px;
  margin: 8px;
  cursor: pointer;
  z-index: 1000000000000000000;
  display: flex;
}

.insert-button .insert-button__toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #ddd;
  color: #ddd;
  border-radius: 50%;
  font-weight: bold;
  padding-left: 1px;
  padding-bottom: 1px;
  transition: all 0.05s linear;
  transform: rotate(0deg);
  font-size: 25px;
  font-weight: normal;
  font-family: 'Yu Gothic', YuGothic;
  box-shadow: 0 0 10px 0 hsla(0, 0%, 57%, 0.5);
}

.insert-button__toggle span {
  pointer-events: event;
  user-select: none;
}

.insert-button .insert-button__toggle.is-open {
  transform: rotate(45deg);
}

.insert-button .insert-button__list {
  margin: 0;
  padding: 0;
  color: #fff;
  overflow: hidden;
  display: flex;
  list-style-type: none;
  font-size: 1.4rem;
}

.insert-button__list .insert-button__listItem {
  margin-left: 8px;
  background: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #ddd;
  color: #ddd;
  border-radius: 50%;
  font-weight: bold;
  padding-left: 1px;
  padding-bottom: 1px;
  transition: all 0.05s linear;
  transform: rotate(0deg);
  font-size: 25px;
  font-weight: normal;
  font-family: 'Yu Gothic', YuGothic;
  box-shadow: 0 0 10px 0 hsla(0, 0%, 57%, 0.5);
}

.insert-button__list .insert-button__listItem:hover {
  background: #f9f9f9;
}

.insert-button__list .insert-button__listItem + .insert-button__listItem {
  border-left: solid 1px #fff;
}

input {
  display: none;
}
</style>
