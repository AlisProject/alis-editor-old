<template>
  <div>
    <div v-html="html"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { EmbedBlock } from '../../types/Blocks'
import ShadowInput from '../utils/ShadowInput.vue'
import { getIframelyUrlTemplate } from '../../utils/iframely'

export default Vue.extend({
  components: {
    ShadowInput
  },
  props: {
    block: Object as () => EmbedBlock
  },
  data() {
    return {
      isFocus: false,
      html: getIframelyUrlTemplate(this.block.payload.src)
    }
  },
  async mounted() {
    ;(window as any).iframely.load()
  },
  methods: {
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleDelete() {
      this.$emit('delete', this.block)
    }
  }
})
</script>

<style scoped>
</style>
