<template>
    <div class="chatTopicWrap">
        <ul>
            <li class="topicListLi" v-for="(item,index) in topicList" :key="index">
                <a-icon type="message" />
                <p v-text="item.title"></p>
                <p class="topicOwner">创建者：<span v-text="item.owner"></span></p>
            </li>
        </ul>
        <chat-main v-if="showChat" />
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
                {title: '话题名称话题名称话题名称话题名称话题名称题名称话题名称', owner: '张三三'},
                {title: '话题名称话题名称话题名称话题名称话题名称', owner: '刘五五'},
                {title: '话题名称话题名称话题名称话题名称话题名称题名称话题名称题名称话题名称', owner: '李四四'},
            ]
        }
    },
}
</script>

<style lang="less" scoped>
.chatTopicWrap{
    width: 638px;
    height: 598px;
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    ul{
        .topicListLi{
            display: flex;
            padding: 0 20px;
            .topicOwner{
                margin-left: auto;
            }
        }
    }
}
</style>

