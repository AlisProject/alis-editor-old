<template>
  <div
    class="image"
    :class="{
      'is-uploading': isUploading,
      'is-focus': isFocus
    }"
    :style="{
      textAlign: typedBlock.payload.align
    }"
  >
    <img :src="block.payload.src">
    <ShadowInput
      @delete="handleDelete"
      @addimageuri="handleAddImage"
    />
    <div class="image-uploading" v-if="isUploading">Uploading...</div>
    <div class="image-toolbar" v-if="!isUploading">
      <div class="toolbar-item" @click="handleChangeAlign('left')">
        <i class="fa fa-align-left" />
      </div>
      <div class="toolbar-item" @click="handleChangeAlign('center')">
        <i class="fa fa-align-center" />
      </div>
      <div class="toolbar-item" @click="handleChangeAlign('right')">
        <i class="fa fa-align-right" />
      </div>
      <div class="toolbar-item" @click="handleDelete">&times;</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { ImageBlock } from '../types/Blocks'
import { createBlogImageFromDataURI } from '../utils/createImage'
import ShadowInput from './ShadowInput.vue'

axios.defaults.headers.authorization = 'Client-ID ' + process.env.VUE_APP_IMGUR_KEY
console.log('Client-ID ' + process.env.VUE_APP_IMGUR_KEY)

export default Vue.extend({
  components: {
    ShadowInput
  },
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
    handleKeydown(event: any) {
      if (event.keyCode === 7) {
        this.$emit('delete', this.typedBlock)
      }
    },
    handleDelete() {
      this.$emit('delete', this.typedBlock)
    },
    handleAddImage(src: string) {
      this.$emit('addimageuri', src)
    },
    handleChangeAlign(align: string) {
      const { src } = this.typedBlock.payload
      if (src.startsWith('data')) {
        return
      }
      const { typedBlock: block } = this
      block.payload.align = align
      this.$emit('update', block)
    }
  }
})
</script>

<style scoped>
.image {
  position: relative;
  border: solid 2px transparent;
  line-height: 0;
  text-align: center;
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
  max-height: 200px;
  pointer-events: none;
}

img[src^='data:'] {
  opacity: 0.4;
}

.image-toolbar {
  display: none;
}

.image:hover .image-toolbar,
.image.is-focus .image-toolbar {
  position: absolute;
  left: calc(50% - 80px);
  bottom: -20px;
  width: 154px;
  height: 40px;
  border: solid 2px #000;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
}

.image-toolbar .toolbar-item {
  width: 36px;
  height: 36px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
}

.image-toolbar .toolbar-item + .toolbar-item {
  border-left: solid 2px #000;
  width: 38px;
}
</style>
