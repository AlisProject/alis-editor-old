<template>
  <div class="wrapper quote" v-if="!preview">
    <blockquote
      contenteditable="true"
      class="target quote"
      @click="handleClick"
      @keydown="handleKeyDown"
      @input="handleInput"
      @paste="handlePaste"
    ></blockquote>
    <div class="toolbar" v-if="isTextSelecting" :style="toolbarStyle">Link</div>
  </div>
  <div class="wrapper quote" v-else><div contenteditable="false" class="target quote preview"></div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, QuoteBlock, BlockType } from '../../types/Blocks'
import { cloneDeep, debounce } from 'lodash'
import { setTimeout } from 'timers'
import { autolinker } from '../../utils/autolinker'
import { getIframelyUrlTemplate } from '../../utils/iframely'
import * as sanitizer from '../../utils/sanitizer'

export default Vue.extend({
  props: {
    block: Object as () => QuoteBlock,
    preview: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      isKeydown: false,
      isTextSelecting: false,
      v: (this as any).block.payload.body,
      toolbar: {
        left: '0px',
        top: '-30px'
      }
    }
  },
  mounted() {
    const target = this.$el.querySelector('.target')
    if (!target) {
      return
    }
    target.innerHTML = autolinker.link(this.v)
  },
  computed: {
    toolbarStyle(): any {
      return { ...this.toolbar }
    }
  },
  methods: {
    handleClick() {
      this.isTextSelecting = false
    },
    handleKeyDown(event: KeyboardEvent) {
      const target = event.target! as any
      if (event.keyCode === 229) {
        event.preventDefault()
        return
      }
      if (event.keyCode === 8 && !target.innerHTML) {
        this.$emit('delete', this.block)
      }
    },
    handlePaste(event: any) {
      this.handleInput(event, true)
    },
    handleInput(event: KeyboardEvent, requireUpdateDOM?: boolean) {
      this.updateDOM(event.target, requireUpdateDOM || false)
    },
    updateDOM(target: any, requireUpdateDOM?: boolean) {
      requestAnimationFrame(() => {
        const selection = document.getSelection()
        const sanitizedHtml = sanitizer.sanitizeCommonTags(target.innerHTML)
        if (sanitizedHtml) {
          if (requireUpdateDOM) {
            this.$el.querySelector('.target')!.innerHTML = sanitizedHtml
          }
          const block = cloneDeep(this.block)
          block.payload.body = sanitizedHtml
          this.$emit('input', block)
        } else {
          this.$emit('delete', this.block)
        }
      })
    }
  }
})
</script>

<style>
.quote.wrapper {
  position: relative;
  font-size: 2rem;
  background: #f6f6f6;
}

.quote .toolbar {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 4px;
  border-radius: 2px;
  overflow: hidden;
  z-index: 1000000;
  cursor: pointer;
}

.quote .toolbar:hover {
  opacity: 0.8;
}

.quote blockquote.target {
  background: transparent;
  border: 0;
  color: #040404;
  font-family: 'YuGothic', 'Yu Gothic';
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.1em;
  line-height: 1.8;
  min-height: 46px;
  outline: none;
  overflow: hidden;
  padding: 16px;
  resize: none;
  text-align: left;
  width: 100%;
  word-break: break-word;
  display: block;
  margin: 0;
}

.target.quote:empty::before {
  content: '';
  color: #999;
  font-size: 1em;
}

.target.quote.preview:empty::before {
  content: '';
}

@media screen and (max-width: 640px) {
  .quote div.target {
    color: #030303;
    font-size: 14px;
  }
}
</style>
