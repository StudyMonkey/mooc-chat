<template>
    <div class="chatMainBox">
        <ul>
            <li v-for="(item,index) in chatList" :key="index">
                <a-avatar 
                    shape="square"
                    size="default"
                    :src="item.avatar"
                />
                <div class="chatInfoWrap">
                    <p><span v-text="item.name"></span><span v-text="item.time"></span></p>
                    <div v-text="item.content"></div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'chat',
    data() {
        return {
            chatList: [
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', content: '在么'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', content: '不在'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', content: '谈恋爱么'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', content: '不谈'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', content: '一袋米要扛几楼'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', content: '感受痛苦吧'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', content: '哈哈哈哈哈哈'}
            ]
        }
    },
}
</script>

<style lang="less" scoped>
.chatMainBox{
    width: 618px;
    height: 551px;
    padding: 12px 10px 0;
    border: 1px solid #c5c5c5;
    ul{
        li{
            width: 390px;
            display: flex;
        }
    }
}
</style>

