<template>
  <div class="loginWrap">
      <a-input placeholder="输入用户eid" v-model="loginEid">
          <a-icon slot="prefix" type="user"></a-icon>
      </a-input>
      <a-input placeholder="输入用户名" v-model="loginName">
          <a-icon slot="prefix" type="lock"></a-icon>
      </a-input>
      <a-button @click="handleLoginClick">登录</a-button>
  </div>
</template>

<script>

import { setCookie } from '@/utils/utils'

export default {
  name: 'login',
  data(){
      return{
        loginEid: '',
        loginName: ''
      }
  },
  methods: {
      handleLoginClick(){
          if ( this.loginEid && this.loginName ) {
            setCookie('loginEid', this.loginEid);
            setCookie('loginName', this.loginName);
            this.$router.push('/lmgroups/main/chat');
          }
      }
  },
  created() {

  },
}
</script>

<style lang='less'>
.loginWrap{
    width: 600px;
    margin: 100px auto;
    .ant-input-affix-wrapper{
        margin-bottom: 20px;
    }
}
</style>
