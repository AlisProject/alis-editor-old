<template lang="html">
  <div id="ALISEditor">
    <InsertPopup :activeRoot="activeRoot" />
    <template v-if="store.state.isInitialized">
      <EditorToolbar
        v-if="!config.preview"
        @append="appendNewBlock(active, { type: $event })"
        @upload="insertImageBlock(active, $event)"
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
          @moveToNextBlock="moveToNextBlock(block.id)"
          :config="config"
          :block="block"
          :active="activeRoot && activeRoot.id === block.id"
        />
      </div>
    </template>
    <InsertButton
      v-if="insertButton.isVisibleInsertButton"
      :style="{
        left: `${insertButton.posX}px`,
        top: `${insertButton.posY}px`
      }"
      @append="appendNewBlock(activeRoot.id, { type: $event })"
      @upload="insertImageBlock(activeRoot.id, $event)"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import InsertButton from './components/menu/InsertButton.vue'
import EditorBlock from './components/blocks/EditorBlock.vue'
import EditorToolbar from './components/menu/EditorToolbar.vue'
import InsertPopup from './components/menu/InsertPopup.vue'
import { Block, BlockType, ParagraphBlock } from './types/Blocks'
import { createBlock, isContentEditableBlock, isContentEditableBlockType } from './utils/createBlock'
import { createDataURIImage } from './utils/createImage'
import { isMobile, isDesktop } from './utils/deviceUtil'
import { findRootIdByBlockId, findTreeContentById, findBeforeRootContentByRootBlockId } from './utils/treeUtil'
import * as Store from './store/'
import * as config from './utils/config'
import * as browserSelection from './utils/browserSelection'
import * as sanitizer from './utils/sanitizer'
import * as regex from './utils/regex'
import { cloneDeep } from 'lodash'
import { getEditorAreaOffset, splitBlockContentByOffset, getChildrenOffset } from './utils/offsetCalculator'

interface EditorState {
  active: string | null
  store: Store.EditorStore
  isPressedEnter: boolean
  intervalId: any
  beforeBlockSnapshot: string
  insertButton: {
    isVisibleInsertButton: boolean
    posX: number
    posY: number
    target: Node | HTMLElement | null
  }
  insertInitialPositionTrigger: boolean
}

interface DeviceKeyDownEventArgument {
  id: string
  event: KeyboardEvent
  childId: string
  nowContent: Block
}

export default Vue.extend({
  data(): EditorState {
    const store = new Store.EditorStore({
      isSaving: false,
      blocks: []
    })
    store.initState({
      blocks: (this.initialState as any) as Block[]
    })
    return {
      store,
      active: null,
      isPressedEnter: false,
      intervalId: null,
      beforeBlockSnapshot: '',
      insertButton: {
        isVisibleInsertButton: false,
        posX: 0,
        posY: 0,
        target: null
      },
      insertInitialPositionTrigger: this.isPressedEnterInTitle
    }
  },
  props: {
    initialState: {
      type: Array as () => Block[],
      default: []
    },
    config: config.configProps,
    isPressedEnterInTitle: Boolean
  },
  components: {
    EditorBlock,
    EditorToolbar,
    InsertPopup,
    InsertButton
  },
  mounted() {
    this.beforeBlockSnapshot = JSON.stringify(this.store.state.blocks)
    this.registerScheduledSave()

    document.addEventListener('selectionchange', event => {
      const selection = window.getSelection()
      const target = (selection.anchorNode as any) as HTMLElement
      if (!target) {
        return
      }
      this.insertButton.target = target
      if (!this.activeRoot) {
        this.insertButton.isVisibleInsertButton = false
        return
      }
      try {
        const rect = (target as any).getBoundingClientRect()
        this.insertButton.posX =
          getEditorAreaOffset(
            window.innerWidth,
            (document.querySelector('#ALISEditor')! as HTMLElement).offsetWidth,
            rect.left
          ) - 50
        this.insertButton.posY = rect.top - 8
        this.insertButton.isVisibleInsertButton = !target.textContent && isContentEditableBlock(this.activeRoot)
      } catch (e) {
        // TextNode の場合は例外が発生するのでこっちで false に
        this.insertButton.isVisibleInsertButton = false
      }
    })
  },
  computed: {
    activeRoot(): Block | null {
      const id = findRootIdByBlockId(this.active || '', this.store.state.blocks)
      if (!id) return null
      return findTreeContentById(id, this.store.state.blocks) || null
    }
  },
  watch: {
    isPressedEnterInTitle: function() {
      this.appendNewBlockInitialPosition()
      this.insertInitialPositionTrigger = !this.insertInitialPositionTrigger
    }
  },
  methods: {
    registerScheduledSave(): void {
      if (this.intervalId) return
      this.intervalId = setInterval(() => {
        if (JSON.stringify(this.store.state.blocks) !== this.beforeBlockSnapshot) {
          this.$emit('update', this.store.state.blocks)
        }
        this.store.setIsSaving(JSON.stringify(this.store.state.blocks) !== this.beforeBlockSnapshot)
        this.beforeBlockSnapshot = JSON.stringify(this.store.state.blocks)
      }, 2000)
    },
    setActive(block: Block): void {
      this.active = block.id
    },
    removeActive(): void {
      requestAnimationFrame(() => {
        document.querySelector('body')!.click
        this.active = null
      })
    },
    addImageURI(id: string, src: string): void {
      this.appendNewBlock(id, {
        type: BlockType.Image,
        payload: { src },
        children: []
      })
    },
    handleKeydown(id: string, event: KeyboardEvent): void {
      if (isMobile()) {
        if (event.keyCode === 13) {
          const childId = findRootIdByBlockId(id, this.store.state.blocks)
          if (!childId) {
            return
          }
          const nowContent = findTreeContentById(childId, this.store.state.blocks)
          if (!nowContent || (nowContent && !isContentEditableBlock(nowContent))) {
            event.preventDefault()
          }
          return
        }
      }
      if (event.keyCode !== 13) {
        this.isPressedEnter = false
      }
    },
    handleKeydownEnter(id: string, event: KeyboardEvent): void {
      const childId = findRootIdByBlockId(id, this.store.state.blocks)
      if (!childId) return
      const nowContent = findTreeContentById(childId, this.store.state.blocks)
      if (!nowContent) return

      if (isDesktop()) {
        // this.desktopKeyDownEnter({ id, event, childId, nowContent })
      }
      if (isMobile()) {
        this.mobileKeyDownEnter({ id, event, childId, nowContent })
      }
    },
    desktopKeyDownEnter({ id, event, childId, nowContent }: DeviceKeyDownEventArgument) {
      if (event.shiftKey) {
        return
      }
      if (nowContent.type === BlockType.Image) {
        return
      }
      event.preventDefault()
      requestAnimationFrame(() => {
        const b = this.appendNewBlock(nowContent.id, createBlock(BlockType.Paragraph))
        if (!b) {
          return
        }
        requestAnimationFrame(() => {
          this.active = b.id
          browserSelection.selectContentEditableFirstCharFromBlock(b)
          const isLink = isContentEditableBlock(nowContent) && regex.isValidEmbedString(nowContent.payload.body)
          if (!isLink) return
          this.updateBlock({
            id: nowContent.id,
            type: BlockType.Embed,
            payload: {
              src: sanitizer.sanitizeAllTags(nowContent.payload.body)
            }
          })
        })
      })
    },
    mobileKeyDownEnter({ id, event, childId, nowContent }: DeviceKeyDownEventArgument) {
      if (isContentEditableBlock(nowContent)) {
        if (!this.isPressedEnter) {
          this.isPressedEnter = true
          return
        }
        this.isPressedEnter = false
        requestAnimationFrame(() => {
          this.mobileDoubleEnterGesture(nowContent, event)
        })
        return
      }
      requestAnimationFrame(() => {
        this.mobileSingleEnterGesture(nowContent, event)
      })
      this.isPressedEnter = false
    },
    mobileSingleEnterGesture(content: Block, event: KeyboardEvent) {
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
    mobileDoubleEnterGesture(content: Block, event: KeyboardEvent) {
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
      if (regex.isValidEmbedString(rawText)) {
        nowBlock.type = BlockType.Embed
        nowBlock.payload = {
          src: rawText
        }
      }

      this.updateBlock(nowBlock)
      document.querySelector(':focus')!.innerHTML = `${nowElement.innerHTML}`
      const newId = uuid()
      const rawNewText = newElement.innerHTML
      if (regex.isValidEmbedString(rawNewText)) {
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
        const block = this.appendNewBlock(id, {
          type: BlockType.Image,
          payload: { src },
          children: []
        }) as any
        this.appendNewBlock(block.id, {
          type: BlockType.Paragraph,
          payload: {
            body: ''
          }
        })
      })()
    },
    deleteBlock(content: Block) {
      const beforeContent = findBeforeRootContentByRootBlockId(content.id, this.store.state.blocks)
      if (beforeContent) {
        this.active = beforeContent.id
      }
      this.store.deleteBlock(content)
      if (!beforeContent) {
        return
      }
      if ([BlockType.Rule, BlockType.Embed].includes(beforeContent.type)) {
        this.deleteBlock(beforeContent)
      } else if (isContentEditableBlock(beforeContent)) {
        this.store.optimizeTree([...this.store.state.blocks])
        requestAnimationFrame(() => {
          browserSelection.selectContentEditableLastCharFromBlock(beforeContent)
        })
      }
    },
    updateBlock(content: Block) {
      this.store.updateBlock(content)
    },
    appendNewBlock(id: string, extend: { type: BlockType; payload?: any; children?: Block[] }) {
      if (this.insertButton.target) {
        const parent = this.insertButton.target.parentElement
        if (!parent) {
          return
        }
        const [before, after] = splitBlockContentByOffset(parent, getChildrenOffset(this.insertButton.target))
        const aR = cloneDeep(this.activeRoot)
        if (!aR) {
          return
        }

        this.updateBlock(cloneDeep(Object.assign({}, aR, { type: BlockType.Blank, payload: { body: before } })))
        const { type } = extend
        delete extend.type
        const beforeContent = findTreeContentById(id, this.store.state.blocks)
        if (!id || !beforeContent) {
          console.error('Missing params "id" or "beforeContent"')
          return
        }
        const b = this.store.appendBlock(createBlock(type, extend), beforeContent)
        if (b) {
          this.store.appendBlock(createBlock(BlockType.Paragraph, { payload: { body: after } }), b)
        }
        requestAnimationFrame(() => {
          this.updateBlock(cloneDeep(Object.assign({}, aR, { type: aR.type, payload: { body: before } })))
        })
      } else {
        const { type } = extend
        delete extend.type
        const beforeContent = findTreeContentById(id, this.store.state.blocks)
        if (!id || !beforeContent) {
          console.error('Missing params "id" or "beforeContent"')
          return
        }
        return this.store.appendBlock(createBlock(type, extend), beforeContent)
      }
    },
    appendNewBlockInitialPosition() {
      return this.store.appendParagraphBlockInitialPosition(createBlock(BlockType.Paragraph, {}))
    },
    moveToNextBlock(id: string) {
      ;(async () => {
        const block = this.appendNewBlock(id, createBlock(BlockType.Paragraph)) as any
        await this.$nextTick()
        this.active = block.id
        browserSelection.selectContentEditableFirstCharFromBlock(block)
      })()
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
