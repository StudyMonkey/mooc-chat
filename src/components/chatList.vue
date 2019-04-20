<template>
    <div class="userListWrap">
        <loading v-if="showLoading" />
        <div class="searchWrap">
            <a-input placeholder="搜索" v-model="searchVal" ref="userNameInput">
                <a-icon slot="prefix" type="search" />
                <a-icon v-if="searchVal" slot="suffix" type="close-circle" @click="emitEmpty" />
            </a-input>
            <a-button icon="plus" />
        </div>
        <div class="mesListWrap lm_scroll">
            <ul>
                <li 
                    v-for="(item,index) in messageList" 
                    :key="index"
                    :class="isActive === index ? 'bg_active' : ''"
                    @click="handleLiClick(index)"
                >
                    <a-badge :count="item.mesNum" :dot="item.groupType === 1">
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
        <div class="loadMoreBtn" @click="handleLoadBtnClick">加载更多<a-icon type="caret-down" /></div>
    </div>    
</template>

<script>
import { getData } from '@/utils/utils'
import Loading from '@/components/loading'
export default {
    name: 'chatList',
    data() {
        return {
            searchVal: '',
            isActive: '', // li的下标，默认不选中任何
            showLoading: false, // loading状态显示
            messageList: [], // 用户列表数据
        }
    },
    components: {
        Loading,
    },
    methods: {
        // 清空搜索内容
        emitEmpty() {
            this.searchVal = ''
        },
        async handleLiClick(index){
            this.isActive = index;
            this.showLoading = true;
            const res = await getData('chatCon', {});
            this.showLoading = false;
            const { data: { data } } = res;
            this.$store.commit('addChatConList', data);
            console.log(this.$store);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */
          
        async getUserList(init){
            this.showLoading = true;
            const res = await getData('userList', {});
            this.showLoading = false
            let { data: { data } } = res;
            init ? this.messageList = this.messageList.concat(data) : this.messageList = data;
            // 存储到vuex
            this.$store.commit('addUserList', this.messageList);
        },
        // 加载更多按钮的点击事件处理
        handleLoadBtnClick(){
            this.getUserList(true)
        }
    }, 
    created () {
        this.getUserList(false)
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
        height: 600px;
        overflow-y: auto;
        overflow-x: hidden;       
        ul{
            li{
                width: 100%;
                padding: 10px;
                display: flex;
                &:hover{
                    background-color: #eaeaea;
                }
                &.bg_active{
                    background-color: #f3e2cb;
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
