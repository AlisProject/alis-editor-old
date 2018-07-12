<template lang="html">
  <div id="ALISEditor" @keydown.enter="handleKeydown">
    <div>
      <EditorBlock
        @update="updateBlock(i, $event)"
        @delete="deleteBlcok(i)"
        :block="block"
        v-for="(block, i) in blocks"
        :key="block.id"
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

interface EditorState {
  blocks: Block[]
}

export default Vue.extend({
  data():EditorState {
    return {
      blocks: [
        {
          id: uuid(),
          type: 'Paragraph',
          children: [
            {
              id: uuid(),
              type: 'Text',
              payload: {
                body: 'Hello, world'
              },
              children: []
            }
          ]
        }
      ]
    }
  },
  components: {
    EditorBlock
  },
  methods: {
    handleKeydown(event: KeyboardEvent) {
      // onEnter
      if (event.keyCode === 13) {
        if(event.shiftKey) {
          return
        } else {
          event.preventDefault()
          this.createNewBlock('Paragraph', [])
        }
      }
      console.log('1')
    },
    deleteBlock(idx: number) {
      const { blocks } = this
      blocks.splice(idx, 1)
      this.blocks = blocks
    },
    updateBlock(idx: number, content: Block) {
      const { blocks } = this
      blocks[idx] = content
      this.blocks = blocks
    },
    createNewBlock(type: string, children: Block[]) {
      const { blocks } = this
      blocks.push({
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
