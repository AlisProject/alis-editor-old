<template lang="html">
  <div id="ALISEditor">
    <template v-if="store.state.isInitialized">
      <EditorToolbar
        @append="appendNewBlock(active, { type: $event })"
        @upload="insertImageBlock(active, $event)"
        :activeRoot="activeRoot || {}"
        :isSaving="store.state.isSaving"
      />
      <div
        @keydown="handleKeydown"
        @keydown.enter="handleKeydownEnter(block.id, $event)"
        v-for="block in store.state.blocks"
        :key="block.id"
      >
        <EditorBlock
          @input="updateBlock"
          @update="updateBlock"
          @delete="deleteBlock"
          @append="appendNewBlock(block.id, {type: $event})"
          @upload="insertImageBlock(block.id, $event)"
          @active="setActive($event)"
          @addimageuri="addImageURI(block.id, $event)"
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
import { Block, BlockType, ParagraphBlock } from './types/Blocks'
import { createBlock } from './utils/createBlock'
import { createDataURIImage } from './utils/createImage'
import { isMobile } from './utils/deviceUtil'
import { findRootIdByBlockId, findTreeContentById } from './utils/applyTree'
import { EditorStore } from './store/'
import { cloneDeep } from 'lodash'

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
    if (!Vue.prototype.$editorStore) {
      Vue.prototype.$editorStore = new EditorStore({
        isSaving: false,
        blocks: []
      })
    }
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
  props: ['initialState'],
  components: {
    EditorBlock,
    EditorToolbar
  },
  mounted() {
    this.beforeBlockSnapshot = JSON.stringify(this.store.state.blocks)
    window.addEventListener('blur', () => {
      // this.active = null
    })

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
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
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode === 13) return
      this.isPressedEnter = false
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
      if (nowContent.type === 'Paragraph') {
        if (!this.isPressedEnter) {
          this.isPressedEnter = true
          return
        }
        requestAnimationFrame(() => {
          this.doubleEnterGesture(nowContent, event)
        })
      }
      requestAnimationFrame(() => {
        this.singleEnterGesture(nowContent, event)
      })
      this.isPressedEnter = false
    },
    singleEnterGesture(content: Block, event: KeyboardEvent) {
      const newId = uuid()
      this.appendNewBlock(content.id, {
        type: BlockType.Paragraph,
        payload: {
          body: '<p></p>'
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
      document.querySelector(':focus')!.childNodes.forEach((child, i) => {
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
        } else {
          nowElement.appendChild(child)
        }
      })
      const nowBlock = { ...content } as ParagraphBlock
      nowBlock.payload.body = `${nowElement.innerHTML}`
      this.updateBlock(nowBlock)
      document.querySelector(':focus')!.innerHTML = `${nowElement.innerHTML}`
      const newId = uuid()
      this.appendNewBlock(content.id, {
        type: BlockType.Paragraph,
        payload: {
          body: newElement.innerHTML
        }
      })
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
      this.store.appendBlock(createBlock(type, extend), beforeContent)
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
</style>
