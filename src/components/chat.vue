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
                    <a-avatar 
                        :class="[ item.isMe ? 'fl' : 'fr' ]"
                        shape="square"
                        size="default"
                        :src="item.avatar"
                    />
                    <div :class="[ item.isMe ? 'fl ml10 ' : 'fr mr10 textAlignR ','chatInfoWrap' ]">
                        <p><span v-text="item.name"></span></p>
                        <div :class="[ item.isMe ? 'bgSelf' : 'bgOther', 'mesContent' ]" v-text="item.content"></div>
                    </div>
                </li>
            </ul>
        </div>
        <ul class="iconListWrap">
            <li>@</li>
            <li><a-icon type="smile"></a-icon></li>
            <li><a-icon type="file-jpg"></a-icon></li>
            <li><a-icon type="link"></a-icon></li>
            <li><a-icon type="folder-open"></a-icon></li>
            <li><a-icon type="idcard"></a-icon></li>
            <a-button 
                size="small" 
                @click="handleLoadMoreChat"
            >加载聊天记录</a-button>
        </ul>
        <a-textarea v-model="chatCon" placeholder="请输入......" :rows="4" />
        <div class="sendWrap fr">
            <p>按Enter发送、Ctrl+Enter换行</p>
            <a-button @click="handleSendBtnClick" size="small">发送</a-button>
        </div>
        
    </div>
</template>

<script>
import { getData } from '@/utils/utils'
import Loading from '@/components/loading'
export default {
    name: 'chat',
    data() {
        return {
            chatCon: '', // 用户输入的聊天内容
            chatList: [],
            showLoading: false,
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
            const res = await getData('chatCon', {});
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

.chatMainBox{
    width: 640px;
    .chatScrollArea{
        width: 100%;
        height: 428px;
        border: 1px solid #e5e5e5;
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
        }
        button{
            margin-top: 6px;
            margin-left: auto
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

