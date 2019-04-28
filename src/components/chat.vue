<template>
    <div class="chatMainBox">
        <a-modal
            class="checkMemberModal"
            v-model="cardVisible"
            centered
            :closable="false"
            :footer="null"
        >
            <check-member @checkMemberSureBtn="handleCheckMemberSureBtn" @quickCreateGroup="handleQuickCreateGroup">
                <span>勾选好友，发送名片</span>
            </check-member>
        </a-modal>
        <a-modal 
            v-model="imgVisible"
            centered
            :footer="null"            
        >
            这是点击发送图片显示的
        </a-modal>
        <a-modal 
            v-model="linkVisible"
            centered
            :footer="null"            
        >
            这是点击发送链接显示的
        </a-modal>        
        <div id="chatScrollArea" class="chatScrollArea lm_scroll">
            <ul>
                <li 
                    v-for="(item,index) in chatList" 
                    :key="index"
                    :class="[ item.isMe ? 'fl' : 'fr' ]"
                >
                    <a-popover
                        placement="rightBottom"
                        :class="[ item.isMe ? 'fl' : 'fr' ]"
                    >
                        <template slot="content">
                            <div class="personInfoWrap">
                                <x-avatar :imgUrl="item.avatar" />
                                <div>
                                    <!-- <p><span>昵称</span><span class="iconfont iconpen" /></p> -->
                                    <memo-name from='1' @saveMemoName="handleSaveMemoName" />
                                    <p>用户名：<span v-text="item.name"></span></p>
                                </div>
                            </div>
                            <div class="partInfoWrap">
                                <p>单位：<span v-text="item.partInfo"></span></p>
                                <p class="partIconWrap">
                                    <span title="点击发送私聊消息" @click="handleChatSend" class="iconfont iconsiliao" />
                                    <span 
                                        :title="[ item.friend ? '点击删除好友' : '点击添加好友' ]"
                                        :class="[item.friend ? 'iconshanhaoyou' : 'iconjiahaoyou', 'iconfont']" 
                                        @click="showAddFriend(item.friend)" 
                                    />                                  
                                </p>
                            </div>
                            <div class="addFriendWrap" v-if="showAddFriendWrap">
                                <p>添加好友<span class="iconfont icondelete" @click="hideAddFriend"></span></p>
                                <a-textarea v-model="addFriend+item.name" :rows="4" placeholder="请输入添加理由" />
                                <a-button class="greenBtn" size="small" @click="handleAddFriendSure">确定</a-button>
                            </div>
                        </template>
                        <div>
                            <x-avatar :class="[ item.isMe ? 'fl' : 'fr' ]" :imgUrl="item.avatar" />
                        </div>
                    </a-popover>
                    <div :class="[ item.isMe ? 'fl ml10 ' : 'fr mr10 textAlignR ','chatInfoWrap' ]">
                        <p><span v-text="item.name"></span></p>
                        <div :class="[ item.isMe ? 'bgSelf' : 'bgOther', 'mesContent' ]" v-html="emoji(item.content)"></div>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="iconListWrap">
            <li v-for="(item,index) in iconList" :key="index">
                <a-tooltip>
                    <template slot="title">
                        {{item.title}}
                    </template>
                    <span>
                        <span @click="handleIconClick(item)" :class="[item.type, 'iconfont']"></span>
                    </span>
                    
                </a-tooltip>            
            </li>
            <a-tooltip placement="topRight">
                <template slot="title">
                    点击加载历史记录
                </template>
                <span @click="handleLoadMoreChat" class="iconfont fr iconliaotianjilu"></span>
            </a-tooltip>
            
        </ul>
        <a-modal
            v-model="showEmoji"
            centered
            :footer="null"
        >        
            <div class="emojiPosition">
                <vue-emoji
                    @select="selectEmoji">
                </vue-emoji>
            </div>
        </a-modal>
        <a-textarea v-model="chatCon" placeholder="请输入......" :rows="4" />
        <div class="sendWrap fr">
            <p>按Enter发送、Ctrl+Enter换行</p>
            <a-button class="greenBtn" @click="handleSendBtnClick" size="small">发送</a-button>
        </div>
        
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import CheckMember from '@/components/checkMember'
import vueEmoji from '@/components/emoji'
import MemoName from '@/components/memoName'
export default {
    name: 'chat',
    data() {
        return {
            // value: '',
            showEmoji: false,
            chatCon: '', // 用户输入的聊天内容
            chatList: [],
            showAddFriendWrap: false,
            addFriend: '我是', // 添加好友理由
            cardVisible: false, // 发送名片框的显示隐藏控制
            imgVisible: false, // 发送图片框的显示隐藏控制
            linkVisible: false, // 发送链接框的显示隐藏控制
            wsReadyState: this.ws.readyState,  // websocket连接状态， 0 未建立连接， 1 已建立连接，可通信。 2 连接正在关闭，3 连接已关闭
            iconList: [
                { type: 'iconaite', title: '艾特' },
                { type: 'iconbiaoqing', title: '表情'},
                { type: 'icontupian', title: '发送图片'},
                { type: 'iconlianjie', title: '发送链接'},
                { type: 'iconwenjian', title: '发送文件'},
                { type: 'iconmingpian', title: '发送名片'},
            ]            
        }
    },
    computed: {
        getChatConList() {
            return this.$store.state.chatConList
        }
    },
    watch: {
        getChatConList(curval, oldval){
            if ( curval !== oldval ) {
                this.chatList = curval
            }
        },
        chatList(){
            this.$nextTick(() => { // 不加nextTick只到倒数第二条
                var container = this.$el.querySelector('#chatScrollArea')
                container.scrollTop = container.scrollHeight
            })           
        }
    },
    components: {
        XAvatar,
        CheckMember,
        vueEmoji,
        MemoName
    },
    methods: {
        selectEmoji (code) {
            this.showEmoji = false
            this.chatCon += code;
        },
        async handleLoadMoreChat() {
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('chatCon', {});
            const { data: { data } } = res;
            this.chatList = data.concat(this.chatList);
            this.$store.commit('changeShowLoad', false);
            this.$store.commit('addChatConList', this.chatList);
        },
        /**
         * memoName组件传递过来的参数
         * 修改昵称的点击事件
         */
        handleSaveMemoName(name){
            console.log(name)
        },
        // 点击发送消息逻辑
        handleSendBtnClick(){
            if ( this.wsReadyState === 1 ) {
                var newObj = {};
                newObj.name = '本人'
                newObj.time = new Date();
                newObj.content = this.chatCon;
                newObj.isMe = true;
                newObj.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                this.chatList.push(newObj);
                // websocket发送消息
                this.ws.send(this.chatCon);
                this.ws.onmessage = evt => {
                    console.log(evt);
                    console.log(evt.data);
                    var sysObj = {};
                    sysObj.name = '系统'
                    sysObj.time = new Date();
                    sysObj.content = evt.data;
                    sysObj.isMe = false;
                    sysObj.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                    this.chatList.push(sysObj);                    
                }     

                this.chatCon = '';
            } else {
                this.$message.error('websocket连接不正常，请检查后重试');
            }

        },
        // 发起私聊请求
        async handleChatSend(){
            this.$message.info('发起私聊请求');
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('chatCon', {});
            const { data: { data } } = res; 
            this.chatList = data;
            this.$store.commit('changeShowLoad', false);
            this.$store.commit('addChatConList', this.chatList);                       
        },
        // 显示添加好友框
        showAddFriend(obj){
            let _this = this;
            if ( obj ) {
                this.$confirm({
                    title: '确认从好友列表中删除此人么？',
                    okText: '确认',
                    cancelText: '取消',
                    onOk(){
                        _this.$message.success('删除好友成功')
                    }
                })
            } else {
                this.showAddFriendWrap = true;
            }
            
        },
        // 隐藏添加好友框
        hideAddFriend(){
            this.showAddFriendWrap = false;
        },
        // 添加好友确定按钮
        handleAddFriendSure(){
            this.hideAddFriend();
            this.$message.success('添加好友请求发送成功');
        },
        // 图标的点击事件处理
        handleIconClick(item){
            console.log(item);
            if ( item.type === 'iconmingpian' ) {
                this.cardVisible = true;
            }

            if ( item.type === 'iconbiaoqing' ) {
                this.showEmoji = !this.showEmoji;
            }

            if ( item.type === 'icontupian' ) {
                this.imgVisible = !this.imgVisible;
            }

            if ( item.type === 'iconlianjie' ) {
                this.linkVisible = !this.linkVisible;
            }
        },
        // 接收searchMember传递的事件处理
        handleQuickCreateGroup(obj){
            this.cardVisible = !obj;
        },
        // 接收checkMember传递勾选好友
        handleCheckMemberSureBtn(arr){
            console.log(arr);
            if ( arr.length > 0 ){
                this.$router.push({
                    path: '/chat'
                })
            }
            this.cardVisible = false;
        }
    },
    created() {
        console.log(this.ws.readyState);
    },
}
</script>

<style lang="less" scoped>
.mr10{ margin-right: 10px; }
.ml10{ margin-left: 10px; }
.bgSelf{ background-color: #fbf6ed }
.bgOther{ background-color: #def7f0 }
.textAlignR{ text-align: right }
textarea[class='ant-input']{ resize: none }


.ant-modal-centered {
    .ant-modal{
        width: 251px !important;
        height: 471px; 
        .ant-model-content{
            .ant-modal-body{
                padding: 0;
                .checkMemberTopWrap{
                    height: 360px;
                    border: 1px solid #d5d4d4;
                }
            }
        }        
    } 
     
}

.ant-popover{
    div.ant-popover-inner-content{
        padding: 0;
        width: 252px;
        .personInfoWrap{
            display: flex;
            background-color: #f5f5f5;
            font-size: 14px;
            color: #333333;
            margin-bottom: 13px;
            .ant-avatar{
                margin-right: 10px;
            }
            div{
                line-height: 20px;
            }
        }
        .partInfoWrap{
            font-size: 14px;
            color: #333333;
            .partIconWrap{
                text-align: right;
                span{
                    cursor: pointer;
                    margin-left: 9px;
                }
            }
        }
        .addFriendWrap{
            overflow: hidden;
            p{
                padding: 9px 0;
            }
            span{
                float: right;
                cursor: pointer;
            }
            button{
                margin-top: 10px;
                float: right;              
            }
        }
    }
}

.chatMainBox{
    width: 640px;
    margin-top: 15px;
    .chatScrollArea{
        width: 638px;
        height: 428px;
        border: 1px solid #e5e5e5;
        padding: 12px 10px 0 10px;
        background-color: #ffffff;
        overflow-y: auto;
        overflow-x: hidden;
        ul{
            li{
                width: 390px;
                margin-bottom: 20px;
                div.chatInfoWrap{
                    p{
                        font-size: 12px;
                        margin-top: -7px;
                    }
                }
                .mesContent{
                    max-width: 338px;
                    border: 1px solid #eaeaea;
                    border-radius: 5px;
                    padding: 9px 10px;
                    font-size: 14px;
                    color: #696865
                }
            }
        }        
    }
    .iconListWrap{
        display: flex;
        background-color: #ffffff;
        li{
            height: 20px;
            line-height: 20px;
            font-size: 18px;
            margin: 8px 12px 8px 0;
            color: #666666;
            cursor: pointer;
            &:hover{
                color: #f0b577
            }
            span{
                font-size: 18px;
            }
        }
        span.fr{
            margin: 0 8px 0 auto;
            font-size: 20px;
            line-height: 36px;
            cursor: pointer;
        }       
    }
    .sendWrap{
        display: flex;
        margin-top: 10px;
        p{
            font-size: 13px;
            color: #999999;
            margin: 3px 6px 0 0;
        }
    }
}
</style>

