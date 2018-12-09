<template lang="html">
  <div id="ALISEditor">
    <InsertPopup
      @deleteTargetAnchorNode="handleDeleteTargetAnchorNode"
      @update="updateBlock"
      :activeRoot="activeRoot"
      :popUpPosition="popUpPosition"
      :hoverPopupPosition="hoverPopupPosition"
      :isHover="isHover"
      :linked_url="linked_url"
      :targetAnchorNode="targetAnchorNode"
      :store="store"
    />
    <template v-if="store.state.isInitialized">
      <!--<EditorToolbar-->
        <!--v-if="!config.preview"-->
        <!--@append="appendNewBlock(active, { type: $event })"-->
        <!--@upload="insertImageBlock(active, $event)"-->
        <!--:activeRoot="activeRoot || {}"-->
        <!--:isSaving="store.state.isSaving">-->
      <!--</EditorToolbar>-->
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
          @addEvent="addEventAnchor"
          :config="config"
          :block="block"
          :active="activeRoot && activeRoot.id === block.id"
          :store="store"
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
  popUpPosition: {
    left: any
    top: any
  }
  hoverPopupPosition: {
    left: any
    top: any
  }
  isHover: boolean
  linked_url: string
  targetAnchorNode: HTMLElement | null
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
      insertInitialPositionTrigger: this.isPressedEnterInTitle,
      popUpPosition: {
        left: 0.0,
        top: 0.0
      },
      hoverPopupPosition: {
        left: 0.0,
        top: 0.0
      },
      isHover: false,
      linked_url: '',
      targetAnchorNode: null
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
    this.addEventAnchor()
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
      if (this.store.state.blocks[0].type === "Paragraph") {
        this.insertInitialPositionTrigger = !this.insertInitialPositionTrigger
        browserSelection.selectContentEditableFirstCharFromBlock(this.store.state.blocks[0])
      } else {
        this.appendNewBlockInitialPosition()
        this.insertInitialPositionTrigger = !this.insertInitialPositionTrigger
      }
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
      console.log(nowContent)
      if (!nowContent) return

      if (isDesktop()) {
        if (event.shiftKey) {
          return
        }
        if (nowContent.type === BlockType.Image) {
          return
        }
        // Enterを押した際に<div><br></div>の改行が生まれることを防ぐ処理
        ;(async () => {
          const p = document.createElement('p')
          const br = document.createElement('br')
          p.appendChild(br)
          const selection = window.getSelection() as any
          await this.$nextTick()

          // Blockquote内のセレクションの位置を見て最終文字の位置にキャレットが存在する場合はBlockquoteから抜ける処理
          // ContentEditableがh2, h3タグの行末でEnterを入力すると<div><br></div>を生成してしまう仕様なのでそれに対応する処理
          // blockquote内の最後のノードがdivの場合と途中のノードがdivの場合での場合分け
          if (!!this.isDeterminedInBlockquote(selection.anchorNode)) {
            const el = this.isDeterminedInBlockquote(selection.anchorNode)
            const range = document.createRange()
            const sel = window.getSelection()
            el.childNodes.forEach((targetEl: any) => {
              // Blockquote内最後にdivが発生する場合の回避処理
              if (targetEl.nodeName === 'DIV' && targetEl.nextSibling === null) {
                ;(async () => {
                  el.parentNode.insertBefore(p, el.nextSibling)
                  el.removeChild(el.lastChild)
                  await this.$nextTick()
                  range.setStart(el.nextSibling, 0)
                  range.collapse(true)
                  sel.removeAllRanges()
                  sel.addRange(range)
                })()
              // Blockquote内の途中でdivが発生した際の回避処理
              } else if (targetEl.nodeName === 'DIV' && targetEl.nextSibling !== null) {
                console.log(targetEl)
                ;(async () => {
                  targetEl.parentNode.insertBefore(targetEl.firstChild, targetEl)
                  const br = targetEl.previousSibling
                  targetEl.parentNode.removeChild(targetEl)
                  await this.$nextTick()
                  range.setStart(br, 0)
                  range.collapse(true)
                  sel.removeAllRanges()
                  sel.addRange(range)
                })()
              }
            })
            if (el.textContent === '') {
              el.parentNode.insertBefore(p, el.nextSibling)
              el.parentNode.removeChild(el)
            }
          }

          // h2, h3タグの最後尾でEnterを押した時に挿入されるdivタグをpタグに変更する処理
          const nodeList = (document as any).querySelector(`[data-block-id="${(this as any).activeRoot.id}"] .target`)
            .childNodes
          for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].nodeName === 'DIV') {
              await nodeList[i].parentNode.insertBefore(p, nodeList[i].nextSibling)
              nodeList[i].parentNode.removeChild(nodeList[i])
            }
          }
        })()
        // this.desktopKeyDownEnter({ id, event, childId, nowContent })
      }
      if (isMobile()) {
        this.mobileKeyDownEnter({ id, event, childId, nowContent })
      }
    },
    isDeterminedInBlockquote(targetNode: any) {
      const requireRecursivenodeNames = ['#text', 'A', 'H2', 'H3', 'I', 'B', 'DIV']
      const processTerminateNodes = ['BLOCKQUOTE', 'P']
      if (requireRecursivenodeNames.includes(targetNode.nodeName)) {
        const parentNode = targetNode.parentNode
        return (this as any).isDeterminedInBlockquote(parentNode)
      } else if (processTerminateNodes.includes(targetNode.nodeName)) {
        if (targetNode.nodeName === 'BLOCKQUOTE') {
          if (targetNode.nextSibling === null || targetNode.nextSibling.nodeName !== 'BLOCKQUOTE') {
            return targetNode
          }
          return false
        }
        return false
      }
    },
    isLastCharInBlockquote() {},
    desktopKeyDownEnter({ id, event, childId, nowContent }: DeviceKeyDownEventArgument) {
      if (event.shiftKey) {
        return
      }
      if (nowContent.type === BlockType.Image) {
        return
      }
      event.preventDefault()
      // requestAnimationFrame(() => {
      //   const b = this.appendNewBlock(nowContent.id, createBlock(BlockType.Paragraph))
      //   if (!b) {
      //     return
      //   }
      //   requestAnimationFrame(() => {
      //     this.active = b.id
      //     browserSelection.selectContentEditableFirstCharFromBlock(b)
      //     const isLink = isContentEditableBlock(nowContent) && regex.isValidEmbedString(nowContent.payload.body)
      //     if (!isLink) return
      //     this.updateBlock({
      //       id: nowContent.id,
      //       type: BlockType.Embed,
      //       payload: {
      //         src: sanitizer.sanitizeAllTags(nowContent.payload.body)
      //       }
      //     })
      //   })
      // })
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
      const blocks = this.store.state.blocks
      blocks.forEach((block, index) => {
        if (block.id === id) {
          if (blocks[index + 1] !== undefined && blocks[index + 1].type === 'Paragraph') {
            this.active = blocks[index + 1].id
            browserSelection.selectContentEditableFirstCharFromBlock(blocks[index + 1])
          }
          if (blocks[index + 1] === undefined || (blocks[index + 1] !== undefined && blocks[index + 1].type !== 'Paragraph')) {
            console.log(block.id)
            const newBlock = this.store.appendBlock(createBlock(BlockType.Paragraph), block) as Block
            requestAnimationFrame(() => {
              this.active = newBlock.id
              browserSelection.selectContentEditableFirstCharFromBlock(newBlock)
            })
          }
        }
      })
    },
    addEventAnchor() {
      const targetNodeList = document.querySelectorAll('.target')
      for (let i = 0; i < targetNodeList.length; i++) {
        const elements = targetNodeList[i].getElementsByTagName('a') as any
        if (elements.length !== 0) {
          const aCollectionArr = Object.keys(elements).map(function(key) {
            return elements[key]
          })
          if (aCollectionArr.length !== 0) {
            for (let n = 0; n < aCollectionArr.length; n++) {
              aCollectionArr[n].addEventListener('mouseover', this.addHoverEvent)
              aCollectionArr[n].addEventListener('mouseleave', this.deleteHover)
            }
          }
        }
      }
    },
    addHoverEvent(event: any) {
      this.isHover = true
      this.linked_url = event.target.href
      this.targetAnchorNode = event.target
      // elementの座標を取得し、windowの絶対座標をマウスオーバー時に出現するポップアップの座標としてセットする
      const rect = event.srcElement.getBoundingClientRect()
      const alisEditor = document.getElementById('ALISEditor')
      const alisEditorRect = (alisEditor as any).getBoundingClientRect()
      const absoluteUnderPopupRectLeft = rect.left + rect.width / 2 - alisEditorRect.left - 105
      const absoluteUnderPopupRectTop = rect.top - alisEditorRect.top + 30
      const absoluteUpperPopupRectLeft = rect.left + rect.width / 2 - alisEditorRect.left - 225
      const absoluteUpperPopupRectTop = rect.top - alisEditorRect.top - 110
      this.hoverPopupPosition.left = absoluteUnderPopupRectLeft
      this.hoverPopupPosition.top = absoluteUnderPopupRectTop
      this.popUpPosition.left = absoluteUpperPopupRectLeft
      this.popUpPosition.top = absoluteUpperPopupRectTop
    },
    deleteHover() {
      setTimeout(() => {
        this.isHover = false
      }, 1000)
    },
    handleDeleteTargetAnchorNode() {
      this.targetAnchorNode = null
    }
    // handleClick(event: any) {
    //   const blocks = this.store.state.blocks
    // }
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
