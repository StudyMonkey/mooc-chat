import Vue from 'vue'
import Router from 'vue-router'
import ChatPage from './views/ChatPage.vue'
import AddressList from './views/addressList'
import Search from './views/Search'
import CreateGroup from './views/createGroup'
import Message from './views/Message'
import Setting from './views/Setting'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/chat',
      name: 'chatPage',
      component: ChatPage,
    },
    {
      path: '/group',
      name: 'group',
      component: ChatPage
    },
    {
      path: '/member',
      name: 'member',
      // component: () => import(/* webpackChunkName: "addressList" */ './views/addressList.vue')
      component: AddressList
    },
    {
      path: '/search',
      name: 'search',
      // component: () => import(/* webpackChunkName: "Search" */ './views/Search.vue')
      component: Search
    },
    {
      path: '/createGroup',
      name: 'createGroup',
      // component: () => import(/* webpackChunkName: "createGroup" */ './views/createGroup.vue')
      component: CreateGroup
    },
    {
      path: '/message',
      name: 'message',
      // component: () => import(/* webpackChunkName: "Message" */ './views/Message.vue')
      component: Message
    },
    {
      path: '/setting',
      name: 'setting',
      // component: () => import(/* webpackChunkName: "Setting" */ './views/Setting.vue')
      component: Setting
    },   
    { path: '*', redirect: '/chat' } 

  ]
})
