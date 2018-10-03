<template>
  <div class="toolbar-wrapper" :class="{ 'is-fixed': isFixed }">
    <ul class="editor-toolbar">
      <li class="editor-toolbar__item" @click="appendHeading">
        <ToolbarIcon
          :src="require('../../assets/icon-bold.svg.js')"
          :active="activeRoot.type === BlockType.Heading && activeRoot.payload.size === 'h2'"
        />
      </li>
      <li class="editor-toolbar__item" @click="appendHeading">
        <ToolbarIcon
          :src="require('../../assets/icon-semibold.svg.js')"
          :active="activeRoot.type === BlockType.Heading && activeRoot.payload.size === 'h3'"
        />
      </li>
      <li class="editor-toolbar__item" @click="dispatchUpload">
        <ToolbarIcon
          :src="require('../../assets/icon-image.svg.js')"
          :active="activeRoot.type === BlockType.Image"
        />
      </li>
      <li class="editor-toolbar__item" @click="appendQuote">
        <ToolbarIcon
          :src="require('../../assets/icon-quote.svg.js')"
          :active="activeRoot.type === BlockType.Quote"
        />
      </li>
      <li class="editor-toolbar__item" @click="appendRule">
        <ToolbarIcon
          :src="require('../../assets/icon-rule.svg.js')"
          :active="activeRoot.type === BlockType.Rule"
        />
      </li>
      <li class="editor-toolbar__item editor-toolbar__item-stats">
        <span class="editor-toolbar__status">保存中</span>
        <div class="editor-toolbar__button">
          公開する
        </div>
      </li>
    </ul>
    <input type="file" style="display: none;" @change="handleUpload" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ToolbarIcon from './ToolbarIcon.vue'
import { BlockType } from '../../types/Blocks'

function getTargetTag() {
  if (navigator.userAgent.includes('Edge')) return 'body'
  if (!(window as any).chrome && 'WebkitAppearance' in document.documentElement.style) return 'body'
  return 'html'
}

export default Vue.extend({
  props: {
    hasactive: Boolean,
    activeRoot: {
      type: Object,
      required: false,
      default: {}
    }
  },
  components: {
    ToolbarIcon
  },
  data() {
    return {
      BlockType,
      isFixed: true,
      isOpen: false,
      beforeScroll: 0
    }
  },
  mounted() {
    const $ = (e: string) => document.querySelector(e) as any
    const tag = getTargetTag() as any
    window.addEventListener('scroll', () => {
      this.isFixed = $(tag)!.scrollTop > this.beforeScroll
      this.beforeScroll = $(tag)!.scrollTop
    })
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
  top: -60px;
  width: 100vw;
  height: 44px;
  background: #ffffff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 100000;
  transition: all 0.25s ease-out;
}

.toolbar-wrapper.is-fixed {
  top: 0;
}

.editor-toolbar {
  display: grid;
  width: 340px;
  height: 100%;
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

.editor-toolbar__button {
  width: 65px;
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
  letter-spacing: 0.5px;
  font-size: 12px;
}
</style>
