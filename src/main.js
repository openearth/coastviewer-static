import Vue from 'vue'
import './plugins/fontawesome'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import '@/registerServiceWorker'
import router from './router'
import store from './store'

import 'mapbox-gl/dist/mapbox-gl.css'
import 'ion-rangeslider/css/ion.rangeSlider.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
