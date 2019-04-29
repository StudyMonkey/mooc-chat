<template>
  <div id="app">
    <div class="topWrap">
      <Loading v-if="showLoad" />
      <LeftMenu />
      <div>
        <router-view/>
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
    this.ws.onopen = function(){
      console.log('连接成功');
      console.log(this);
      // Web Socket 已连接上，使用 send() 方法发送数据
      _this.ws.send("发送数据");
      
      _this.ws.onmessage = evt => {
        console.log(evt.data);
      }
    }
  },
}
</script>

<style lang='less'>
body{ background-color: #f0eee8; }
ul,p{ margin: 0 }
body,.lm_scroll{
  &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 2px;
  }
  &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块样式*/
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #06c5d2;
  }
  &::-webkit-scrollbar-track {
      /*滚动条里面轨道样式*/
      -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 0;
      background: rgba(0, 0, 0, 0.1);
  }
}
div{
  /deep/input.ant-input:focus,/deep/.ant-select-open .ant-select-selection {
      outline: none;
      border-color: #97c1bc;
      box-shadow: 0 0 3px #97c1bc;
  }
  /deep/input.ant-input:hover,/deep/.ant-select-selection:hover{
      border-color: #97c1bc;
  }
  .ant-btn-sm{
    height: 26px;
  }
  &.middleWrap{
    width: 250px;
    height: 700px;
    background-color: #f5f5f5;
    position: relative;
  }
  /deep/.checkMemberModal{
     width: 251px !important;
    .ant-modal-content{
      width: 251px;
      .ant-modal-body{
        padding: 0;
        .checkMemberTopWrap{
          height: 472px;
          .listUserUlWrap{
            height: 402px;
          }
        }
      }
    }
  }
}
.ant-input-affix-wrapper{
  input.ant-input:hover{
      border-color: #97c1bc;
  }  
}

.ant-tooltip{
  /deep/.ant-tooltip-inner{
    background-color: #fff;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  .ant-tooltip-content{
    .ant-tooltip-arrow{
      border-top-color: #fff;
      border-bottom-color: #ffffff;
    }

  }
}

.limitadm_table1{
    width: 100%;
    table-layout: fixed; 
    background-color: #ffffff;
    tr{
        &:hover{
          background-color: #fbf6ed;
        }
        &.tr1{
            background-color: #f5f5f5;
            &:hover{
              background-color: #f5f5f5;
            }
            td{               
                font-size: 16px;
                color: #2e766e;
                font-weight: bold;
            }
        }
        td{
            font-size: 14px;
            color: #333333;
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }  
    }     
}

.greenBtn{
  padding: 0 9px;
  background-color: #70b24c; 
  height: 26px;
  color: #ffffff;   
}

.topWrap{
    width:980px;
    margin: 30px auto;
    display: flex
}
</style>
