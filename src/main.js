import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import './assets/scss/app.scss'
import * as fb from './firebaseConfig'

Vue.config.productionTip = false

// handle page reloads
let app
fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
