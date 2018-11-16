<template>
  <div class="wrapper paragraph" v-if="!preview">
    <div
      contenteditable="true"
      class="target paragraph"
      @click="handleClick"
      @keydown="handleKeyDown"
      @input="handleInput"
      @paste="handlePaste"
    ></div>
    <div class="toolbar" v-if="isTextSelecting" :style="toolbarStyle">Link</div>
  </div>
  <div class="wrapper paragraph" v-else><div contenteditable="false" class="target paragraph preview"></div></div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import { Block, ParagraphBlock, BlockType } from '../../types/Blocks'
import { cloneDeep, debounce } from 'lodash'
import { setTimeout } from 'timers'
import { autolinker } from '../../utils/autolinker'
import { getIframelyUrlTemplate } from '../../utils/iframely'
const sanitize = require('sanitize-html/src/index.js')

export default Vue.extend({
  props: {
    block: Object as () => ParagraphBlock,
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
    this.$el.querySelector('.target')!.innerHTML = autolinker.link(this.v)
  },
  computed: {
    toolbarStyle(): any {
      const style = { ...this.toolbar }

      return style
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
        const sanitizedHtml = sanitize(target.innerHTML, {
          allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'br']
        })
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
.paragraph.wrapper {
  position: relative;
  font-size: 2rem;
}

.paragraph .toolbar {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 4px;
  border-radius: 2px;
  overflow: hidden;
  z-index: 1000000;
  cursor: pointer;
}

.paragraph .toolbar:hover {
  opacity: 0.8;
}

.paragraph div.target {
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
  padding: 8px 8px 0;
  resize: none;
  text-align: left;
  width: 100%;
  word-break: break-word;
}

.target.paragraph:empty::before {
  content: '';
  color: #999;
  font-size: 1em;
}

.target.paragraph.preview:empty::before {
  content: '';
}

@media screen and (max-width: 640px) {
  .paragraph div.target {
    color: #030303;
    font-size: 14px;
  }
}
</style>
