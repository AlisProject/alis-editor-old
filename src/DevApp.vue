<template>
  <div id="app">
    <div>
      <img src="/sample-header.png">
      <AlisEditor @export="handleExport" :initialState="initalState" />
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
      initalState
    }
  },
  methods: {
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
