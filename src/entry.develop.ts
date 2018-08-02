import Vue from 'vue'
import DevApp from './DevApp.vue'

new Vue({
  el: '#app',
  template: `<div id="app"><DevApp /></div>`,
  components: {
    DevApp
  }
})
