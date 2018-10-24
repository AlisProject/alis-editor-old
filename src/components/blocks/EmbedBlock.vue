<template>
  <div>
    <div v-html="html"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { EmbedBlock } from '../../types/Blocks'
import ShadowInput from '../utils/ShadowInput.vue'
import {
  isYouTubeVideoURL,
  isFacebookPostURL,
  isInstagramURL,
  getResourceFromIframely,
  getIframelyUrlTemplate,
  getTwitterProfileTemplate,
  getIframelyEmbedTemplate
} from '../../utils/iframely'

export default Vue.extend({
  components: {
    ShadowInput
  },
  props: {
    block: Object as () => EmbedBlock,
    iframelyApikey: String
  },
  data() {
    return {
      isFocus: false,
      html: ''
    }
  },
  async mounted() {
    this.html = await this.getEmbedContent(this.block.payload.src)
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
    },
    async getEmbedContent(alisIframelyUrl: string) {
      const isTwitterResource =
        alisIframelyUrl === 'https://twitter.com' ||
        alisIframelyUrl.startsWith('https://twitter.com/')
      const isTweet = isTwitterResource && alisIframelyUrl.split('/')[4] === 'status'
      const isGistResource = alisIframelyUrl.startsWith('https://gist.github.com/')
      const isYouTubeResource = isYouTubeVideoURL(alisIframelyUrl)
      const isFacebookResource = isFacebookPostURL(alisIframelyUrl)
      const isInstagramResource = isInstagramURL(alisIframelyUrl)
      let result

      try {
        result = (await getResourceFromIframely(
          {
            type: isTwitterResource ? 'oembed' : 'iframely',
            url: alisIframelyUrl,
            iframelyApikey: this.iframelyApikey
          }
        )).data
      } catch (error) {
        console.error(error)
        return ''
      }

      if (
        isTweet ||
        isGistResource ||
        isYouTubeResource ||
        isFacebookResource ||
        isInstagramResource
      ) {
        const anchorElement = document.createElement('a')
        anchorElement.setAttribute('href', alisIframelyUrl)
        anchorElement.setAttribute('data-iframely-url', '')

        const div = document.createElement('div')
        div.appendChild(anchorElement)

        return div.innerHTML
      }

      if (isTwitterResource) {
        const { title, description } = result
        const hasTitleOrDescription = title !== undefined || description !== undefined
        if (!hasTitleOrDescription) return ''

        return getTwitterProfileTemplate({ ...result })
      } else {
        const { title, description } = result.meta
        const hasTitleOrDescription = title !== undefined || description !== undefined
        if (!hasTitleOrDescription) return ''

        return getIframelyEmbedTemplate({ ...result })
      }
    }
  }
})
</script>

<style scoped>
</style>
