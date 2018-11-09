<template lang="html">
  <div id="ALISEditor">
    <InsertPopup @replace="replaceBlockType" :activeRoot="activeRoot" />
    <template v-if="store.state.isInitialized">
      <EditorToolbar
        v-if="!config.preview"
        @append="appendNewBlock(active, { type: $event })"
        @upload="insertImageBlock(active, $event)"
        @publish="publish"
        :activeRoot="activeRoot || {}"
        :isSaving="store.state.isSaving"
      />
      <div
        @keydown="handleKeydown(block.id, $event)"
        @keydown.enter="handleKeydownEnter(block.id, $event)"
        v-for="block in store.state.blocks"
        :key="block.id"
      >
        <EditorBlock
          @input="updateBlock"
          @update="updateBlock"
          @delete="deleteBlock"
          @append="appendNewBlock(block.id, { type: $event })"
          @upload="insertImageBlock(block.id, $event)"
          @active="setActive($event)"
          @addimageuri="addImageURI(block.id, $event)"
          :config="config"
          :block="block"
          :active="activeRoot && activeRoot.id === block.id"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import EditorBlock from './components/blocks/EditorBlock.vue'
import EditorToolbar from './components/menu/EditorToolbar.vue'
import InsertPopup from './components/utils/InsertPopup.vue'
import { Block, BlockType, ParagraphBlock } from './types/Blocks'
import { createBlock } from './utils/createBlock'
import { createDataURIImage } from './utils/createImage'
import { isMobile, isDesktop } from './utils/deviceUtil'
import { findRootIdByBlockId, findTreeContentById } from './utils/applyTree'
import { EditorStore } from './store/'
import { cloneDeep } from 'lodash'
import urlregex from 'url-regex'
import { configProps } from './utils/config'
const sanitize = require('sanitize-html/src/index.js')

interface EditorState {
  active: string | null
  activeIdx: number | null
  store: EditorStore
  isPressedEnter: boolean
  intervalId: any
  beforeBlockSnapshot: string
}

export default Vue.extend({
  data(): EditorState {
    Vue.prototype.$editorStore = new EditorStore({
      isSaving: false,
      blocks: []
    })
    const store = Vue.prototype.$editorStore as EditorStore
    store.initState({
      blocks: (this.initialState as any) as Block[]
    })
    return {
      store,
      active: null,
      activeIdx: null,
      isPressedEnter: false,
      intervalId: null,
      beforeBlockSnapshot: ''
    }
  },
  props: {
    initialState: Array as () => Block[],
    config: configProps
  },
  components: {
    EditorBlock,
    EditorToolbar,
    InsertPopup
  },
  mounted() {
    this.beforeBlockSnapshot = JSON.stringify(this.store.state.blocks)
    window.addEventListener('blur', () => {
      // this.active = null
    })

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        if (JSON.stringify(this.store.state.blocks) !== this.beforeBlockSnapshot) {
          this.$emit('update', this.store.state.blocks)
        }
        this.store.setIsSaving(JSON.stringify(this.store.state.blocks) !== this.beforeBlockSnapshot)
        this.beforeBlockSnapshot = JSON.stringify(this.store.state.blocks)
      }, 2000)
    }
  },
  computed: {
    activeRoot(): Block | null {
      const id = findRootIdByBlockId(this.active || '', this.store.state.blocks)
      if (!id) return null
      return findTreeContentById(id, this.store.state.blocks) || null
    }
  },
  methods: {
    setActive(block: Block) {
      this.active = block.id
    },
    removeActive() {
      requestAnimationFrame(() => {
        document.querySelector('body')!.click
        this.active = null
      })
    },
    addImageURI(id: string, src: string) {
      this.appendNewBlock(id, {
        type: BlockType.Image,
        payload: { src },
        children: []
      })
    },
    replaceBlockType(type: BlockType) {
      const aR = this.activeRoot
      if (!aR) {
        return
      }
      const skeleton = createBlock(type, {})
      console.log(skeleton)
      skeleton.id = aR.id
      ;(skeleton as any).children[0].payload.body = sanitize(aR.payload.body, {
        allowedTags: []
      })
      this.updateBlock(skeleton)
    },
    handleKeydown(id: string, event: KeyboardEvent) {
      if (isMobile()) {
        if (event.keyCode === 13) {
          const childId = findRootIdByBlockId(id, this.store.state.blocks)
          if (!childId) {
            return
          }
          const nowContent = findTreeContentById(childId, this.store.state.blocks)
          if (!nowContent || (nowContent && nowContent.type !== BlockType.Paragraph)) {
            event.preventDefault()
          }
          return
        }
      }
      if (event.keyCode !== 13) {
        this.isPressedEnter = false
      }
    },
    handleKeydownEnter(id: string, event: KeyboardEvent) {
      const childId = findRootIdByBlockId(id, this.store.state.blocks)
      if (!childId) {
        return
      }

      const nowContent = findTreeContentById(childId, this.store.state.blocks)
      if (!nowContent) {
        return
      }

      if (isDesktop()) {
        if (event.shiftKey) {
          return
        }
        event.preventDefault()
        requestAnimationFrame(() => {
          const b = this.appendNewBlock(nowContent.id, {
            type: BlockType.Paragraph,
            payload: {
              body: '<p></p>'
            }
          })
          if (!b) {
            return
          }
          requestAnimationFrame(() => {
            const el = document.querySelector(`[data-block-id="${b.id}"] .target`)
            if (!el) return
            const range = document.createRange()
            const sel = window.getSelection()
            range.setStart(el.childNodes[0], 0)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          })
        })
      }

      if (isMobile()) {
        if (nowContent.type === 'Paragraph') {
          if (!this.isPressedEnter) {
            this.isPressedEnter = true
            return
          }
          this.isPressedEnter = false
          requestAnimationFrame(() => {
            this.doubleEnterGesture(nowContent, event)
          })
          return
        }
        requestAnimationFrame(() => {
          this.singleEnterGesture(nowContent, event)
        })
        this.isPressedEnter = false
      }
    },
    singleEnterGesture(content: Block, event: KeyboardEvent) {
      event.preventDefault()
      const newId = uuid()
      this.appendNewBlock(content.id, {
        type: BlockType.Paragraph,
        payload: {
          body: ''
        }
      })
      this.removeActive()
    },
    doubleEnterGesture(content: Block, event: KeyboardEvent) {
      const index = Array.prototype.indexOf.call(
        document.querySelector(':focus')!.childNodes,
        window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode
      )
      const l = document.querySelector(':focus')!.childNodes.length
      const nowElement = document.createElement('div')
      const newElement = document.createElement('div')
      ;(document.querySelector(':focus')!.childNodes as any).forEach((child: any, i: number) => {
        child = child.cloneNode(true) as Node & ChildNode
        if (!child.textContent) return
        if (index === -1) {
          if (i !== l - 2) {
            nowElement.appendChild(child)
          }
          return
        }
        if (i >= index) {
          newElement.appendChild(child)
        } else if (i < index) {
          nowElement.appendChild(child)
        }
      })
      const nowBlock = { ...content } as Block
      nowBlock.payload.body = `${nowElement.innerHTML}`
      const rawText = nowBlock.payload.body.replace(/ /g, '')
      if (urlregex().test(rawText) && !rawText.match(/([^a-zA-Z0-9]+)/g)) {
        nowBlock.type = BlockType.Embed
        nowBlock.payload = {
          src: rawText
        }
      }

      this.updateBlock(nowBlock)
      document.querySelector(':focus')!.innerHTML = `${nowElement.innerHTML}`
      const newId = uuid()
      const rawNewText = newElement.innerHTML
      if (urlregex().test(rawNewText) && !rawNewText.match(/([亜-熙ぁ-んァ-ヶ]+)/g)) {
        this.appendNewBlock(content.id, {
          type: BlockType.Embed,
          payload: {
            src: rawNewText
          }
        })
      } else {
        this.appendNewBlock(content.id, {
          type: BlockType.Paragraph,
          payload: {
            body: newElement.innerHTML
          }
        })
      }
      this.removeActive()
    },
    insertImageBlock(id: string, event: DragEvent) {
      ;(async () => {
        const src = await createDataURIImage(event)
        this.appendNewBlock(id, {
          type: BlockType.Image,
          payload: { src },
          children: []
        })
      })()
    },
    publish() {
      this.$emit('export', this.store.state.blocks)
    },
    deleteBlock(content: Block) {
      this.store.deleteBlock(content)
    },
    updateBlock(content: Block) {
      this.store.updateBlock(content)
    },
    appendNewBlock(id: string, extend: { type: BlockType; payload?: any; children?: Block[] }) {
      const { type } = extend
      delete extend.type
      const beforeContent = findTreeContentById(id, this.store.state.blocks)
      if (!id || !beforeContent) {
        console.log('idかbeforeContentがないよ')
        return
      }
      return this.store.appendBlock(createBlock(type, extend), beforeContent)
    }
  }
})
</script>

<style>
#ALISEditor {
  font-size: 2rem;
  -webkit-font-smoothing: antialiased;
}

#ALISEditor * {
  box-sizing: border-box;
}

input,
textarea {
  font-size: 2rem;
}

[data-alis-iframely-url] {
  user-select: none;
}

.twitter-profile-card {
  border-radius: 4px;
  border: 1px solid #e2e8ed;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  padding: 20px;
  text-decoration: none;
  width: 100%;
}

.twitter-profile-card .title {
  color: #030303;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.twitter-profile-card .description {
  color: #6e6e6e;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.7px;
  line-height: 1.5;
  margin-bottom: 8px;
}

.twitter-profile-card .site {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.6px;
}

.iframely-embed-card {
  border-radius: 4px;
  border: 1px solid #e3e3e3;
  box-sizing: border-box;
  cursor: pointer;
  display: block;
  height: 140px;
  margin: 0;
  padding: 20px;
  position: relative;
  text-decoration: none;
  width: 100%;
}

.iframely-embed-card .title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: #030303;
  display: -webkit-box;
  font-size: 16px;
  font-weight: 500;
  height: 22px;
  letter-spacing: 0.8px;
  line-height: 1.5;
  margin: 0 120px 10px 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  word-break: break-word;
}

.iframely-embed-card .title.without-space {
  margin: 0 0 10px 0;
}

.iframely-embed-card .description {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #6e6e6e;
  display: -webkit-box;
  font-size: 14px;
  font-weight: 500;
  height: 42px;
  letter-spacing: 0.7px;
  line-height: 1.6;
  margin: 0 120px 10px 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  word-break: break-word;
}

.iframely-embed-card .description.without-space {
  margin: 0 0 10px 0;
}

.iframely-embed-card .thumbnail {
  height: 100px;
  object-fit: cover;
  position: absolute;
  right: 20px;
  top: 20px;
  width: 100px;
}

.iframely-embed-card .site {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.6px;
}

@media screen and (max-width: 640px) {
  .twitter-profile-card .title {
    font-size: 14px;
  }

  .twitter-profile-card .description {
    font-size: 12px;
  }

  .iframely-embed-card .title {
    font-size: 14px;
    margin: 0 0 12px 0;
  }

  .iframely-embed-card .description {
    font-size: 12px;
    height: 40px;
    margin: 0 80px 12px 0;
  }

  .iframely-embed-card .description.without-space {
    margin: 0 0 12px 0;
  }

  .iframely-embed-card .site {
    font-size: 12px;
  }

  .iframely-embed-card .thumbnail {
    height: 60px;
    top: 50px;
    width: 60px;
  }

  .iframely-embed {
    -webkit-overflow-scrolling: touch;
    overflow-x: scroll;
  }
}
</style>
