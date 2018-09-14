<template>
  <div id="app">
    <div>
      <AlisEditor @export="handleExport" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AlisEditor from './AlisEditor.vue'
import { isMobile } from './utils/deviceUtil'

export default Vue.extend({
  components: {
    AlisEditor
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
