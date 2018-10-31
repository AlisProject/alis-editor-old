<template>
    <div class="toolbar-wrapper" :class="{ 'is-fixed': isFixed }">
      <ul class="editor-toolbar">
        <li class="editor-toolbar__item" @click="appendHeading">
          <ToolbarIcon
            :src="require('../../assets/icon-h2.svg.js')"
            :active="activeRoot.type === BlockType.Heading && activeRoot.payload.size === 'h2'"
          />
        </li>
        <li class="editor-toolbar__item" @click="appendHeading">
          <ToolbarIcon
            :src="require('../../assets/icon-h3.svg.js')"
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
          <span
            class="editor-toolbar__status"
            :class="{ 'is-active': isSaving }"
          ></span>
          <div class="editor-toolbar__button" @click="handleClickPublish">
            公開する
          </div>
        </li>
      </ul>
      <!--
      <ul class="editor-toolbar editor-toolbar--decoration" :class="{ 'is-active': isDecoration }">
        <li class="editor-toolbar__item" @click="appendHeading">
          <ToolbarIcon
            :src="require('../../assets/icon-bold.svg.js')"
            :active="activeRoot.type === BlockType.Heading && activeRoot.payload.size === 'h2'"
          />
        </li>
        <li class="editor-toolbar__item" @click="appendHeading">
          <ToolbarIcon
            :src="require('../../assets/icon-italic.svg.js')"
            :active="activeRoot.type === BlockType.Heading && activeRoot.payload.size === 'h3'"
          />
        </li>
        <li class="editor-toolbar__item" @click="dispatchUpload">
          <ToolbarIcon
            :src="require('../../assets/icon-link.svg.js')"
            :active="activeRoot.type === BlockType.Image"
          />
        </li>
        <li class="editor-toolbar__item">
        </li>
        <li class="editor-toolbar__item">
        </li>
        <li class="editor-toolbar__item editor-toolbar__item-stats">
        </li>
      </ul>
      -->
      <input type="file" style="display: none;" @change="handleUpload" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ToolbarIcon from './ToolbarIcon.vue'
import { BlockType } from '../../types/Blocks'

function getTargetTag() {
  if (navigator.userAgent.includes('Edge')) return 'body'
  if (!(window as any).chrome && 'WebkitAppearance' in (document as any).documentElement.style) return 'body'
  return 'html'
}

export default Vue.extend({
  props: {
    isSaving: Boolean,
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
      isDecoration: false,
      beforeScroll: 0
    }
  },
  mounted() {
    const $ = (e: string) => document.querySelector(e) as any
    // const tag = getTargetTag() as any
    // window.addEventListener('scroll', () => {
    //   this.isFixed = $(tag)!.scrollTop > this.beforeScroll
    //   this.beforeScroll = $(tag)!.scrollTop
    // })
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

.editor-toolbar.editor-toolbar--decoration {
  transition: all 0.2s ease-out;
}
.editor-toolbar.editor-toolbar--decoration.is-active {
  transform: translateY(-44px);
}

.editor-toolbar.editor-toolbar--decoration .editor-toolbar__item {
  background: #fff;
}

.editor-toolbar.editor-toolbar--decoration .editor-toolbar__item.editor-toolbar__item-stats {
  background: transparent;
}

@media (min-width: 1080px) {
  .toolbar-wrapper {
    display: none;
  }

  .editor-toolbar {
    width: 900px;
  }

  body .toolbar-wrapper.is-fixed {
    top: inherit;
    bottom: -60px;
  }

  body .toolbar-wrapper.is-fixed {
    top: inherit;
    bottom: 0px;
  }
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
  width: 18px;
  height: 18px;
  margin: 3px;
  border: solid 1px #5ab2bd;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border-top: solid 1px transparent;
  animation: rotate 1s linear infinite;
  transition: opacity 0.2s ease-out;
  opacity: 0;
}

.editor-toolbar__status.is-active {
  opacity: 1;
}

/* .editor-toolbar__status::after {
  position: absolute;
  left: calc(50% - 4px);
  top: calc(50% - 4px);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  overflow: hidden;
  background: #5AB2BD;
  content: ''
} */

@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
  }
  25% {
    transform: rotateZ(180deg);
  }
  50% {
    transform: rotateZ(360deg);
  }
  75% {
    transform: rotateZ(540);
  }
  100% {
    transform: rotateZ(720deg);
  }
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
  cursor: pointer;
}
</style>
