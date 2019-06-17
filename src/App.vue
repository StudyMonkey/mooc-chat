<template>
  <div id="app">
    <div class="topWrap">
      <Loading v-if="showLoad" />
      <LeftMenu />
      <div>
        <!-- <transition name="fade"> -->
          <!-- <keep-alive exclude="setting"> -->
            <router-view />
          <!-- </keep-alive>       -->
        <!-- </transition> -->
      </div>
    </div>  
  </div>
</template>

<script>
import LeftMenu from '@/components/leftMenu'
import Loading from '@/components/loading'
import { setCookie } from '@/utils/utils'

export default {
  name: 'app',
  components: {
    LeftMenu,
    Loading
  },
  computed: {
    getLoadStatus() {
      return this.$store.state.showLoad
    }
  },
  watch: {
    getLoadStatus(n, o) {
      if ( n !== o ) {
        this.showLoad = n;
      }      
    }
  },
  data() {
    return {
      showLoad: false
    }
  },
  created() {
    // setCookie('loginEid', 'yh83');
    // setCookie('loginId', '2019123456');
     
    // console.log('链接之前...');
    // const agentData = '从前台发出的消息';
    // let _this = this;
    // if ( this.ws.readyState === this.ws.OPEN ) {
    //   this.ws.send(agentData);
    // } else if ( this.ws.readyState === this.ws.CONNECTING ) {
    //   setTimeout( () => {
    //     _this.ws.send(agentData);
    //   }, 300 )
    // } else {
    //   setTimeout( () => {
    //     _this.ws.send(agentData);
    //   }, 500 )      
    // }
    // this.ws.onopen = function(){
    //   console.log('连接成功');
    //   console.log(this);
    //   _this.ws.send("发送数据");
      
    //   _this.ws.onmessage = evt => {
    //     console.log(evt.data);
    //   }
    // }
  },
}
</script>

<style lang='less'>
@import './less/common.less';

.fade-enter-active,.fade-leave-active{
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
