<template>
    <div class="userListWrap">
        <search-wrap @changeSearchVal="handleChangeSearchVal" @quickCreate="handleQuickCreate" />
        <div :class="[showLoadMore? 'height600' : 'height628', 'mesListWrap lm_scroll']">
            <ul>
                <li 
                    v-for="item in messageList" 
                    :key="item.groupId"
                    :class="isActive === item.groupId ? 'bg_active' : ''"
                    @click="handleLiClick(item)"
                >
                    <!-- 1 小组  2 私人 -->
                    <a-badge :count="item.unReadNumber" :dot="item.groupType === 1 && item.unReadNumber > 0"> 
                        <x-avatar :imgUrl="prefixUrl+item.avatar" />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title overHidden" :title="item.name" v-html="item.name"></p>
                            <span class="iconfont iconV" v-if="item.official === 1" />
                        </div>
                        <p class="time" v-show="inputSearchVal === ''">{{$timeFormat(item.lastMsgTime)}}</p>
                        <!-- <p v-show="inputSearchVal !== ''">备注名</p> -->
                    </div>
                </li>                   
            </ul> 
            <div class="searchNoResult" v-show="searchNoResult">
                <span class="searchBg iconfont iconsousuo-copy"></span>
                <div>
                    <p>未匹配到任何{{ $route.path === '/chat' ? '用户' : '小组' }}</p>
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
import { matchChangeColor, clearMatchColor } from '@/utils/utils'
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
                if ( n.path === '/main/group' ) {
                    this.isGroup = true;
                    this.pageNo = 1;
                    this.getUserList(false);
                } else if ( n.path === '/main/chat' ) {
                    this.isGroup = false;
                    this.pageNo = 1;
                    this.getUserList(false);
                }
            },
            deep: true
        },
        groupIdChange: {
            handler(n, o) {
                if ( n !== o ) {
                    this.getUserList(false, true);
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
        ...mapMutations([ 'handleChosedLi', 'changeMemberType', 'changeAdmin', 'changeGroupId', 'changeGetUserList', 'changeUser']),
        /**
         * li的点击处理事件
         * 将点击的数据对象传递到父组件
         * 通过vuex改变Loading的状态
         */
        async handleLiClick(item){   
            this.chosedLi = item;       
            this.isActive = item.groupId;
            const res = await this.$getData('/chat/detail.do', {
                groupId: item.groupId,
                chatEid: item.chatEid,
                eid: this.$myEid,
            });
            const { data: { obj } } = res;
            this.chatList = obj.chatList;
            console.log('点击改变的groupId', item.groupId);
            this.handleChosedLi(item);   // 将所选中的左侧列表存到vuex里面，还有其他的组件需要用到
            this.changeGroupId(item.groupId);
            this.changeMemberType(obj.groupMemberType);
            this.changeAdmin(obj.isAdmin);
            this.$emit('clickChosedLi', obj, item);
            this.$store.commit('addChatConList', this.chatList);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */       
        async getUserList( init, isGroupId = false ){
            (init && this.pageNo === 1) ? this.pageNo++ : this.pageNo;
            // 由通讯录好友点到我加入的小组时，isGroup为false请求到了聊天列表的数据
            this.isGroup = this.$route.path === '/group' ? true : false;
            const res = await this.$getData('/leftHotGroups.do', { 
                eid: this.$myEid, 
                pageNo: this.pageNo, 
                isGroup: this.isGroup 
            });
            console.log(res);
            let { data: { rows,user } } = res;
            this.changeUser(user);
            if ( rows.length < res.data.count ) {
                this.showLoadMore = false
            } else {
                this.showLoadMore = true
            }
            init ? this.messageList = this.messageList.concat(rows) : this.messageList = rows;
            this.saveMessageList = this.messageList;
            if ( isGroupId ) {  // 监测到 groupId 改变，过滤出来匹配到的列表，触发列表的点击事情
                const item = this.messageList.filter( v => v.groupId === this.$store.state.groupId );
                console.log(item[0]);
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

                let isGroup = this.$route.path === '/main/chat' ? false : true;
                const res = await this.$getData('/leftHotGroups.do', {
                    eid: this.$myEid,
                    name: searchVal,
                    pageNo: 1,
                    isGroup
                });
                const { data: { rows } } = res;
                console.log('查询的结果', rows);
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
        // 初始化创建 websocket
        initWebsocket(){
            const wsUrl = `ws://172.26.75.217:8080/moocGroupApi/ws?uid=${this.$myEid}`; 
            // this.websocket = new WebSocket(wsUrl);
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
            console.log('Websocket 连接成功');
            
        },
        websocketonerror(){
            this.initWebsocket()
        },
        websocketonmessage(e){
            const reData = JSON.parse(e.data);
            console.log('收到消息', reData);
            console.log(this.chosedLi.groupId);
            console.log(this.messageList);
            const index = this.messageList.findIndex( v => v.groupId === reData.groupId );
            console.log('匹配到的index', index);
            if( index > -1 ) {
                const str = this.messageList.splice(index, 1);
                this.messageList.unshift(str[0]);
            } else {
                this.$store.commit('changeGetUserList', 2);
            }

            if ( JSON.stringify(this.chosedLi) === '{}' ) {
                this.messageList.filter( v => {
                    if ( v.groupId === reData.groupId ) {
                        v.unReadNumber++
                    }
                });
                console.log('未点击，未读消息加1')
            } else {
                if ( reData.groupId === this.chosedLi.groupId ) {
                    this.chatList.push(reData);
                } else {
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
            console.log(this.websocket);
            this.websocket.send(JSON.stringify(Data));
        },
        websocketclose(e){
            console.log('断开连接', e);
        }        
    }, 
    created () { 
        let _this = this;
        var heartCheck = {
            timeout: 5000,        //5秒发一次心跳
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
                        }                   
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
