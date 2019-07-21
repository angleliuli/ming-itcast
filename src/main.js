import Vue from 'vue'
import App from './App.vue'

// 引入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'

// 引入路由管理
import router from '@/router/index.js'

// 让vue使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 注入router
  router,
  render: h => h(App)
}).$mount('#app')
