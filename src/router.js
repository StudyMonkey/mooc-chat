import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import ChatPage from './views/ChatPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChatPage
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/menber',
      name: 'member',
      component: Home
    }
  ]
})
