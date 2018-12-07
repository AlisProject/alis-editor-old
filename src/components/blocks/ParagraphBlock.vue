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
import * as sanitizer from '../../utils/sanitizer'

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
      if (event.type === "paste") {
        return this.updateDOM(event.currentTarget, requireUpdateDOM || false)
      }
      this.updateDOM(event.target, requireUpdateDOM || false)
    },
    updateDOM(target: any, requireUpdateDOM?: boolean) {
      requestAnimationFrame(() => {

        const targetParagraph = (document as any).querySelector(`[data-block-id="${(this as any).block.id}"] .target`)

        // ブロック内にsanitizeにかかるhtmlを貼り付けた時にテキストノードが生成されるのでそのノードをpタグで囲う処理
        Array.from(targetParagraph.childNodes, (el: any) => {
          if (el.nodeName === "#text") {
            const p = document.createElement('p')
            p.appendChild(el)
            targetParagraph.insertBefore(p, el)
            targetParagraph.removeChild(el)
          }
        })
        // ブロック内のspanの存在を確認し、unwrapしてやる
        // pタグを削除した時にspanが挿入されるContentEditorableの仕様に対応する処理です
        Array.from(targetParagraph.querySelectorAll('span'), (el: any) => {
          const parent = el.parentNode
          parent.insertBefore(el.firstChild, el)
          parent.removeChild(el)
        })

        const sanitizedHtml = sanitizer.sanitizeCommonTags(target.innerHTML)
        if (sanitizedHtml) {
          if (requireUpdateDOM) {
            this.$el.querySelector('.target')!.innerHTML = sanitizedHtml
          }
          const block = cloneDeep(this.block)
          block.payload.body = sanitizedHtml
          this.$emit('input', block)
          this.$emit('addEvent')
        } else {
          this.$emit('delete', this.block)
          this.$emit('addEvent')
        }
      })
    }
  }
})
</script>

<style lang="scss">
#ALISEditor {
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
    /*overflow: hidden;*/
    padding: 8px 8px 0;
    resize: none;
    text-align: left;
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

  .paragraph blockquote {
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
    margin: 0 0 16px 0;
    background: #f6f6f6;
  }

  .paragraph blockquote + blockquote {
    margin: -16px 0 16px 0;
  }

  h2,
  h3 {
    color: #030303;
    font-family: 'YuGothic', 'Yu Gothic';
    font-weight: bold;
    letter-spacing: 0.1em;
    line-height: 1.5;
    padding: 0;
    text-align: left;
    word-break: break-word;
    margin: 8px 0;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    h2 {
      font-size: 18px;
    }

    h3 {
      font-size: 16px;
    }
  }
  .block h2 textarea,
  .block h3 textarea {
    font-family: 'YuGothic', 'Yu Gothic';
    font-weight: bold;
    text-align: left;
    letter-spacing: 0.1em;
    color: #030303;
    line-height: 1.5;
  }

  .block h2 textarea {
    font-size: 20px;
  }

  .block h3 textarea {
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    .block h2 textarea {
      font-size: 18px;
    }

    .block h3 textarea {
      font-size: 16px;
    }
  }
}
</style>
