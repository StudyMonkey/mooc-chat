<template>
    <div class="chatTopWrap">
        <chat-list />
        <div class="chatMainWrap">
            <div class="chatTitleWrap">
                <a-icon type="message" />
                <p>圈子名称圈子名称圈子名称圈子名称圈子名称圈子名称<span>(96人)</span></p>
            </div>
            <p class="chatGroupNum">小组编号：<span>54284122</span></p>
            <div class="card-container">
                <a-tabs type="card" defaultActiveKey="chat">
                    <a-tab-pane tab="聊天" key="chat">
                        <chat-main />
                    </a-tab-pane>
                    <a-tab-pane tab="话题" key="topic" forceRender>
                        <chat-topic />
                    </a-tab-pane>
                    <a-tab-pane tab="成员" key="member">Content of Tab Pane 3</a-tab-pane>
                    <a-tab-pane tab="文件" key="file">Content of Tab Pane 4</a-tab-pane>
                    <a-tab-pane tab="公告" key="notice">Content of Tab Pane 5</a-tab-pane>
                    <a-tab-pane tab="设置" key="setting">Content of Tab Pane 6</a-tab-pane>
                </a-tabs>
            </div>            
        </div>
    </div>
</template>

<script>
import ChatList from '@/components/chatList'
import ChatMain from '@/components/chat'
import ChatTopic from '@/components/topic'
export default {
    name: 'member',
    data() {
        return {

        }
    },
    components: {
        ChatList,
        ChatMain,
        ChatTopic
    },
    methods: {
        callback (key) {
            console.log(key)
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
        }
        .chatTitleWrap{
            display: flex;
            font-size: 15px;
            background-color: #f5f5f5;
            padding: 15px 15px 0;
            i{
                margin-top: 3px;
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





