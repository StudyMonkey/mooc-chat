<template>
    <div class="chatMainBox">
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
                        <p><span v-text="item.name"></span><span v-text="item.time"></span></p>
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
        </ul>
        <a-textarea placeholder="Basic usage" :rows="4" />
    </div>
</template>

<script>
export default {
    name: 'chat',
    data() {
        return {
            chatList: [
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', isMe: true, content: '在么'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', isMe: false, content: '不在'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', isMe: true, content: '谈恋爱么'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', isMe: true, content: '不谈'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', isMe: false, content: '一袋米要扛几楼'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '李四', time: '23:58', isMe: false, content: '感受痛苦吧'},
                {avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', name: '张三', time: '23:58', isMe: true, content: '哈哈哈哈哈哈'}
            ]
        }
    },
}
</script>

<style lang="less" scoped>
.mr10{ margin-right: 10px; }
.ml10{ margin-left: 10px; }
.bgSelf{ background-color: #fbf6ed }
.bgOther{ background-color: #def7f0 }
.textAlignR{ text-align: right }
.chatMainBox{
    width: 640px;
    height: 565px;  
    .chatScrollArea{
        width: 100%;
        height: 428px;
        border: 1px solid #e5e5e5;
        padding: 12px 10px 0 10px;
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
                        font-size: 14px;
                        margin-top: -7px;
                        margin-bottom: 9px;
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
    }
}
</style>

