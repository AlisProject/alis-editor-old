<template>
  <div class="mobile-insert"
    :class="{
      'has-active': hasactive
    }">
    <ul class="mobile-insert__list">
      <template v-if="isOpen">
        <li class="mobile-insert__listItem" @click="appendParagraph">
          <span class="fa fa-paragraph"></span>
        </li>
        <li class="mobile-insert__listItem" @click="dispatchUpload">
          <span class="fa fa-image"></span>
        </li>
        <li class="mobile-insert__listItem" @click="appendRule">
          <span class="fa fa-ellipsis-h"></span>
        </li>
        <li class="mobile-insert__listItem" @click="appendQuote">
          <span class="fa fa-quote-left"></span>
        </li>
        <li class="mobile-insert__listItem" @click="appendHeading">
          <span class="fa fa-header"></span>
        </li>
      </template>
      <li
        class="mobile-insert__listItem mobile-insert__toggle"
        @click="toggleIsOpen"
        :class="{
          'is-open': isOpen
        }"
      >
        <span class="fa fa-plus"></span>
      </li>
    </ul>
    <input type="file" @change="handleUpload" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { BlockType } from '../types/Blocks'

export default Vue.extend({
  props: {
    hasactive: Boolean
  },
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
      this.appendParagraph()
      this.append(BlockType.Rule)
    },
    appendQuote() {
      this.isOpen = false
      this.$emit('append', BlockType.Quote)
      this.$emit('disable')
      this.appendParagraph()
    },
    appendHeading() {
      this.isOpen = false
      this.$emit('append', BlockType.Heading)
      this.$emit('disable')
      this.appendParagraph()
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
.mobile-insert {
  position: absolute;
  right: 0px;
  bottom: 5px;
  margin: 8px;
  cursor: pointer;
  z-index: 1000000000000000000;
}

.mobile-insert .mobile-insert__listItem {
  margin-left: 8px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: solid 1px #000; */
  border-radius: 50%;
  font-weight: bold;
  line-height: 0;
  padding-top: 3px;
  padding-left: 1px;
  padding-bottom: 1px;
  /* transition: all 0.05s linear;
  transform: rotate(0deg); */
  background: #fff;
  font-size: 1.7rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  border: solid 1px #fafafa;
}

.mobile-insert__toggle {
  color: #fff;
  border: 0 !important;
  background: #858dda !important;
}

.mobile-insert__toggle span {
  pointer-events: event;
  user-select: none;
}

.mobile-insert .mobile-insert__toggle.is-open {
  transform: rotate(45deg);
}

.mobile-insert .mobile-insert__list {
  margin: 4px 0 0px 2px;
  padding: 0;
  list-style: none;
  display: flex;
}

input {
  display: none;
}
</style>
