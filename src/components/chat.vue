<template>
    <div class="chatMainBox">
        <loading v-if="showLoading" />
        <div class="chatScrollArea">
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
                                <a-avatar 
                                    shape="square"
                                    size="default"
                                    :src="item.avatar"
                                />
                                <div>
                                    <p><span>昵称</span><span class="iconfont iconpen" /></p>
                                    <p>用户名：<span v-text="item.name"></span></p>
                                </div>
                            </div>
                            <div class="partInfoWrap">
                                <p>单位：<span v-text="item.partInfo"></span></p>
                                <p class="partIconWrap">
                                    <a-tooltip>
                                        <template slot="title">
                                            点击发送私聊消息
                                        </template>
                                        <span @click="handleChatSend" class="iconfont iconsiliao" />
                                    </a-tooltip>                              
                                    <a-tooltip>
                                        <template slot="title">
                                            {{ item.friend ? '点击删除好友' : '点击发送好友请求'}}
                                        </template>
                                        <span :class="[item.friend ? 'iconshanhaoyou' : 'iconjiahaoyou', 'iconfont']" @click="showAddFriend" />
                                    </a-tooltip>

                                    
                                </p>
                            </div>
                            <div class="addFriendWrap" v-if="showAddFriendWrap">
                                <p>添加好友<span class="iconfont icondelete" @click="hideAddFriend"></span></p>
                                <a-textarea v-model="addFriend+item.name" :rows="4" placeholder="请输入添加理由" />
                                <a-button size="small" @click="handleAddFriendSure">确定</a-button>
                            </div>
                        </template>
                        <a-avatar 
                            :class="[ item.isMe ? 'fl' : 'fr' ]"
                            shape="square"
                            size="default"
                            :src="item.avatar"
                        />
                    </a-popover>
                    <div :class="[ item.isMe ? 'fl ml10 ' : 'fr mr10 textAlignR ','chatInfoWrap' ]">
                        <p><span v-text="item.name"></span></p>
                        <div :class="[ item.isMe ? 'bgSelf' : 'bgOther', 'mesContent' ]" v-text="item.content"></div>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="iconListWrap">
            <li v-for="(item,index) in iconList" :key="index">
                <span :class="[item.type, 'iconfont']" :title="item.title"></span>
            </li>
            <a-tooltip>
                <template slot="title">
                    点击加载历史记录
                </template>
                <span class="iconfont fr iconliaotianjilu"></span>
            </a-tooltip>
            
        </ul>
        <a-textarea v-model="chatCon" placeholder="请输入......" :rows="4" />
        <div class="sendWrap fr">
            <p>按Enter发送、Ctrl+Enter换行</p>
            <a-button @click="handleSendBtnClick" size="small">发送</a-button>
        </div>
        
    </div>
</template>

<script>
import Loading from '@/components/loading'
export default {
    name: 'chat',
    data() {
        return {
            chatCon: '', // 用户输入的聊天内容
            chatList: [],
            showLoading: false,
            showAddFriendWrap: false,
            addFriend: '我是', // 添加好友理由
            iconList: [
                { type: 'iconaite', title: '' },
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
            console.log(`最新值${curval}--旧值${oldval}`);
            if ( curval !== oldval ) {
                this.chatList = curval
            }
        }
    },
    methods: {
        async handleLoadMoreChat() {
            this.showLoading = true
            const res = await this.$getData('chatCon', {});
            const { data: { data } } = res;
            this.chatList = data.concat(this.chatList);
            this.showLoading = false
            this.$store.commit('addChatConList', this.chatList);
        },
        // 点击发送消息逻辑
        handleSendBtnClick(){
            var newObj = {};
            newObj.name = '本人'
            newObj.time = new Date();
            newObj.content = this.chatCon;
            newObj.isMe = true;
            newObj.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
            this.chatList.push(newObj);
            this.chatCon = '';
        },
        // 发起私聊请求
        handleChatSend(){
            this.$message.info('发起私聊请求');
        },
        // 显示添加好友框
        showAddFriend(){
            this.showAddFriendWrap = true;
        },
        // 隐藏添加好友框
        hideAddFriend(){
            this.showAddFriendWrap = false;
        },
        // 添加好友确定按钮
        handleAddFriendSure(){
            this.hideAddFriend();
            this.$message.success('添加好友请求发送成功');
            // alert('请求发送成功');
        }
    },
    components: {
        Loading,
    },
    created () {
        // this.chatList = this.$store.state.chatConList;
        // console.log(this.chatList);
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
                width: 38px;
                height: 38px;
                border-radius: 0;
                border: 1px solid #bbbbbb;
                margin-right: 10px;
            }
            span{
                cursor: pointer;
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
                background-color: #70b24c;
                color: #fff;                
            }
        }
    }
}


.chatMainBox{
    width: 640px;
    margin-top: 15px;
    .chatScrollArea{
        width: 100%;
        height: 428px;
        border: 1px solid #e5e5e5;
        border-right: none;
        padding: 12px 10px 0 10px;
        background-color: #ffffff;
        overflow-y: scroll;
        overflow-x: hidden;
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
        ul{
            li{
                width: 390px;
                margin-bottom: 20px;
                .ant-avatar{
                    width: 38px;
                    height: 38px;
                    border: 1px solid #dcdcdc;
                    border-radius: 0;
                }
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
        button{
            background-color: #70b24c;
            color: #fff;
        }
    }
}
</style>

