import Vue from 'vue'
import Router from 'vue-router'
import About from './views/About.vue'
import ChatPage from './views/ChatPage.vue'
import Message from './views/Message.vue'
import Setting from './views/Setting.vue'
import Member from './views/Member.vue'
import Search from './views/Search.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/chat',
      name: 'chat',
      component: ChatPage
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/member',
      name: 'member',
      component: Member
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/message',
      name: 'message',
      component: Message
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    },   
    { path: '*', redirect: '/chat' } 

  ]
})
