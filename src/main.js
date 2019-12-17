import Vue from 'vue'
import App from './App'
import Router from './router/install.js'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.use(Router)

const app = new Vue(App)
app.$mount()
