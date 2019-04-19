<template>
    <div class="chatTopWrap">
        <loading v-if="showLoad" />
        <chat-list />
        <div class="chatMainWrap">
            <div class="chatTitleWrap">
                <a-icon type="message" />
                <p>圈子名称圈子名称圈子名称圈子名称圈子名称圈子名称<span>(96人)</span></p>
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
                    <a-tab-pane tab="文件" key="file">Content of Tab Pane 4</a-tab-pane>
                    <a-tab-pane tab="公告" key="notice">Content of Tab Pane 5</a-tab-pane>
                    <a-tab-pane tab="设置" key="setting">Content of Tab Pane 6</a-tab-pane>
                </a-tabs>
            </div>            
        </div>
    </div>
</template>

<script>
import { getData } from '@/utils/utils'
import Loading from '@/components/loading'
import ChatList from '@/components/chatList'
import ChatMain from '@/components/chat'
import ChatTopic from '@/components/topic'
import ChatMember from '@/components/member'
export default {
    name: 'member',
    data() {
        return {
            showLoad: false,
            topicList: [], // 传递给话题的数组 
            memberList: [] // 传递给成员的数组
        }
    },
    components: {
        ChatList,
        ChatMain,
        ChatTopic,
        ChatMember,
        Loading
    },
    methods: {
        async handleTabsChange (key) {
            console.log(key)
            if ( key === 'topic' ){
                this.showLoad = true;
                const res = await getData('topicList', {});
                this.showLoad = false;
                const { data: { data } } = res;
                console.log(data);
                this.topicList = data;
            } else if ( key === 'member' ) {
                this.showLoad = true;
                const res = await getData('memberList', {});
                this.showLoad = false;
                const { data: { data } } = res;
                console.log(data);
                this.memberList = data;                
            }
        },
    },    

}
</script>

<style lang="less">
ul,p{
    margin: 0
}
.fr{ float: right; }

.chatTopWrap{
    display: flex;
    border: 1px solid #c1bfba;
    .chatMainWrap{
        width: 670px;
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
            padding: 15px 15px 0;
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

.ant-tabs-nav{
    .ant-tabs-tab-active{
        color: #024d45
    }
    .ant-tabs-ink-bar{
        background-color: #024d45
    }
    .ant-tabs-tab{
        padding: 3px 8px;
    }    
}

</style>





