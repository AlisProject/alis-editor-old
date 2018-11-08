<template>
  <div id="app">
    <div>
      <button type="button" @click="switchPreview(false)">Editorモード</button>
      <button type="button" @click="switchPreview(true)">Viewerモード</button>
      <AlisEditor
        :config="{
          articleId: '12345',
          preview,
          iframelyApikey,
          axiosConfig: {
            headers: {
              authorization: imgurApiKey
            }
          }
        }"
        @export="handleExport"
        :initialState="initalState"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AlisEditor from './EditorWrapper'
import { isMobile } from './utils/deviceUtil'
import initalState from '../tests/mock/initialState'

export default Vue.extend({
  components: {
    AlisEditor
  },
  data() {
    return {
      initalState,
      preview: false,
      iframelyApikey: process.env.VUE_APP_IFRAMELY_API_KEY,
      imgurApiKey: `Client-ID ${process.env.VUE_APP_IMGUR_KEY}`
    }
  },
  methods: {
    switchPreview(preview: boolean) {
      this.preview = preview
    },
    handleExport(tree: any) {
      if (isMobile()) {
        alert(
          JSON.stringify(tree, null, '  ')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        )
      }
      document.querySelector('#log pre')!.innerHTML = JSON.stringify(tree, null, '  ')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }
})
</script>
