<template lang="html">
  <div id="ALISEditor">
    <div
      @keydown.enter="handleKeydown($event, i)"
      v-for="(block, i) in blocks"
      :key="block.id"
    >
      <EditorBlock
        @drop="insertImageBlock(i, $event)"
        @update="updateBlock(i, $event)"
        @delete="deleteBlock(i)"
        :block="block"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import uuid from "uuid/v4";
import EditorBlock from "./components/EditorBlock.vue";
import { Block, TextBlock } from "./types/Blocks";
import { cloneDeep } from "lodash";
import initalState from "../spec/mock/initialState";

interface EditorState {
  blocks: Block[];
  active: number;
}

export default Vue.extend({
  data(): EditorState {
    return {
      blocks: initalState,
      active: 0
    };
  },
  components: {
    EditorBlock
  },
  methods: {
    setActive(idx: number) {
      this.active = idx;
    },
    handleKeydown(event: KeyboardEvent, idx: number) {
      // onEnter
      if (event.keyCode === 13) {
        if (event.shiftKey) {
          return;
        } else {
          event.preventDefault();
          this.createNewBlock({
            idx,
            type: "Paragraph",
            payload: { body: '' },
            children: [
              {
                id: uuid(),
                type: "Text",
                payload: {
                  body: ""
                },
                children: []
              }
            ]
          });
          this.setFocus(idx + 1);
        }
      }
      console.log("1");
    },
    async setFocus(idx?: number) {
      await Vue.nextTick();
      const targets = this.$el.querySelectorAll("textarea");
      if (idx) {
        targets[idx].focus();
      } else {
        targets[targets.length - 1].focus();
      }
    },
    deleteBlock(idx: number) {
      const { blocks } = this;
      blocks.splice(idx, 1);
      this.blocks = blocks;
      this.setFocus(idx - 1);
    },
    updateBlock(idx: number, content: Block) {
      this.setActive(idx);
      const { blocks } = this;
      blocks[idx] = content;
      this.blocks = blocks;
    },
    insertImageBlock(idx:number, event: DragEvent) {
      const files = event.dataTransfer.files
      console.log(files)
      if (!files.length) {
        return
      }
      const target = files[0]
      const reader = new FileReader()
      reader.onload = (event: any) => {
        const { currentTarget: { result } } = event
        this.createNewBlock({
          idx,
          type: 'Image',
          payload: { src: result },
          children: []
        })
      }
      reader.readAsDataURL(target)
    },
    createNewBlock({ idx, type, children, payload }: { idx: number, type: string, payload?: any, children?: Block[] }) {
      const { blocks } = this;
      blocks.splice(idx + 1, 0, {
        id: uuid(),
        type,
        payload,
        children
      });
      this.blocks = blocks;
    }
  }
});
</script>

<style>
#ALISEditor {
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
}

input, textarea {
  font-size: 20px;
}
</style>
