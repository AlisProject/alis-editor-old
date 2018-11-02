<template>
  <div
    class="insert-button"
  >
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
      <li class="insert-button__listItem" @click="dispatchUpload">
        画像
      </li>
      <li class="insert-button__listItem" @click="appendRule">
        罫線
      </li>
      <li class="insert-button__listItem" @click="appendQuote">
        引用
      </li>
      <li class="insert-button__listItem" @click="appendHeading">
        大見出し
      </li>
    </ul>
    <input type="file" @change="handleUpload" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlockType } from '../../types/Blocks'

export default Vue.extend({
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleIsOpen() {
      this.isOpen = !this.isOpen
    },
    dispatchUpload() {
      ;(this.$el.querySelector('[type="file"]') as any).click()
    },
    append(type: BlockType) {
      setTimeout(() => {
        this.isOpen = false
        this.$emit('append', type)
        this.$emit('disable')
      }, 100)
    },
    appendParagraph() {
      this.isOpen = false
      this.$emit('append', BlockType.Paragraph)
      this.$emit('disable')
    },
    appendRule() {
      this.append(BlockType.Rule)
    },
    appendQuote() {
      this.isOpen = false
      this.$emit('append', BlockType.Quote)
      this.$emit('disable')
    },
    appendHeading() {
      this.isOpen = false
      this.$emit('append', BlockType.Heading)
      this.$emit('disable')
    },
    handleUpload(event: Event) {
      this.isOpen = false
      this.$emit('disable')
      this.$emit('upload', event)
    },
    handleClickPublish() {
      this.$emit('publish')
    }
  }
})
</script>

<style scoped>
.insert-button {
  position: absolute;
  left: -40px;
  top: -1px;
  margin: 8px;
  cursor: pointer;
  z-index: 1000000000000000000;
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
  margin: 4px 0 0px 2px;
  padding: 0;
  color: #fff;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  list-style-type: none;
  font-size: 1.4rem;
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

input {
  display: none;
}
</style>
