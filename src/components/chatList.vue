<template>
    <div class="userListWrap">
        <search-wrap @changeSearchVal="handleChangeSearchVal" @quickCreate="handleQuickCreate" />
        <div :class="[showLoadMore? 'height600' : 'height628', 'mesListWrap lm_scroll']">
            <ul>
                <li 
                    v-for="item in messageList" 
                    :key="item.groupId"
                    :class="[isActive === item.groupId ? 'bg_active' : '', item.isTop ? 'bgea' : '']"
                    @click="handleLiClick(item)"
                >
                    <!-- 1 小组  2 私人 -->
                    <a-badge :count="item.unReadNumber" :dot="item.groupType === 1 && item.unReadNumber > 0"> 
                        <x-avatar :imgUrl="item.avatar" />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title overHidden" :title="item.name" v-html="item.name"></p>
                            <span class="iconfont iconV" v-if="item.official" />
                        </div>
                        <p class="time" v-show="inputSearchVal === ''">
                            {{ item.lastMsgTime ? $timeFormat(item.lastMsgTime) : '' }}
                            <span class="aiteSpan" v-show="item.aiteShow">有人@我</span>
                        </p>
                        <!-- <p v-show="inputSearchVal !== ''">备注名</p> -->
                    </div>
                </li>                   
            </ul> 
            <div class="searchNoResult" v-show="searchNoResult">
                <span class="searchBg iconfont iconsousuo-copy"></span>
                <div>
                    <p>未匹配到任何{{ $route.path === '/lmgroups/main/chat' ? '用户' : '小组' }}</p>
                    <p class="overHidden">搜索内容:<span>{{inputSearchVal}}</span></p>
                </div>
            </div>  
        </div>
        <load-more v-show="showLoadMore" @loadMoreBtnClick="handleLoadBtnClick"  />
    </div>    
</template>

<script>
import XAvatar from '@/components/avatar'
import SearchWrap from '@/components/searchWrap'
import LoadMore from '@/components/loadMore'
import { matchChangeColor, clearMatchColor, setLocal } from '@/utils/utils'
import { mapMutations } from 'vuex'
export default {
    name: 'chatList',
    data() {
        return {
            pageNo: 1,
            showLoadMore: true, // 默认显示加载更多，取出数据小于10条则隐藏
            isActive: '', // li的下标，默认不选中任何
            messageList: [], // 用户列表数据
            saveMessageList: [],  // 保存用户列表数据
            searchNoResult: false,  // 未搜索到用户时显示
            inputSearchVal: '', // 接收searchWrap组件的搜索值
            isGroup: false, // 区分聊天列表和我加入的小组
            chosedLi: {},   //  所点击选择的对象
            chatList: [],   // 请求到聊天记录的数组
            aiteShow: false,   //  被艾特时显示
            heartCheck: {}     // websocket 心跳对象
        }
    },
    components: {
        XAvatar,
        SearchWrap,
        LoadMore
    },
    computed: {
        groupIdChange(){
            return this.$store.state.groupId
        },
        userListChange(){
            return this.$store.state.getUserList
        }
    },
    watch: {
        $route: {
            handler (n, o){
                if ( n.path === '/lmgroups/main/group' ) {
                    this.isGroup = true;
                    this.pageNo = 1;
                    this.getUserList(false);
                } else if ( n.path === '/lmgroups/main/chat' ) {
                    this.isGroup = false;
                    this.pageNo = 1;
                    this.getUserList(false);
                }
            },
            deep: true
        },
        groupIdChange: {
            handler(n, o) {
                if ( n !== o && o !== '' ) {
                    if ( this.$store.state.autoClick !== 1 ) {
                        const index = this.messageList.findIndex( v => v.groupId === n );
                        console.log(this.messageList[index]);
                        if ( this.messageList[index] ) {
                            // 如果匹配到人，则触发点击事件执行下面的逻辑
                            this.handleLiClick(this.messageList[index]); 
                        } else {
                            // 如果未匹配到人，则说明左侧列表还没有过对话，则需要刷新列表
                            this.getUserList(false, true);
                            this.$store.commit('changeAutoClick', 1);
                        }
                    } else { 
                        console.log('this.$store.state.autoClick === 1');
                    }                                      
                    // 监听到 groupId 改变，则去刷新数组 
                    // this.getUserList(false, true);
                }
            },
            deep: true
        },
        userListChange: {          
            handler(n, o) {
                if ( n !== o ) {
                    this.getUserList(false);
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapMutations([ 'handleChosedLi', 'changeMemberType', 'changeAdmin', 
        'changeGroupId', 'changeGetUserList', 'changeUser', 'changeMesObjNum']),
        /**
         * li的点击处理事件
         * 将点击的数据对象传递到父组件
         * 通过vuex改变Loading的状态
         */
        async handleLiClick(item){ 
            item.unReadNumber = 0; 
            item.aiteShow = false;
            this.chosedLi = item;       
            this.isActive = item.groupId;
            const res = await this.$getData('/chat/detail.do', {
                groupId: item.groupId,
                chatEid: item.chatEid,
                eid: this.$myEid,
            });
            const { data: { obj } } = res;
            obj.chatList.map ( v => {
                if ( v.chatType === 11 ) {
                    v.text = JSON.parse(v.text)
                }
            })
            this.chatList = obj.chatList;
            this.handleChosedLi(item);   // 将所选中的左侧列表存到vuex里面，还有其他的组件需要用到
            this.changeGroupId(item.groupId);
            this.changeMemberType(obj.groupMemberType);
            this.changeAdmin(obj.isAdmin); // 将用户身份存到vuex
            this.$emit('clickChosedLi', obj, item);
            this.$store.commit('addChatConList', this.chatList);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */       
        async getUserList( init, isGroupId = false ){
            init ? this.pageNo++ : this.pageNo;
            // 由通讯录好友点到我加入的小组时，isGroup为false请求到了聊天列表的数据
            this.isGroup = this.$route.path === '/lmgroups/main/group' ? true : false;
            const res = await this.$getData('/leftHotGroups.do', { 
                eid: this.$myEid, 
                pageNo: this.pageNo, 
                isGroup: this.isGroup 
            });
            let { data: { rows,user,vo } } = res;
            this.changeUser(user);
            this.changeMesObjNum(vo);
            if ( rows.length < res.data.count ) {
                this.showLoadMore = false
            } else {
                this.showLoadMore = true
            }
            this.messageList = init ? this.messageList.concat(rows) : rows;
            this.saveMessageList = this.messageList;
            if ( isGroupId ) {  
                // 监测到 groupId 改变，过滤出来匹配到的列表，触发列表的点击事情
                // 通讯录点私聊传递过来一个 groupId,匹配到相应的触发点击事件
                const item = this.messageList.filter( v => v.groupId === this.$store.state.groupId );
                this.handleLiClick(item[0]);
            }
            // 存储到vuex
            this.changeGetUserList(false);
            this.$store.commit('addUserList', this.messageList);
        },
        // 加载更多按钮的点击事件处理
        handleLoadBtnClick(item){
            this.getUserList(item)
        },
        /**
         * 接收searchWrap子组件传递过来的值
         */
        handleQuickCreate(obj){
            this.$emit('quickCreateGroup', obj);
        },
        /**
         *  接受searchWrap子组件传递过来的搜索的值进行搜索匹配
         *  走接口查询
         *  接口也没查询到任何数据的话，最后显示未搜索到的结果
         */
        async handleChangeSearchVal(searchVal){
            this.inputSearchVal = searchVal;
            if ( searchVal !== '' ) {
                /**
                 * 每次修改都需要清空一下可能存在的span标签
                 */
                clearMatchColor(this.messageList, 'name');
                this.searchNoResult = false;

                let isGroup = this.$route.path === '/lmgroups/main/chat' ? false : true;
                const res = await this.$getData('/leftHotGroups.do', {
                    eid: this.$myEid,
                    name: searchVal,
                    pageNo: 1,
                    isGroup
                });
                const { data: { rows } } = res;
                if ( rows.length > 0 ) {
                    this.messageList = matchChangeColor(rows, searchVal, 'name');
                } else {
                    this.searchNoResult = true;
                }
            } else {
                clearMatchColor(this.messageList, 'name');
                this.messageList = this.saveMessageList;
                this.searchNoResult = false;
            }
        },
        getBaseIPPort() {
            //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8080
            var localhostPath = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/ems
            //var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            //获取项目的basePath   http://localhost:8080/ems/
            //var basePath=localhostPath+projectName+"/";
            console.log('localhostPath', localhostPath.split('http://')[1])
            return localhostPath.split('http://')[1];
        },        
        // 初始化创建 websocket
        initWebsocket(){
            // ${this.getBaseIPPort()}
            const wsUrl = `ws://${this.getBaseIPPort()}/moocGroupApi/ws?uid=${this.$myEid}`; 
            console.log('wsUrl', wsUrl)
            if('WebSocket' in window){
                this.websocket = new WebSocket(wsUrl);
            }else if('MozWebSocket' in window){ 
                this.websocket = new MozWebSocket(wsUrl);
            } 
            this.$store.commit('changeWs', this.websocket);
            this.websocket.onopen = this.websocketonopen;
            this.websocket.onmessage = this.websocketonmessage;
            this.websocket.onerror = this.websocketonerror;
            this.websocket.onclose = this.websocketclose;           
        },
        websocketonopen(){
            this.heartCheck.reset().start();
            this.$message.success('Websocket 连接成功');
            // console.log('Websocket 连接成功');       
        },
        websocketonerror(){
            this.initWebsocket()
        },
        async websocketonmessage(e){
            const reData = JSON.parse(e.data);
            let atEidsArr = reData.atEids.split(',');       
            // if ( atEidsArr.findIndex( v => v === this.$myEid ) > -1 || atEidsArr.findIndex( v => v === 'all' ) > -1 ) {
                // this.aiteShow = true
            // }
            const index = this.messageList.findIndex( v => v.groupId === reData.groupId );
            if( index > -1 ) {  
                if ( atEidsArr.findIndex( v => v === this.$myEid ) > -1 || atEidsArr.findIndex( v => v === 'all' ) > -1 ) {
                    const newObj = { ...this.messageList[index], aiteShow: true };
                    this.messageList.splice(index, 1, newObj); 
                }    
                const str = this.messageList.splice(index, 1); 
                let newArr = [];             
                let officialArr = this.messageList.filter( v => v.official );
                let topArr = this.messageList.filter( v => v.isTop );
                let otherArr = this.messageList.filter ( v => v.official === false && v.isTop === false );
                if ( str[0].official ) { // 如果是官方群收到新消息，则直接更换到第一位
                    this.messageList.unshift(str[0]);
                } else if ( str[0].isTop ){ 
                    // 如果本身是置顶群收到消息，则判断是否存在官方群，若存在将官方群放到第一位，
                    // 若不存在则将收到消息的置顶群放到第一位，其他的群放在后面
                    if ( officialArr.length > 0 ) {
                        // 如果既是官方群也是置顶群，则从置顶群的列表里面删掉官方群
                        let officialIndex = topArr.findIndex( v => v.groupId === officialArr[0].groupId );
                        if ( officialIndex > -1 ) {
                            topArr.splice(officialIndex, 1)
                        }
                        newArr = [ ...officialArr,...str,...topArr,...otherArr ];
                        this.messageList = newArr;
                        console.log('是置顶群且存在官方群的处理结果', this.messageList);
                    } else {
                        newArr = [...str, ...topArr, ...otherArr];
                        this.messageList = newArr;
                        console.log('是置顶群且不存在官方群的处理结果', this.messageList);
                    }
                } else {
                    // 收到消息的群既不是官方群也不是置顶群
                    // 判断原本的消息列表中是否存在官方群，存在则将官方群放在第一个，不存在则将置顶群放在前面
                    if ( officialArr.length > 0 ) {
                        // 如果既是官方群也是置顶群，则从置顶群的列表里面删掉官方群
                        let officialIndex = topArr.findIndex( v => v.groupId === officialArr[0].groupId );
                        if ( officialIndex > -1 ) {
                            topArr.splice(officialIndex, 1)
                        }
                        newArr = [ ...officialArr,...topArr,...str,...otherArr ];
                        this.messageList = newArr;
                        console.log('不是置顶群且存在官方群的处理结果', this.messageList);
                    } else {
                        newArr = [...topArr,...str, ...otherArr];
                        this.messageList = newArr;
                        console.log('不是置顶群且不存在官方群的处理结果', this.messageList);
                    }                    
                }
                // this.messageList.unshift(str[0]);
            } else {
                this.$store.commit('changeGetUserList', 2);
            }
            console.log('this.chosedLi', this.chosedLi)
            console.log('reData', reData)
            if ( JSON.stringify(this.chosedLi) == '{}' ) {
                // 聊天列表在左边存在/不存在，但未选中
                const newArr = this.messageList.filter( v => v.groupId === reData.groupId )
                if ( newArr.length === 0 ) {
                    // 聊天列表在左边不存在，则请求一次左侧列表，并且把未读消息改为1
                    console.log('聊天列表在左边存在/不存在, 数组为0')
                    const res = await this.$getData('/leftHotGroups.do', { 
                        eid: this.$myEid, 
                        pageNo: 1, 
                        isGroup: false
                    });
                    const { data: { rows } } = res;
                    this.messageList = rows;
                    console.log('this.messageList', this.messageList)
                    this.messageList.filter( v => {
                        if ( v.groupId === reData.groupId ) {
                            v.unReadNumber = 1
                        }
                    });                    
                } else {
                    console.log('聊天列表在左边存在/不存在, 数组不为0')
                    this.messageList.filter( v => {
                        if ( v.groupId === reData.groupId ) {
                            v.unReadNumber++
                        }
                    });
                }              
            } else {
                // 聊天列表在左边存在，选中，则将消息push到chatList中
                if ( reData.groupId === this.chosedLi.groupId ) {
                    console.log('选中了push到消息中');
                    this.chatList.push(reData);
                } else {
                    console.log('未选中且不存在');
                    this.messageList.filter( v => {
                        if ( v.groupId === reData.groupId ) {
                            v.unReadNumber++
                        }
                    })
                    console.log('未读消息加1')
                } 
            }             
            this.$store.commit('addChatConList', this.chatList);   
            this.heartCheck.reset().start();
        },
        websocketsend(Data){
            this.websocket.send(JSON.stringify(Data));
        },
        websocketclose(e){
            console.log('断开连接', e);
        }        
    }, 
    created () { 
        let _this = this;
        var heartCheck = {
            timeout: 2000,        //5秒发一次心跳
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function(){
                console.log('reset调用')
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                return this;
            },
            start: function(){
                console.log('start调用')
                var self = this;
                this.timeoutObj = setTimeout(function(){
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    //onmessage拿到返回的心跳就说明连接正常
                    // _this.websocketsend({fromEid: "ybb2011", groupName: '55555', text: '111111', to: 'klinChao'});
                    console.log("ping!")
                    // self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
                    //     _this.websocket.onclose();     //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    // }, self.timeout)
                }, this.timeout)
            }
        }     
        _this.heartCheck = heartCheck;
        heartCheck = null;    
        this.initWebsocket();         
        if ( JSON.stringify(this.$route.params) !== "{}" && this.$route.params.groupId !== null ) {
            this.getUserList(false, true);
        } else {
            this.getUserList(false);
        }
    },   
}
</script>

<style lang="less">
.bgea{ background-color: #eaeaea }
.height600{ height: 600px }
.height628{ height: 628px }
.userListWrap{
    width: 250px;
    height: 698px;
    background-color: #f5f5f5;
    position: relative;
    .mesListWrap{
        overflow-y: auto;
        overflow-x: hidden;       
        ul{
            li{
                width: 100%;
                padding: 10px;
                display: flex;
                &:hover{
                    background-color: #eaeaea;
                }
                &.bg_active{
                    background-color: #f3e2cb;
                }
                .infoWrap{
                    margin-left: 10px;
                    .titleWrap{
                        display: flex;
                        span.iconV{
                            color: #ff6600;
                        }
                        .title{
                            width: 164px;                      
                            color: #333333;
                            font-size: 14px; 
                            .searchText{
                                color: red;
                            }
                        } 
                        .time{
                            font-size: 13px;
                            color: #666666;
                            position: relative;
                        }                   
                    }  
                    .aiteSpan{
                        position: absolute;
                        color: red;
                        font-weight: bold;
                        right: 0;
                    }                  
                }
            }
        }
        .searchNoResult{
            display: flex;
            padding: 10px;
            .searchBg{
                display: inline-block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #ffffff;
                background-color: #70b24c;
                margin-right: 10px;
            }
            div{
                p.overHidden{
                    width: 170px;
                }
            }
        }        
    }
}
</style>
