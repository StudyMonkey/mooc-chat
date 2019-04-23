<template>
    <div class="chatTopWrap">
        <div v-if="quickCreateGroup">
            <chat-list @clickChosedLi="handleClickChosedLi" @quickCreateGroup="handleQuickCreateGroup" />
        </div>
        <div v-else>
            <check-member @quickCreateGroup="handleQuickCreateGroup">
                <span>勾选好友，快速创建小组</span>
            </check-member>
        </div>     
        <div class="chatMainWrap">
            <div v-if="!chosedChat" class="notClickChat">
                未点击时显示的内容
            </div>
            <div v-else>
                <div class="chatTitleWrap">
                    <span :class="[ chosedChat.groupType === 1 ? 'iconqunliao' : 'iconsiliao', 'iconfont' ]"></span>
                    <p v-text="chosedChat.title"><span></span></p>
                </div>
                <p class="chatGroupNum">小组编号：<span>54284122</span></p>
                <div class="card-container">
                    <a-tabs type="card" @change="handleTabsChange" defaultActiveKey="chat">
                        <a-tab-pane tab="聊天" key="chat">
                            <chat-main />
                        </a-tab-pane>
                        <a-tab-pane tab="话题" key="topic" forceRender>
                            <chat-topic :listTopic="topicList" />
                        </a-tab-pane>
                        <a-tab-pane tab="成员" key="member">
                            <chat-member :listMember="memberList" />
                        </a-tab-pane>
                        <a-tab-pane tab="文件" key="file">
                            <chat-file :listFile="fileList" />
                        </a-tab-pane>
                        <a-tab-pane tab="公告" key="notice">
                            <chat-notice :listNotice="noticeList"/>
                        </a-tab-pane>
                        <a-tab-pane tab="设置" key="setting">
                            <chat-set />
                        </a-tab-pane>
                    </a-tabs>
                </div> 
            </div>
           
        </div>
    </div>
</template>

<script>
import ChatList from '@/components/chatList'
import CheckMember from '@/components/checkMember'
import ChatMain from '@/components/chat'
import ChatTopic from '@/components/topic'
import ChatMember from '@/components/member'
import ChatNotice from '@/components/notice'
import ChatFile from '@/components/file'
import ChatSet from '@/components/set'
export default {
    name: 'member',
    data() {
        return {
            chosedChat: '',
            topicList: [], // 传递给话题的数组 
            memberList: [], // 传递给成员的数组
            noticeList: [], // 传递给公告的数组
            fileList: [], // 传递给文件的数组
            quickCreateGroup: true, // 点击快速创建小组切换状态
        }
    },
    components: {
        ChatList,
        CheckMember,
        ChatMain,
        ChatTopic,
        ChatMember,
        ChatNotice,
        ChatFile,
        ChatSet
    },
    methods: {
        async commonGetMethod(url, params){
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData(url, params);
            const { data: { data } } = res;
            this.$store.commit('changeShowLoad', false);
            return data;
        },
        async handleTabsChange (key) {
            console.log(key)
            if ( key === 'topic' ){
                this.topicList = await this.commonGetMethod('topicList', {});
            } else if ( key === 'member' ) {
                this.memberList = await this.commonGetMethod('memberList', {});                
            } else if ( key === 'notice' ) {
                this.noticeList = await this.commonGetMethod('noticeList', {});
            } else if ( key === 'file' ) {
                this.fileList = await this.commonGetMethod('fileList', {});
            }
        },
        // 接受chatList子组件所选择的聊天列表
        handleClickChosedLi(item){
            this.chosedChat = item;
        },
        handleQuickCreateGroup(obj){
            this.quickCreateGroup = obj
        }
    },    

}
</script>

<style lang="less">
.chatTopWrap{
    display: flex;
    border: 1px solid #c1bfba;
    .chatMainWrap{
        width: 670px;
        .notClickChat{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
        }
        .chatGroupNum{
            background-color: #f5f5f5;
            padding: 0 15px; 
            line-height: 14px;
        }
        .chatTitleWrap{
            display: flex;
            font-size: 15px;
            line-height: 14px;
            background-color: #f5f5f5;
            padding: 15px 15px 10px 15px;
            i{
                height: 20px;
                line-height: 21px;
            }
            p{
                margin-left: 4px;
            }
        }
        .card-container {
            overflow: hidden;
            .ant-tabs-bar{
                display: flex;
                justify-content: flex-end;
                background-color: #f5f5f5;
                padding-right: 15px;
                border-bottom: none;
                margin-bottom: 0;
                &::after{
                    clear: both;
                    content: "";
                    visibility: hidden;
                }
            }
            .ant-tabs.ant-tabs-card .ant-tabs-card-bar{
                .ant-tabs-tab{
                    line-height: 25px;
                    background-color: #f5f5f5;
                    &:hover{
                        background-color: #f9eedf;
                        color: #666666;
                    }
                }
                .ant-tabs-nav-container{
                    height: 27px;
                }
                .ant-tabs-tab-active{
                    background-color: #ffffff;
                    color: #666666;
                }
            } 
            .ant-tabs-tabpane{
                clear: both;
                padding-left: 15px;
            }
        }        
    }
}

.ant-tabs-bar{
    margin-bottom: 15px;
}


</style>





