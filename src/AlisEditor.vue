<template lang="html">
  <div id="ALISEditor">
    <div
      @keydown.enter="handleKeydown($event, i)"
      v-for="(block, i) in blocks"
      :key="block.id"
    >
      <EditorBlock
        @update="updateBlock(i, $event)"
        @delete="deleteBlock(i)"
        :block="block"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import uuid from 'uuid/v4'
import EditorBlock from './components/EditorBlock.vue'
import { Block, TextBlock } from './types/Blocks'
import { cloneDeep } from 'lodash'
import initalState from '../spec/mock/initialState'

interface EditorState {
  blocks: Block[]
  active: number
}

export default Vue.extend({
  data() : EditorState {
    return {
      blocks: initalState,
      active: 0
    }
  },
  components: {
    EditorBlock
  },
  methods: {
    setActive(idx: number) {
      this.active = idx
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      // onEnter
      if (event.keyCode === 13) {
        if(event.shiftKey) {
          alert(1)
          return
        } else {
          event.preventDefault()
          this.createNewBlock(
            idx,
            'Paragraph',
            [
              {
                id: uuid(),
                type: 'Text',
                payload: {
                  body: ''
                },
                children: []
              }
            ]
          )
          this.setFocus(idx + 1)
        }
      }
      console.log('1')
    },
    async setFocus(idx?: number) {
      await Vue.nextTick()
      const targets = this.$el.querySelectorAll('textarea')
      if (idx) {
        targets[idx].focus()
      } else {
        targets[targets.length-1].focus()
      }
    },
    deleteBlock(idx: number) {
      const { blocks } = this
      blocks.splice(idx, 1)
      this.blocks = blocks
      this.setFocus(idx-1)
    },
    updateBlock(idx: number, content: Block) {
      this.setActive(idx)
      const { blocks } = this
      blocks[idx] = content
      this.blocks = blocks
    },
    createNewBlock(idx: number, type: string, children: Block[]) {
      const { blocks } = this
      blocks.splice(idx + 1, 0, {
        id: uuid(),
        type,
        payload: {
          body: ''
        },
        children
      })
      this.blocks = blocks
    }
  }
})
</script>

<style>
#ALISEditor {
  -webkit-font-smoothing: antialiased;
}

#ALISEditor * {
  font-size: 20px;
}
</style>
