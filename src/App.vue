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
        websocket = new WebSocket("ws://172.26.75.222/groups//ws?uid=ksz");
    }
    else if ('MozWebSocket' in window) {
        websocket = new MozWebSocket("ws://172.26.75.222/groups//ws?uid=ksz");
    }
    else {
        websocket = new SockJS("http://172.26.75.222/groups//ws?uid=ksz");
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

<style lang='less' scoped>
p{
  margin: 0
}
.topWrap{
    width:980px;
    margin: 30px auto;
    display: flex
}
</style>
