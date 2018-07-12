<template>
  <p>
    <component
      :is="`${childBlock.type}Block`"
      :block="childBlock"
      v-for="(childBlock, i) in block.children"
      :key="childBlock.id"
      @input="handleInput(i, $event)"
      @delete="handleDelete(i)"
    />
  </p>
</template>

<script lang="ts">
import Vue from "vue";
import uuid from "uuid/v4";
import { Block, ParagraphBlock } from "../types/Blocks";
import TextBlock from "./TextBlock.vue";
import { cloneDeep } from "lodash";

export default Vue.extend({
  components: {
    TextBlock
  },
  props: {
    block: Object
  },
  computed: {
    typedBlock(): ParagraphBlock {
      return this.block;
    }
  },
  methods: {
    handleInput(idx: number, value: string) {
      const { typedBlock: block } = this;
      block.children[idx].payload.body = value;
      this.$emit("update", cloneDeep(block));
    },
    handleDelete(idx: number) {
      this.$emit("delete", event);
    }
  }
});
</script>
