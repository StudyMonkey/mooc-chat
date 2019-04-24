import Vue from 'vue'
import Router from 'vue-router'
import ChatPage from './views/ChatPage.vue'
import Message from './views/Message.vue'
import Setting from './views/Setting.vue'
import AddressList from './views/addressList.vue'
import Search from './views/Search.vue'
import createGroup from './views/createGroup'

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
      path: '/group',
      name: 'group',
      component: ChatPage
    },
    {
      path: '/member',
      name: 'member',
      component: AddressList
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/createGroup',
      name: 'createGroup',
      component: createGroup
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
