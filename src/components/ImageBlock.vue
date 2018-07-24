<template>
  <div
    class="image"
    :class="{
      'is-uploading': isUploading,
      'is-focus': isFocus
    }"
  >
    <img :src="block.payload.src">
    <textarea @focus="handleFocus" @keydown="handleKeydown" @blur="handleBlur" />
    <div class="image-uploading" v-if="isUploading">Uploading...</div>
    <div class="image-delete" v-if="!isUploading" @click="handleDelete">&times;</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { ImageBlock } from '../types/Blocks'
import { createBlogImageFromDataURI } from '../utils/createImage'

axios.defaults.headers.authorization = 'Client-ID ' + process.env.IMGUR_KEY

export default Vue.extend({
  props: {
    block: Object
  },
  data() {
    return {
      isFocus: false
    }
  },
  computed: {
    typedBlock(): ImageBlock {
      return this.block
    },
    isUploading() {
      return (this as any).typedBlock.payload.src.startsWith('data')
    }
  },
  async mounted() {
    const { src } = this.typedBlock.payload
    if (src.startsWith('data')) {
      const params = new FormData()
      params.append('image', createBlogImageFromDataURI(src))
      const { data } = await axios.post('https://api.imgur.com/3/image', params)
      const { typedBlock: block } = this
      block.payload.src = data.data.link
      this.$emit('update', block)
    }
  },
  methods: {
    handleFocus() {
      this.isFocus = true
    },
    handleBlur() {
      this.isFocus = false
    },
    handleKeydown(event: KeyboardEvent) {
      if (event.keyCode === 8) {
        this.handleDelete()
      }
    },
    handleDelete() {
      this.$emit('delete', this.typedBlock)
    }
  }
})
</script>

<style scoped>
.image {
  position: relative;
  border: solid 2px transparent;
  line-height: 0;
}

.image:hover,
.image.is-focus {
  border-color: #000;
}

.image.is-uploading {
  background: #000;
}

.image .image-uploading {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 10000000;
}

img {
  max-width: 100%;
  pointer-events: none;
}

textarea {
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
  border: 0;
  padding: 0;
  margin: 0;
}

img[src^='data:'] {
  opacity: 0.4;
}

.image-delete {
  display: none;
}

.image:hover .image-delete,
.image.is-focus .image-delete {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 40px;
  height: 40px;
  border: solid 2px #000;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
}
</style>
