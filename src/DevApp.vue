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

export default Vue.extend({
  components: {
    AlisEditor
  },
  methods: {
    handleExport(tree: any) {
      document.querySelector('#log pre')!.innerHTML = JSON.stringify(tree, null, '  ')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }
})
</script>
