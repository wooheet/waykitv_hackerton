import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import { shortHash, stringToJson } from './filters'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import vuescroll from 'vue-scroll'
import VueClipboard from 'vue-clipboard2'
import VueAnalytics from 'vue-analytics'

VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(VueAnalytics, {
  id: 'UA-112834562-3',
  router
})
Vue.config.productionTip = false

Vue.use(require('vue-moment'))

Vue.use(vuescroll, { debounce: 600 })

Vue.filter('shortHash', shortHash)
Vue.filter('stringToJson', stringToJson)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
