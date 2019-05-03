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
            title="添加图片链接"
            v-model="imgVisible"
            centered
            :footer="null"            
        >
            <upload-img>
                <span>图片上传：</span>
            </upload-img>
            <div class="linkAddressWrap">
                <span>链接地址：</span>
                <a-input  placeholder="请输入图片链接地址..." v-model="imgLinkAddress" />
            </div>
            <div class="footerPrompt">
                <p><span class="iconfont icontishi"></span>可发送带有超链接的点击跳转的图片</p>
                <a-button class="greenBtn" @click="handleImgLinkSureBtn">确定</a-button>
            </div>
        </a-modal>
        <a-modal 
            title="添加文本链接"
            v-model="linkVisible"
            centered
            :footer="null"            
        >
            <div class="linkAddressWrap linkAddressWrap_sec linkAddressWrap_sec1">
                <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题<i>*</i>：</span>
                <a-input placeholder="请输入文本链接标题..." v-model="textLinkTitle" />
            </div>
            <div class="linkAddressWrap linkAddressWrap_sec">
                <span>链接地址<i>*</i>：</span>
                <a-input placeholder="请输入文本链接地址..." v-model="textLinkAddress" />
            </div>
            <div class="footerPrompt">
                <p><span class="iconfont icontishi"></span>可发送带有超链接的点击跳转的文字</p>
                <a-button class="greenBtn" @click="handleTextLinkSureBtn">确定</a-button>
            </div>
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
                                <a-textarea v-model="item.name" :rows="4" placeholder="请输入添加理由" />
                                <a-button class="greenBtn" size="small" @click="handleAddFriendSure">确定</a-button>
                            </div>
                        </template>
                        <div>
                            <x-avatar :class="[ item.isMe ? 'fl' : 'fr' ]" :imgUrl="item.avatar" />
                        </div>
                    </a-popover>
                    <div :class="[ item.isMe ? 'fl ml10 ' : 'fr mr10 textAlignR ','chatInfoWrap' ]">
                        <!-- <p><span v-text="item.name"></span></p> -->
                        <div :class="[ item.isMe ? 'bgSelf' : 'bgOther', 'mesContent' ]">
                            <template v-if="item.chatType === '1'">
                                <div v-html="emoji(item.content)"></div>
                            </template>
                            <template v-else-if="item.chatType === '2'">
                                <div class="sendChatWrap">
                                    <div class="personInfoWrap">
                                        <x-avatar :imgUrl="item.content.avatar" />
                                        <div>
                                            <memo-name from='1' @saveMemoName="handleSaveMemoName"></memo-name>
                                            <p>用户名：<span>{{item.content.username}}</span></p>
                                        </div>
                                    </div>
                                    <div class="partInfoWrap">
                                        <p>单位：<span>{{item.content.part}}</span></p>
                                        <p class="partIconWrap">
                                            <span v-show="item.content.friend" title="点击发送私聊消息" @click="handleChatSend" class="iconfont iconsiliao" />
                                            <span 
                                                :title="[ item.content.friend ? '点击删除好友' : '点击添加好友' ]"
                                                :class="[item.content.friend ? 'iconshanhaoyou' : 'iconjiahaoyou', 'iconfont']" 
                                                @click="showAddFriend(item.friend)" 
                                            />                                  
                                        </p>
                                    </div>
                                    <div class="addFriendWrap" v-if="showAddFriendWrap">
                                        <p>添加好友<span class="iconfont icondelete" @click="hideAddFriend"></span></p>
                                        <a-textarea v-model="addFriend+item.content.name" :rows="4" placeholder="请输入添加理由" />
                                        <a-button class="greenBtn" size="small" @click="handleAddFriendSure">确定</a-button>
                                    </div>                            
                                </div>
                            </template>
                        </div>
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
import UploadImg from '@/components/uploadImg'
export default {
    name: 'chat',
    data() {
        return {
            // value: '',
            showEmoji: false,
            chatCon: '', // 用户输入的聊天内容
            chatType: '0', // 聊天形式，0 为 普通文本， 1 为 图片类型， 2 为 文本带链接， 3 为 名片类型
            chatList: [],
            checkMemberList: [], // 接收checkMember组件传递过来的好友列表
            showAddFriendWrap: false,
            addFriend: '我是', // 添加好友理由
            cardVisible: false, // 发送名片框的显示隐藏控制
            imgVisible: false, // 发送图片框的显示隐藏控制
            linkVisible: false, // 发送链接框的显示隐藏控制
            imgLinkAddress: '', // 图片的链接地址
            textLinkAddress: '', // 文本的链接地址
            textLinkTitle: '',  // 文本链接标题
            // wsReadyState: this.ws.readyState,  // websocket连接状态， 0 未建立连接， 1 已建立连接，可通信。 2 连接正在关闭，3 连接已关闭
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
        MemoName,
        UploadImg
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
        handleSendBtnClick(item){
            // if ( this.wsReadyState === 1 ) {
                this.chatType = 0;
                var newObj = {};
                newObj.name = '本人'
                newObj.time = new Date();
                newObj.chatType = '1'; // 其他类型的chatType 都为 1

                if ( this.checkMemberList.length > 0 ) {
                    newObj.chatType = '2';
                    this.chatCon = {...item};
                }
                if ( this.textLinkAddress && this.textLinkTitle ) {
                    newObj.chatType = '1';
                    this.chatCon = `<a href="${this.textLinkAddress}" target="_blank">${this.textLinkTitle}</a>`
                }                
                newObj.content = this.chatCon;
                console.log(newObj.content);
                newObj.isMe = true;
                newObj.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                this.chatList.push(newObj);
                // websocket发送消息
                // this.ws.send(this.chatCon);
                // this.ws.onmessage = evt => {
                //     // console.log(evt);
                //     // console.log(evt.data);
                //     var sysObj = {};
                //     sysObj.name = '系统'
                //     sysObj.time = new Date();
                //     sysObj.content = evt.data;
                //     sysObj.isMe = false;
                //     sysObj.avatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                //     this.chatList.push(sysObj);                    
                // }     

                this.chatCon = '';
            // } else {
            //     this.$message.error('websocket连接不正常，请检查后重试');
            // }
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
                this.checkMemberList = arr;
                arr.map( item => {
                    console.log(item);
                    this.handleSendBtnClick(item);
                })
            }
            this.cardVisible = false;
            // this.chatType = '3';
        },
        // 添加图片链接的确定按钮的点击事件
        handleImgLinkSureBtn(){
            this.imgVisible = false;
            if ( this.imgLinkAddress ) {
                // this.chatType = '1'
            }
        },
        // 添加文本链接的确定按钮的点击事件
        handleTextLinkSureBtn(){
            // this.chatType = this.textLinkTitle && this.textLinkAddress ? '2' : '0'
            this.linkVisible = false;
            this.handleSendBtnClick();
            this.textLinkAddress = '' 
            this.textLinkTitle = '';            
        }        
    },
    created() {
        // console.log(this.ws.readyState);
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
.linkAddressWrap,.footerPrompt{
    display: flex;
    align-items: center;
    input{
        width: 400px;
        height: 28px;
    }
}
.linkAddressWrap_sec{
    input{
        width: 390px;
    }
    span{
        i{
            color: red;
        }
    }
}
.linkAddressWrap{
    margin: 20px 0 45px 0;
}
.linkAddressWrap_sec1{
    margin: 0
}
.footerPrompt{
    p{
        color: #333333;
        font-size: 14px;
        line-height: 20px;
        span{
            color: #ff8447;
            margin-right: 6px;
        }        
    }
    button{
        margin-left: auto;
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
                div{
                    &.chatInfoWrap{
                        p{
                            font-size: 12px;
                            margin-top: -7px;
                        }
                    }
                    &.mesContent{
                        max-width: 338px;
                        border: 1px solid #eaeaea;
                        border-radius: 5px;
                        padding: 9px 10px;
                        font-size: 14px;
                        color: #696865;
                        position: relative;
                        &::before {
                            content: '';
                            position: absolute;
                            top: 12px;                          
                            border-bottom: 8px solid transparent;
                            border-top: 8px solid transparent; 
                        } 
                        /deep/a{
                            text-decoration: underline;
                        } 
                        /deep/img{
                            width: 312px;
                            height: 188px;
                            &.emojiImg{
                                width: 16px;
                                height: 16px;
                            }
                            &.emojiRabbitImg{
                                width: 50px;
                                height: 50px;
                            }
                        } 
                        /deep/.sendChatWrap{
                            width: 310px;
                            height: 150px;
                            background-color: #ffffff;
                            .personInfoWrap{
                                display: flex;
                                background-color: #f5f5f5;
                                font-size: 14px;
                                color: #333333;
                                margin-bottom: 13px;
                                img{
                                    width: 38px;
                                    height: 38px;
                                    border: 1px solid #dcdcdc;
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
                    &.ml10{
                        .mesContent{
                            &::before{
                                left: -5px;
                                border-right: 8px solid #fbf6ed;
                                
                            }                      
                        }
                    } 
                    &.mr10{
                        .mesContent{
                            &::before{
                                right: -5px;
                                border-left: 8px solid #def7f0;
                            }                      
                        }
                    }                                      
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

