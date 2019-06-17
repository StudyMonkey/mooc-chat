import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},   // 登录用户信息
    showLoad: false,
    chosedLi: {},  // 左侧列表点击所选中的那一项
    userList: [], // 左侧菜单的用户列表
    chatConList: [], // 用户的聊天内容列表
    memberType: '',   // 用户权限
    isAdmin: '',       // 是否为群主或管理员
    groupId: '',      //  列表选中的那个id
    getUserList: 0   // 刷新左侧用户列表  0 初始值，  1 // 刷新左侧列表  2 // 刷新列表并置空选择项
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
    },
    changeGetUserList( state, num ) {
      state.getUserList = num;
    },
    // 登录之后改变用户信息
    changeUser( state, obj ) {
      state.user = obj
    }
  },
  actions: {

  }
})
