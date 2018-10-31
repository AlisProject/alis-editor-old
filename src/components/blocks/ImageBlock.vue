<template>
  <div
    class="image"
    :class="{
      'is-uploading': isUploading,
      'is-focus': isFocus
    }"
    :style="{
      textAlign: block.payload.align
    }"
    v-if="!preview"
  >
    <img :src="block.payload.src">
    <ShadowInput
      @delete="handleDelete"
      @addimageuri="handleAddImage"
    />
    <div class="image-uploading" v-if="isUploading">Uploading...</div>
    <div class="image-toolbar" v-if="!isUploading">
      <div class="toolbar-item" @click="handleDelete">
        &times;
      </div>
    </div>
  </div>
  <div
    class="image preview"
    :style="{
      textAlign: block.payload.align
    }"
    v-else
  >
    <img :src="block.payload.src">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { ImageBlock } from '../../types/Blocks'
import { createBlogImageFromDataURI } from '../../utils/createImage'
import ShadowInput from '../utils/ShadowInput.vue'

export default Vue.extend({
  components: {
    ShadowInput
  },
  props: {
    block: Object as () => ImageBlock,
    preview: {
      default: false,
      type: Boolean
    },
    uploadEndpoint: {
      default: null,
      type: String
    },
    axiosConfig: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isFocus: false
    }
  },
  computed: {
    isUploading() {
      return (this as any).block.payload.src.startsWith('data')
    }
  },
  async mounted() {
    const { src } = this.block.payload
    if (!src.startsWith('data')) {
      return
    }
    if (this.uploadEndpoint) {
      const articleImageData = src.substring((src.match(',') as any).index + 1)
      const imageContentType = src.substring((src.match(':') as any).index + 1, (src.match(';') as any).index)
      const config = Object.assign({ headers: {} }, this.axiosConfig)
      config.headers['content-type'] = imageContentType
      console.log(this.uploadEndpoint)
      const { image_url } = (await axios.post(this.uploadEndpoint, { article_image: articleImageData }, config)).data
      const { block } = this
      block.payload.src = image_url
      this.$emit('update', block)
      return
    } else {
      console.warn('Image uploader is running at development mode.')
      const params = new FormData()
      params.append('image', createBlogImageFromDataURI(src))
      const { data } = await axios.post('https://api.imgur.com/3/image', params)
      const { block } = this
      block.payload.src = data.data.link
      this.$emit('update', block)
      return
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
        this.$emit('delete', this.block)
      }
    },
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
.image {
  position: relative;
  border: solid 2px transparent;
  line-height: 0;
  text-align: center;
  margin: 0 8px;
}

.image:hover,
.image.is-focus {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.14);
}

.image.preview:hover {
  box-shadow: none;
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
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
}

.image-toolbar .toolbar-item {
  width: 20px;
  height: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
  border-radius: 50%;
  overflow: hidden;
  border: solid 1px #000;
}
</style>
