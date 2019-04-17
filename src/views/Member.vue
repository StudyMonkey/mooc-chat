<template>
    <div class="chatTopWrap">
        <chat-list />
        <div class="chatMainWrap">
            <div class="chatTitleWrap">
                <a-icon type="message" />
                <p>圈子名称圈子名称圈子名称圈子名称圈子名称圈子名称<span>(96人)</span></p>
            </div>
            <p>小组编号：<span>54284122</span></p>
            <a-tabs defaultActiveKey="1" @change="callback">
                <a-tab-pane tab="聊天" key="1">
                    <chat-main />
                </a-tab-pane>
                <a-tab-pane tab="话题" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
                <a-tab-pane tab="成员" key="3">Content of Tab Pane 3</a-tab-pane>
                <a-tab-pane tab="文件" key="4">Content of Tab Pane 4</a-tab-pane>
                <a-tab-pane tab="公告" key="5">Content of Tab Pane 5</a-tab-pane>
                <a-tab-pane tab="设置" key="6">Content of Tab Pane 6</a-tab-pane>
            </a-tabs>            
        </div>
    </div>
</template>

<script>
import ChatList from '@/components/chatList'
import ChatMain from '@/components/chat'
export default {
    name: 'member',
    data() {
        return {

        }
    },
    components: {
        ChatList,
        ChatMain
    },
    methods: {
        callback (key) {
            console.log(key)
        },
    },    

}
</script>

<style lang="less">
p{
    margin-bottom: 0
}
.chatTopWrap{
    display: flex;
    border: 1px solid #c1bfba;
    .chatMainWrap{
        width: 670px;
        padding: 15px;
        .chatTitleWrap{
            display: flex;
            i{
                line-height: 21px;
            }
            p{
                margin-left: 4px;
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
}

</style>





