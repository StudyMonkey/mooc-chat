// //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
// var curWwwPath = window.document.location.href;
// //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
// var pathName = window.document.location.pathname;
// var pos = curWwwPath.indexOf(pathName);
// //获取主机地址，如： http://localhost:8080
// var localhostPath = curWwwPath.substring(0, pos);
// //获取带"/"的项目名，如：/ems
// var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
// //获取项目的basePath   http://localhost:8080/ems/
// var basePath=localhostPath+projectName+"/";

// console.log(basePath.indexOf("://"));
// console.log(basePath.length);
// var currentRuquest = basePath.substring(basePath.indexOf("://")+3,basePath.length);

// console.log(currentRuquest);

var lockReconnect = false;  //避免ws重复连接
var ws = null;          // 判断当前浏览器是否支持WebSocket
var wsUrl = 'ws://172.26.75.217:8080/moocGroupApi/ws?uid=ybb2011';


// let $myEid = 'ybb2011';
// let currentRuquest = '172.26.75.217:8080/moocGroupApi'

function createWebSocket(url) {
    try{
        if('WebSocket' in window){
            ws = new WebSocket(url);
        }else if('MozWebSocket' in window){  
            ws = new MozWebSocket(url);
        }else{
            alert("您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器，请勿使用IE10以下浏览器，360浏览器请使用极速模式，不要使用兼容模式！"); 
        }
        initEventHandle();
    }catch(e){
        reconnect(url);
        console.log(e);
    }     
}

function initEventHandle() {
    ws.onclose = function () {
        reconnect(wsUrl);
        console.log("llws连接关闭!"+new Date().toUTCString());
    };
    ws.onerror = function () {
        reconnect(wsUrl);
        console.log("llws连接错误!");
    };
    ws.onopen = function () {
        heartCheck.reset().start();      //心跳检测重置
        console.log("llws连接成功!"+new Date().toUTCString());
    };
    ws.onmessage = function (event) {    //如果获取到消息，心跳检测重置
        console.log("llws收到消息啦:" +event.data);
        heartCheck.reset().start();      //拿到任何消息都说明当前连接是正常的       
    };
}
// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function() {
    ws.close();
}  

function reconnect(url) {
    if(lockReconnect) return;
    lockReconnect = true;
    setTimeout(function () {     //没连接上会一直重连，设置延迟避免请求过多
        createWebSocket(url);
        lockReconnect = false;
    }, 2000);
}

//心跳检测
var heartCheck = {
    timeout: 5000,        //9分钟发一次心跳
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        return this;
    },
    start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
            //这里发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            ws.send("ping");
            console.log("ping!")
            self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                ws.close();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, self.timeout)
        }, this.timeout)
    }
}
createWebSocket(wsUrl);   //连接ws

// let currentRuquest = 'xm-pc:8081'

// if ('WebSocket' in window) {
//     ws = new WebSocket(`ws://172.26.75.217:8080/moocGroupApi/ws?uid=${$myEid}`);
//     //alert(1);
// } else if ('MozWebSocket' in window) {
//     ws = new MozWebSocket(`ws://${currentRuquest}`);
//     //alert(2);
// } 
// else {
//     websocket = new SockJS(`http://${currentRuquest}/ws/sockjs${$myEid}`);
//     //alert(3);
// }

// const ws = new WebSocket('ws://123.207.167.163:9010/ajaxchattest');
// ws = new WebSocket(wsUrl);
console.log(ws);
export default ws;