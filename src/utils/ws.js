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

let ws;
let $myEid = 'ybb2011';
let currentRuquest = 'xm-pc:8081'

// if ('WebSocket' in window) {
//     ws = new WebSocket(`ws://${currentRuquest}`);
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
ws = new WebSocket(`ws://${currentRuquest}`);
console.log(ws);
export default ws;