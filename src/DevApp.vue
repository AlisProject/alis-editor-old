<template>
  <div id="app">
    <div>
      <div style="text-align: center;">
        <img src="/sample-header.png" style="margin: 40px auto 0;">
      </div>
      <button type="button" @click="switchPreview(false)">
        Editorモード
      </button>
      <button type="button" @click="switchPreview(true)">
        Viewerモード
      </button>
      <AlisEditor
        :preview="preview"
        :iframelyApikey="iframelyApikey"
        @export="handleExport"
        :initialState="initalState" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AlisEditor from './EditorWrapper'
import { isMobile } from './utils/deviceUtil'
import initalState from '../spec/mock/initialState'

export default Vue.extend({
  components: {
    AlisEditor
  },
  data() {
    return {
      initalState,
      preview: false,
      iframelyApikey: process.env.VUE_APP_IFRAMELY_API_KEY
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
