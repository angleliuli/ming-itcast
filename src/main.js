import Vue from 'vue'
import App from './App.vue'

// 引入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'

// 引入路由管理
import router from '@/router/index.js'

// 注册导航守卫
router.beforeEach((to, from, next) => {
  // 获取 token 值
  var token = localStorage.getItem('itcast_ming_token')
  if (token || to.path === '/login') {
    next()
  } else {
    next({
      path: '/login'
    })
  }
})

// 让vue使用element-ui
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  // 注入router
  router,
  render: h => h(App)
}).$mount('#app')
