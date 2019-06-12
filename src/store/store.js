import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showLoad: false,
    chosedLi: {},  // 左侧列表点击所选中的那一项
    userList: [], // 左侧菜单的用户列表
    chatConList: [], // 用户的聊天内容列表
    memberType: '',   // 用户权限
    isAdmin: '',       // 是否为群主或管理员
    groupId: '',      //  列表选中的那个id
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
    },
    changeMemberType( state, type ){
      state.memberType = type;
    },
    changeAdmin( state, num ) {
      state.isAdmin = num
    },
    changeGroupId( state, id ) {
      state.groupId = id;
    }
  },
  actions: {

  }
})
