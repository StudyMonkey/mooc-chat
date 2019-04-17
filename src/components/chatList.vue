<template>
    <div class="userListWrap">
        <div class="searchWrap">
            <a-input placeholder="搜索" v-model="userName" ref="userNameInput">
                <a-icon slot="prefix" type="search" />
                <a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />
            </a-input>
            <a-button icon="plus" />
        </div>
        <div class="mesListWrap">
            <ul>
                <li v-for="(item,index) in messageList" :key="index">
                    <a-badge :count="item.mesNum" dot>
                        <a-avatar
                            shape="square" 
                            size="default"
                            :src="item.avatar"
                        />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title" v-text="item.title"></p>
                            <a-icon type='github' v-if="item.official" />
                        </div>
                        <p class="time" v-text="item.time"></p>
                    </div>
                </li>                   
            </ul>         
        </div>
        <div class="loadMoreBtn">加载更多<a-icon type="caret-down" /></div>
    </div>    
</template>

<script>
export default {
    name: 'chatList',
    data() {
        return {
            userName: '',
            messageList: [
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: true, mesNum: 0},
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 0},
                {title: '圈子名称圈子', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 1},
                {title: '张三', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 2},
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 3},
                {title: '李四', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 3},
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 5},
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 5},
                {title: '圈子名称圈子名称圈子名称圈子名称', time: '2018-08-12 10:54', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', official: false, mesNum: 999}
            ]
        }
    },
    methods: {
        emitEmpty() {
            this.userName = ''
        }
    },    
}
</script>

<style lang="less">
.userListWrap{
    width: 250px;
    height: 700px;
    background-color: #f5f5f5;
    position: relative;
    .searchWrap{
        display: flex;
        padding: 22px 14px 21px 17px;
        background-color: #dddddd;
        .ant-btn{
            padding: 0 6px;
            height: 27px;
            &:hover{
                color: #ff5400
            }
        }
        .ant-input{
            width: 181px;
            height: 27px;
        }        
    }
    .mesListWrap{
        ul{
            li{
                width: 100%;
                padding: 10px;
                display: flex;
                p{
                    margin-bottom: 0;
                }
                .ant-avatar{                 
                    width: 38px;
                    height: 38px;
                    border: 1px solid #bbbbbb;
                }
                .infoWrap{
                    margin-left: 10px;
                    .titleWrap{
                        display: flex;
                        .title{
                            width: 164px;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            overflow: hidden;                       
                            color: #333333;
                            font-size: 14px; 
                        } 
                        .time{
                            font-size: 13px;
                            color: #666666;
                        }                   
                    }                    
                }
            }
        }

    }
    .loadMoreBtn{
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        color: #2e766e;
        background-color: #dddddd;
    }    
}
</style>
