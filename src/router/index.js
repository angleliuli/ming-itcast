// 引入 Vue
import Vue from 'vue'
// 引入路由管理
import VueRouter from 'vue-router'

// 引入登录组件
import Login from '@/views/login.vue'
// 引入首页
import Home from '@/views/home.vue'

// 让vue使用router路由管理
Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home
    }
  ]
})

export default router
