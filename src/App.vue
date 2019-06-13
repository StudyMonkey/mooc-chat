<template>
  <div id="app">
    <div class="topWrap">
      <Loading v-if="showLoad" />
      <LeftMenu />
      <div>
        <!-- <keep-alive exclude="setting"> -->
          <router-view />
        <!-- </keep-alive>       -->
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
    let _this = this;
    this.ws.onmessage = evt => {
      console.log(evt.data);
    }    
    console.log('链接之前...');
    this.ws.onopen = function(){
      console.log('连接成功');
      console.log(this);
      _this.ws.send("发送数据");
      
      _this.ws.onmessage = evt => {
        console.log(evt.data);
      }
    }
  },
}
</script>

<style lang='less'>
@import './less/common.less';

</style>
