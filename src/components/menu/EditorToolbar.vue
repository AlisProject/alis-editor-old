<template>
  <div class="toolbar-wrapper" :class="{ 'is-fixed': isFixed }">
    <ul class="editor-toolbar">
      <li class="editor-toolbar__item" @click="appendHeading">
        <img src="../../assets/icon-bold.svg" alt="">
      </li>
      <li class="editor-toolbar__item" @click="appendHeading">
        <img src="../../assets/icon-semibold.svg" alt="">
      </li>
      <li class="editor-toolbar__item" @click="dispatchUpload">
        <img src="../../assets/icon-image.svg" alt="">
      </li>
      <li class="editor-toolbar__item" @click="appendQuote">
        <img src="../../assets/icon-quote.svg" alt="">
      </li>
      <li class="editor-toolbar__item" @click="appendRule">
        <img src="../../assets/icon-rule.svg" alt="">
      </li>
      <li class="editor-toolbar__item editor-toolbar__item-stats">
        <span class="editor-toolbar__status">保存中</span>
        <button class="editor-toolbar__button" type="button">
          <div>公開する</div>
        </button>
      </li>
    </ul>
    <input type="file" style="display: none;" @change="handleUpload" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlockType } from '../../types/Blocks'

export default Vue.extend({
  props: {
    hasactive: Boolean
  },
  data() {
    return {
      isFixed: true,
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
    }
  }
})
</script>

<style scoped>
.toolbar-wrapper {
  position: fixed;
  left: 0;
  top: -44px;
  width: 100vw;
  height: 44px;
  background: #ffffff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 100000;
  transition: all 0.2s ease-out;
}

.toolbar-wrapper.is-fixed {
  top: 0;
}

.editor-toolbar {
  display: grid;
  width: 335px;
  height: 100%;
  max-width: calc(100% - 16px);
  list-style: none;
  margin: 0 auto;
  padding: 0;
  grid-template-columns: 44px 44px 44px 44px 44px 1fr;
}

.editor-toolbar__item {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar__item.editor-toolbar__item-stats {
  justify-content: flex-end;
}

.editor-toolbar__status {
  font-size: 12px;
  color: #6e6e6e;
  text-align: right;
  line-height: 12px;
}

.editor-toolbar__button,
.editor-toolbar__button span {
  width: 60px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: #0086cc;
  border-radius: 2px;
  appearance: none;
  -webkit-appearance: none;
  border: 0;
  font-weight: bold;
  margin-left: 8px;
}
</style>
