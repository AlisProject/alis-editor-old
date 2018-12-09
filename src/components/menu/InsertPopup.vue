<template>
  <div>
    <div
      class="insert-popup"
      :class="{ 'is-active': isActive, 'is-link': isClickedLink }"
      :style="{
        left: `${this.position.left}px`,
        top: `${this.position.top}px`
      }"
    >
      <button
        class="insert-popup__item"
        :class="[isBold ? 'insert-popup__bold_selected' : 'insert-popup__bold']"
        v-if="!isClickedLink"
        @click="execBold(activeRoot)"
      ></button>
      <button
        class="insert-popup__item"
        :class="[isItalic ? 'insert-popup__italic_selected' : 'insert-popup__italic']"
        v-if="!isClickedLink"
        @click="execItalic(activeRoot)"
      ></button>
      <button
        class="insert-popup__item"
        :class="[isQuote ? 'insert-popup__quote_selected' : 'insert-popup__quote']"
        v-if="!isClickedLink"
        @click="execQuote(activeRoot)"
      ></button>
      <button
        class="insert-popup__item"
        :class="[isHeading ? 'insert-popup__heading_selected' : 'insert-popup__heading']"
        v-if="!isClickedLink"
        @click="execHeading(activeRoot)"
      ></button>
      <button
        class="insert-popup__item"
        :class="[isSubHeading ? 'insert-popup__subheading_selected' : 'insert-popup__subheading']"
        v-if="!isClickedLink"
        @click="execSubHeading(activeRoot)"
      ></button>
      <button
        class="insert-popup__item"
        :class="[isAnchor ? 'insert-popup__textlink_selected' : 'insert-popup__textlink']"
        v-if="!isClickedLink"
        @click="execLink"
      ></button>
      <input class="insert-link" type="text" v-if="isClickedLink" :value="value" @input="handleInput" />
      <button class="insert-popup__item handle-url" style="cursor: pointer; color: #232538;" v-if="isClickedLink" @click="setUrl">✓</button>
      <button class="insert-popup__item handle-url" style="cursor: pointer; color: #232538;" v-if="isClickedLink" @click="deletePopup">×</button>
      <!--
        <button class="insert-popup__item" @click="execSubHeading">
          <InsertPopupIcon :src="require('../../assets/icon-h3.svg.js')" />
        </button>
      -->
    </div>
    <div
      class="link-popup"
      :class="{ 'is-active': isPopupActive }"
      :style="{
        left: `${this.hoverPosition.left}px`,
        top: `${this.hoverPosition.top}px`,
        cursor: 'pointer'
      }"
      @click="openInsertLink"
    >
      {{ this.url }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import InsertPopupIcon from './InsertPopupIcon.vue'
import { BlockType } from '../../types/Blocks'
import * as SvgIcon from '../vector/SvgIcon'
import { isContentEditableBlock } from '../../utils/createBlock'
import * as commandExecuter from '../../utils/commandExecuter'
import { getEndNodeByElement } from '../../utils/browserSelection'
import { findTreeContentById } from '../../utils/treeUtil'

export default Vue.extend({
  props: {
    activeRoot: Object,
    popUpPosition: Object,
    hoverPopupPosition: Object,
    isHover: Boolean,
    linked_url: String,
    targetAnchorNode: Object,
    store: Object
  },
  data(): any {
    return {
      isOpen: false,
      isActive: false,
      el: null,
      position: {
        left: 0,
        top: 0
      },
      hoverPosition: {
        left: 0.0,
        top: 0.0
      },
      isLink: false,
      isClickedLink: false,
      value: '',
      range: null,
      isPopupActive: this.isHover as boolean,
      url: this.linked_url as string,
      targetAnchor: null,
      isBold: false,
      isAnchor: false,
      isItalic: false,
      isQuote: false,
      isSubHeading: false,
      isHeading: false
    }
  },
  components: {
    InsertPopupIcon
  },
  computed: {
    SvgIcon() {
      return SvgIcon
    }
  },
  mounted() {
    document.addEventListener('mousedown', (event: any) => {
      if (this.$el.contains(event.target)) {
        return
      }
      this.isActive = false
      this.isClickedLink = false
      this.value = ''
    })
    document.addEventListener('selectionchange', this.onSelectionChange)
  },
  beforeDestroy() {
    document.removeEventListener('selectionchange', this.onSelectionChange)
  },
  watch: {
    activeRoot(aR) {
      this.el = document.querySelector(`[data-block-id="${aR.id}"]`)
      this.position.left = (document.querySelector('#ALISEditor') as any).offsetWidth * 0.5 - 110
      this.position.top = this.el.getBoundingClientRect().top - 50 + window.pageYOffset
      if (isContentEditableBlock(aR)) {
        this.isActive = false
      } else if (!['Image', 'Embed', 'Rule'].includes(aR.type)) {
        this.isActive = true
      }
    },
    'popUpPosition.left'() {
      this.position.left = this.popUpPosition.left
    },
    'popUpPosition.top'() {
      this.position.top = this.popUpPosition.top
    },
    'hoverPopupPosition.left'() {
      this.hoverPosition.left = this.hoverPopupPosition.left
    },
    'hoverPopupPosition.top'() {
      this.hoverPosition.top = this.hoverPopupPosition.top
    },
    isHover() {
      this.isPopupActive = this.isHover
    },
    linked_url() {
      this.url = this.linked_url
    },
    targetAnchorNode() {
      this.targetAnchor = this.targetAnchorNode
    }
  },
  methods: {
    handleInput(event: Event) {
      this.isActive = true
      this.value = (event.target as any).value
      if (this.targetAnchor !== null) {
        this.targetAnchor.href = this.value

      }
    },
    onSelectionChange(event: Event) {
      if (!this.activeRoot) {
        return
      }
      if (!isContentEditableBlock(this.activeRoot)) {
        return
      }
      const selection = window.getSelection()
      if (selection.isCollapsed && this.isClickedLink === false) {
        this.isActive = false
        return
      }
      // ポップアップの状態を初期化し、現在セレクションを始めたノードが何のタグに囲まれているノードかを判定する
      ;(async () => {
        await this.initiatePopupState()
        this.popupStateChange(selection.anchorNode)
      })()

      // Coordinate calculation of popup display
      const alisEditor = document.getElementById('ALISEditor')
      const alisEditorRect = (alisEditor as any).getBoundingClientRect()
      const range = selection.getRangeAt(0).cloneRange()
      if ((range as any).getClientRects().length !== 0) {
        const rect = (range as any).getClientRects()[0]
        const absoluteRectLeft = (rect.left + rect.right) / 2 - alisEditorRect.left - 105
        this.position.left = absoluteRectLeft
        const absoluteRectTop = rect.top - alisEditorRect.top - 75
        this.position.top = absoluteRectTop
      }

      this.isActive = true
    },
    ...commandExecuter,
    execLink() {
      if (this.isAnchor) {
        return document.execCommand('unlink')
      }
      this.isClickedLink = true
      const selection = window.getSelection()
      this.range = selection.getRangeAt(0)
      this.position.left = this.position.left - 125
    },
    setUrl() {
      ;(async () => {
        const selection = window.getSelection()
        selection.removeAllRanges()
        if (this.range !== null) {
          selection.addRange(this.range)
          document.execCommand('unlink')
          document.execCommand('createLink', true, this.value)
          await this.$nextTick()
          const aEl = selection.focusNode.parentElement as any
          aEl.addEventListener('mouseover', this.hoverEvent)
          aEl.addEventListener('mouseleave', this.deleteHover)
        }
        this.value = ''
        this.isActive = false
        this.isClickedLink = false
        this.targetAnchor = null
        this.$emit('deleteTargetAnchorNode')
        this.$emit('update', findTreeContentById(this.activeRoot.id, this.store.state.blocks))
        this.range = null
        selection.removeAllRanges()
      })()
    },
    deletePopup() {
      this.value = ''
      this.isActive = false
      this.isClickedLink = false
      this.range = null
      this.targetAnchor = null
      this.$emit('deleteTargetAnchorNode')
    },
    hoverEvent(event: any) {
      this.isPopupActive = true
      this.targetAnchor = event.target
      this.url = event.target.href
      // elementの座標を取得し、windowの絶対座標をマウスオーバー時に出現するポップアップの座標としてセットする
      const rect = event.srcElement.getBoundingClientRect()
      const alisEditor = document.getElementById('ALISEditor')
      const alisEditorRect = (alisEditor as any).getBoundingClientRect()
      const absoluteUnderPopupRectLeft = rect.left + rect.width / 2 - alisEditorRect.left - 175
      const absoluteUnderPopupRectTop = rect.top - alisEditorRect.top + 30
      this.hoverPosition.left = absoluteUnderPopupRectLeft
      this.hoverPosition.top = absoluteUnderPopupRectTop
    },
    openInsertLink(event: any) {
      const rect = event.srcElement.getBoundingClientRect()
      const alisEditor = document.getElementById('ALISEditor')
      const alisEditorRect = (alisEditor as any).getBoundingClientRect()
      const absoluteUpperPopupRectLeft = rect.left + rect.width / 2 - alisEditorRect.left - 265
      const absoluteUpperPopupRectTop = rect.top - alisEditorRect.top - 90
      this.position.left = absoluteUpperPopupRectLeft
      this.position.top = absoluteUpperPopupRectTop
      this.isPopupActive = false
      this.isClickedLink = true
      this.isActive = true
      this.value = this.url
    },
    deleteHover() {
      setTimeout(() => {
        this.isPopupActive = false
      }, 1000)
    },
    popupStateChange(targetNode: any) {
      const requireRecursivenodeNames = ['#text', 'A', 'H2', 'H3', 'I', 'B']
      const processTerminateNodes = ['BLOCKQUOTE', 'P']
      if (requireRecursivenodeNames.includes(targetNode.nodeName)) {
        const nodeName = targetNode.nodeName
        switch (nodeName) {
          case 'A':
            this.isAnchor = true
            break
          case 'H2':
            this.isHeading = true
            break
          case 'H3':
            this.isSubHeading = true
            break
          case 'I':
            this.isItalic = true
            break
          case 'B':
            this.isBold = true
            break
        }
        const parentNode = targetNode.parentNode
        return (this as any).popupStateChange(parentNode)
      } else if (processTerminateNodes.includes(targetNode.nodeName)) {
        if (targetNode.nodeName === 'BLOCKQUOTE') {
          this.isQuote = true
        }
        return
      }
    },
    initiatePopupState() {
      this.isBold = false
      this.isAnchor =  false
      this.isItalic = false
      this.isQuote = false
      this.isSubHeading = false
      this.isHeading = false
    }
  }
})
</script>

<style scoped>
.insert-popup {
  margin: 0;
  padding: 0;
  color: #fff;
  display: flex;
  list-style-type: none;
  font-size: 1.4rem;
  background-color: #fff;
  width: 300px;
  position: absolute;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  border-radius: 5px;
  box-shadow: 0 0 10px gray;
}

.insert-popup.is-active {
  pointer-events: initial;
  animation: anim1 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.insert-popup.is-active.is-link {
  pointer-events: initial;
  animation: anim1 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  width: 500px;
}

.link-popup {
  margin: 0;
  padding: 10px;
  color: #fff;
  text-align: center;
  display: flex;
  list-style-type: none;
  font-size: 1.4rem;
  background: #232538;
  width: 300px;
  border-radius: 5px;
  position: absolute;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  word-break: break-all;
}

.link-popup.is-active {
  pointer-events: initial;
  animation: anim1 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

@keyframes anim1 {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}

/*.insert-popup::after {*/
/*position: absolute;*/
/*left: calc(50% - 10px);*/
/*bottom: -10px;*/
/*width: 20px;*/
/*height: 20px;*/
/*background: #41446a;*/
/*transform: rotate(45deg);*/
/*content: '';*/
/*display: block;*/
/*}*/

.insert-popup .insert-popup__item {
  /*margin-left: 8px;*/
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  padding-left: 1px;
  padding-bottom: 1px;
  transition: all 0.05s linear;
  transform: rotate(0deg);
  font-size: 25px;
  font-weight: normal;
  font-family: 'Yu Gothic', YuGothic;
  appearance: none;
  -webkit-appearance: none;
  border: none;
  outline: none;
  cursor: pointer;
}

.insert-popup__bold {
  background: #fff url('../../../assets/images/pc/editor/icon_bold.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  border-radius: 5px 0px 0px 5px;
}

.insert-popup__bold_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_bold_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  border-radius: 5px;
  border-radius: 5px 0px 0px 5px;
}

.insert-popup__italic {
  background: #fff url('../../../assets/images/pc/editor/icon_italic.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__italic_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_italic_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__quote {
  background: #fff url('../../../assets/images/pc/editor/icon_quote.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__quote_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_quote_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__heading {
  background: #fff url('../../../assets/images/pc/editor/icon_index.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  cursor: pointer;
}

.insert-popup__heading_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_index_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  cursor: pointer;
}

.insert-popup__subheading {
  background: #fff url('../../../assets/images/pc/editor/icon_text.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__subheading_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_text_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
}

.insert-popup__textlink {
  background: #fff url('../../../assets/images/pc/editor/icon_textlink.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  border-radius: 0px 5px 5px 0px;
}

.insert-popup__textlink_selected {
  background: #232538 url('../../../assets/images/pc/editor/icon_textlink_selected.png') no-repeat;
  background-size: 32px;
  background-position: 8px 10px;
  border-radius: 0px 5px 5px 0px;
}

.insert-popup .insert-link {
  margin-left: 8px;
  border-radius: 5px;
  width: 400px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #232538;
  font-weight: bold;
  padding-left: 1px;
  padding-bottom: 1px;
  transition: all 0.05s linear;
  transform: rotate(0deg);
  font-size: 18px;
  font-weight: normal;
  font-family: 'Yu Gothic', YuGothic;
  appearance: none;
  -webkit-appearance: none;
  background: transparent;
  border: none;
  outline: none;
}

input {
  display: none;
}
</style>
