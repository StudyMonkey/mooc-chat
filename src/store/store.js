import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoad: false,
    chosedLi: {},
    userList: [], // 左侧菜单的用户列表
    chatConList: [] // 用户的聊天内容列表
  },
  mutations: {
    /**  控制整个页面遮蔽层的显示隐藏状态
     * @param {*} state 
     * @param {*} obj 传入的布尔值 true/false
     */
    changeShowLoad( state, obj ){
      state.showLoad = obj
    },
    addUserList( state, list ) {
      state.userList = list
    },
    addChatConList( state, list ) {
      state.chatConList = list
    },
    handleChosedLi( state, obj ) {
      state.chosedLi = obj
    }
  },
  actions: {

  }
})
