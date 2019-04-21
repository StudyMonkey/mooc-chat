<template>
  <div id="app">
    <div class="topWrap">
      <LeftMenu />
      <div>
        <router-view/>
      </div>
    </div>  
  </div>
</template>

<script>
import LeftMenu from '@/components/leftMenu'
// import io from 'socket.io-client'
import './sockjs'

export default {
  name: 'app',
  components: {
    LeftMenu,
  },
  created() {
    // const socket = io('/v2/groups//ws?uid=ksz');
    // socket.on('connect', () => {
    //   console.log('websocket has connect');
    // })
    var websocket = null;
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://172.26.75.217:8080/groups//ws?uid=ksz");
    }
    else if ('MozWebSocket' in window) {
        websocket = new MozWebSocket("ws://172.26.75.217:8080/groups//ws?uid=ksz");
    }
    else {
        websocket = new SockJS("http://172.26.75.217:8080/groups//ws?uid=ksz");
    }
    // websocket.onopen = onOpen;
    websocket.onopen = function(evnt) {
      console.log("websocket连接上");
    };
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;

    function onOpen(openEvt) {
        alert(openEvt.Data);
    }

    function onMessage(evt) {
        alert("super is:" + evt.data);
    }
    function onOpen() {}
    function onError() {}
    function onClose() {}

    function doSendUser() {
      
      alert(websocket.readyState + ":" + websocket.OPEN);
        if (websocket.readyState == websocket.OPEN) {
            var msg = document.getElementById("inputMsg").value;
            websocket.send("#anyone#"+msg);//调用后台handleTextMessage方法
            alert("发送成功!");
        } else {
            alert("连接失败!");
        }
    }

    function doSendUsers() {
        if (websocket.readyState == websocket.OPEN) {
            var msg = document.getElementById("inputMsg").value;
            websocket.send("#everyone#"+msg);//调用后台handleTextMessage方法
            alert("发送成功!");
        } else {
            alert("连接失败!");
        }
    }

    window.close=function()
    {
        websocket.onclose();
    }
    function websocketClose() {
      websocket.close();
    }    
  },
}
</script>

<style lang='less'>
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
.topWrap{
    width:980px;
    margin: 30px auto;
    display: flex
}
</style>
