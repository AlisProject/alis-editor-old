<template>
  <div>
    <div
      class="insert-popup"
      v-if="activeRoot"
      :class="{ 'is-active': isActive }"
      :style="{
        left: `${this.position.left}px`,
        top: `${this.position.top}px`
      }"
    >
      <button class="insert-popup__item" @click="execBold(activeRoot)"><InsertPopupIcon :src="SvgIcon.bold" /></button>
      <button class="insert-popup__item" @click="execItalic(activeRoot)">
        <InsertPopupIcon :src="SvgIcon.italic" />
      </button>
      <button class="insert-popup__item" @click="execQuote(activeRoot)">
        <InsertPopupIcon :src="SvgIcon.quote" />
      </button>
      <button class="insert-popup__item" @click="execHeading(activeRoot)"><InsertPopupIcon :src="SvgIcon.h2" /></button>
      <button class="insert-popup__item" @click="execSubHeading(activeRoot)">
        <InsertPopupIcon :src="SvgIcon.h3" />
      </button>
      <button class="insert-popup__item" @click="execLink(activeRoot)"><InsertPopupIcon :src="SvgIcon.link" /></button>
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

export default Vue.extend({
  props: {
    activeRoot: Object
  },
  data(): any {
    return {
      isOpen: false,
      isActive: false,
      el: null,
      position: {
        left: 0.0,
        top: 0.0
      }
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
    }
  },
  methods: {
    onSelectionChange(event: Event) {
      if (!this.activeRoot) {
        return
      }
      if (!isContentEditableBlock(this.activeRoot)) {
        return
      }
      const selection = window.getSelection()
      if (selection.isCollapsed) {
        this.isActive = false
        return
      }
      this.isActive = true
    },
    ...commandExecuter
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
  background: #41446a;
  width: 220px;
  position: absolute;
  z-index: 200;
  opacity: 0;
  pointer-events: none;
}

.insert-popup.is-active {
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

.insert-popup::after {
  position: absolute;
  left: calc(50% - 10px);
  bottom: -10px;
  width: 20px;
  height: 20px;
  background: #41446a;
  transform: rotate(45deg);
  content: '';
  display: block;
}

.insert-popup .insert-popup__item {
  margin-left: 8px;
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
  background: transparent;
  border: none;
  outline: none;
}

input {
  display: none;
}
</style>
