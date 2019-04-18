import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userList: [], // 左侧菜单的用户列表
    chatConList: [] // 用户的聊天内容列表
  },
  mutations: {
    addUserList( state, list ) {
      state.userList = list
    },
    addChatConList( state, list ) {
      state.chatConList = list
    }
  },
  actions: {

  }
})
