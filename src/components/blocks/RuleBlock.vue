<template>
  <div class="rule" v-if="!preview">
    <hr />
    <ShadowInput @delete="handleDelete" @addimageuri="handleAddImage" />
  </div>
  <div class="rule" v-else><hr /></div>
</template>

<script lang="ts">
import Vue from 'vue'
import ShadowInput from '../blocks/ShadowInput.vue'

export default Vue.extend({
  components: {
    ShadowInput
  },
  props: {
    block: Object,
    preview: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleDelete() {
      this.$emit('delete', this.block)
    },
    handleAddImage(src: string) {
      this.$emit('addimageuri', src)
    }
  }
})
</script>

<style scoped>
.rule {
  position: relative;
  padding: 10px 0;
}

.rule hr {
  margin: 0;
  border: none;
  border-top: dotted 3px #e3e3e3;
  height: 2px;
}

.rule textarea {
  color: transparent;
  background: transparent;
  resize: none;
  opacity: 0;
  outline: none;
  display: block;
  position: absolute;
  z-index: 100000;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

@media (max-width: 768px) {
  .rule {
    margin: 0 8px;
  }
}
</style>
