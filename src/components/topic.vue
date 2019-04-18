<template>
    <div>
        <div class="chatTopicWrap" v-if="!showChat">
            <ul>
                <li 
                    class="topicListLi" 
                    v-for="(item,index) in topicList" 
                    :key="index"
                    @click="handleTopicLiClick(item)"
                >
                    <a-icon type="message" />
                    <p class="topicTitle" v-text="item.title"></p>
                    <p class="topicOwner">创建者：<span v-text="item.owner"></span></p>
                </li>
            </ul>
            <div class="createTopicWrap">
                <span>话题名称：</span>
                <a-input v-model="createTopicName" placeholder="请输入话题名称......" />
                <a-button size="small">创建</a-button>
            </div>
        </div>
        <div v-else>
            <div class="chosedTopicWrap">
                <a-button @click="handleTopicBackBtn" size="small">返回</a-button>
                <p class="topicTitle" v-text="chosedTopicTitle"></p>
                <p class="topicOwner">创建者：<span v-text="chosedTopicOwner"></span></p>
            </div>
            <div class="topicChat">
                <chat-main />
            </div>           
        </div>        
    </div>

</template>

<script>
import ChatMain from '@/components/chat'
export default {
    name: 'topic',
    components: {
        ChatMain,
    },
    data() {
        return {
            showChat: false,
            topicList: [
                {title: '话题名称话题名称话题名称话题名称话题名称', owner: '张三三'},
                {title: '话题名称话题名称话题名称话', owner: '张三三'},
                {title: '话题名称话题名称话题名称话题名称话题名称题名称话题名称话题名称话题名称话题名称话题名称话题名称题名称话题名称话题名称话题名称话题名称话题名称话题名称题名称话题名称', owner: '张三三'},
                {title: '话题名称话题名称话题名称话题名称话题名称', owner: '刘五五'},
                {title: '话题名称话题名称话题名称话题名称话题名称题名称话题名称题名称话题名称', owner: '李四四'},
            ],
            chosedTopicTitle: '', // 所选话题标题
            chosedTopicOwner: '', // 所选话题创建者
            createTopicName: '' // 创建话题名称
        }
    },
    methods: {
        handleTopicLiClick(item) {
            this.chosedTopicTitle = item.title;
            this.chosedTopicOwner = item.owner;
            this.showChat = true;
        },
        handleTopicBackBtn(){
            this.showChat = false
        }
    },
}
</script>

<style lang="less">
.chatTopicWrap{
    width: 638px;
    height: 598px;
    margin-top: 15px;
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    position: relative;
    ul{
        .topicListLi{
            display: flex;
            padding: 0 20px;
            height: 60px;
            line-height: 60px;
            &:hover{
                background-color: #fbf6ed
            }
            .anticon-message{
                margin: 2px 7px 0 0;
                line-height: 60px;

            }
            .topicTitle{
                max-width: 460px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
            }
            .topicOwner{
                margin-left: auto;
            }
        }
    }  
    .createTopicWrap{
        padding: 35px 20px;
        background-color: #f5f5f5;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        span{
            font-size: 14px;
            line-height: 27px;
        }
        input{
            width: 466px;
            height: 27px;
            margin-right: 6px;
        }
        button{
            height: 27px;
            background-color: #70b24c;
            color: #fff;
        }
    }
}
.chosedTopicWrap{
    width: 640px;
    display: flex;
    margin: 17px 0;
    .topicTitle{
        margin-left: 10px;
        max-width: 460px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .topicOwner{
        margin-left: auto;
    }

}
.topicChat{
    .chatMainBox{
        .chatScrollArea{
            height: 386px;
        }
    }
}
</style>

