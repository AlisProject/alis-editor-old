<template>
  <div
    class="aliseditor--image"
    :class="{
      'is-uploading': isUploading,
      'is-focus': isFocus
    }"
    :style="{
      textAlign: block.payload.align
    }"
    v-if="!preview"
    @mouseover="handleHover"
  >
    <div style="display: inline-block;position: relative">
      <span class="image--wrapper">
        <img :src="block.payload.src" class="main-image" /><br />
        <ShadowInput @delete="handleDelete" @addimageuri="handleAddImage" />
        <input
          class="image--caption"
          :style="{
            opacity: `${+!isUploading}.0`
          }"
          placeholder="説明文を入力"
          :value="this.block.payload.caption"
          @input="handleInputCaption"
        />
      </span>
      <div class="image-uploading" v-if="isUploading">Uploading...</div>
      <div class="image-toolbar" v-if="!isUploading">
        <div
          class="toolbar-item"
          :class="{ 'is-active': this.block.payload.align === 'left' }"
          @click="handleChangeAlign('left')"
        >
          <AlignLeft />
        </div>
        <div
          class="toolbar-item"
          :class="{ 'is-active': this.block.payload.align === 'center' || !this.block.payload.align }"
          @click="handleChangeAlign('center')"
        >
          <AlignCenter />
        </div>
        <div
          class="toolbar-item"
          :class="{ 'is-active': this.block.payload.align === 'right' }"
          @click="handleChangeAlign('right')"
        >
          <AlignRight />
        </div>
      </div>
      <div
        class="delete-button"
        @click="handleDelete"
        :style="{
          left: deleteButtonPosition.left
        }"
      >
        &times;
      </div>
    </div>
  </div>
  <div
    class="aliseditor--image preview"
    :style="{
      textAlign: block.payload.align
    }"
    v-else
  >
    <div class="preview-content">
      <img :src="block.payload.src" /><br />
      <p class="caption">{{ block.payload.caption }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { ImageBlock } from '../../types/Blocks'
import { createBlogImageFromDataURI } from '../../utils/createImage'
import ShadowInput from '../utils/ShadowInput.vue'
import AlignLeft from '../vector/AlignLeft.vue'
import AlignCenter from '../vector/AlignCenter.vue'
import AlignRight from '../vector/AlignRight.vue'

export default Vue.extend({
  components: {
    ShadowInput,
    AlignLeft,
    AlignCenter,
    AlignRight
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
      isFocus: false,
      deleteButtonPosition: {
        left: ''
      }
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
      const config = Object.assign({ headers: {} }, this.axiosConfig)
      const params = new FormData()
      params.append('image', createBlogImageFromDataURI(src))
      const { data } = await axios.post('https://api.imgur.com/3/image', params, config)
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
    handleInputCaption(event: KeyboardEvent) {
      const caption = (event.target as HTMLInputElement).value
      const { block } = this
      block.payload.caption = caption
      this.$emit('update', block)
    },
    handleDelete() {
      this.$emit('delete', this.block)
    },
    handleAddImage(src: string) {
      this.$emit('addimageuri', src)
    },
    handleHover() {
      this.deleteButtonPosition.left = `calc(50% + ${this.$el.querySelector('img')!.width * 0.5 - 40}px)`
    },
    handleChangeAlign(align: string) {
      const { src } = this.block.payload
      if (src.startsWith('data')) {
        return
      }
      const { block } = this
      block.payload.align = align
      this.$emit('update', block)
    }
  }
})
</script>

<style scoped>
.aliseditor--image {
  position: relative;
  border: solid 2px transparent;
  line-height: 0;
  text-align: center;
  margin: 0 8px;
}

.aliseditor--image.preview {
  font-size: 12px;
}

.aliseditor--image.preview .preview-content {
  display: inline-block;
  text-align: center;
}

.aliseditor--image.preview .caption {
  margin-top: 16px;
}

.aliseditor--image .main-image {
  border: solid 2px transparent;
}

.aliseditor--image:not(.preview):hover .main-image,
.aliseditor--image.is-focus .main-image {
  border: solid 2px #000;
}

.aliseditor--image.is-uploading {
  background: #000;
}

.aliseditor--image .image-uploading {
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

.image--wrapper {
  display: inline-block;
  text-align: center;
}

.image--caption {
  z-index: 110;
  position: relative;
  margin-top: 10px;
  resize: none;
  outline: none;
  border: 0;
  font-size: 12px;
  width: 240px;
  text-align: center;
}

.aliseditor--image:hover .image-toolbar,
.aliseditor--image.is-focus .image-toolbar {
  position: absolute;
  left: calc(50% - 60px);
  bottom: 40px;
  width: 120px;
  height: 40px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100000000000000;
  filter: drop-shadow(0 3px 5px rgba(192, 192, 192, 0.5));
}

.image-toolbar .toolbar-item {
  width: 40px;
  height: 40px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
}

.image-toolbar .toolbar-item.is-active {
  background: #858dda;
}

.aliseditor--image:not(:hover) .delete-button,
.aliseditor--image.is-uploading .delete-button {
  display: none;
}

.delete-button {
  position: absolute;
  top: 10px;
  background: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  filter: drop-shadow(0 3px 5px rgba(192, 192, 192, 0.5));
  z-index: 120;
}
</style>
