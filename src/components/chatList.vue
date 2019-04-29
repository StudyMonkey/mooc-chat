<template>
    <div class="userListWrap">
        <search-wrap @changeSearchVal="handleChangeSearchVal" @quickCreate="handleQuickCreate" />
        <div class="mesListWrap lm_scroll">
            <ul>
                <li 
                    v-for="item in messageList" 
                    :key="item.guid"
                    :class="isActive === item.guid ? 'bg_active' : ''"
                    @click="handleLiClick(item)"
                >
                    <a-badge :count="item.mesNum" :dot="item.groupType === 1">
                        <x-avatar :imgUrl="item.avatar" />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title overHidden" v-text="item.username"></p>
                            <a-icon type='github' v-if="item.official" />
                        </div>
                        <p class="time" v-text="item.time"></p>
                    </div>
                </li>                   
            </ul> 
            <div v-show="searchNoResult">未搜索到任何用户</div>   
        </div>
        <load-more @loadMoreBtnClick="handleLoadBtnClick"  />
    </div>    
</template>

<script>
import { getData } from '@/utils/utils'
import XAvatar from '@/components/avatar'
import SearchWrap from '@/components/searchWrap'
import LoadMore from '@/components/loadMore'
export default {
    name: 'chatList',
    data() {
        return {
            isActive: '', // li的下标，默认不选中任何
            messageList: [
                // { guid: 'dfsdfwerwerwer324234', avatar: '../assets/logo.png', username: '张三', official: false, time: '2018-05-12 09:38' },
                // { guid: 'dfsdfwerwerwer487878', avatar: '@/assets/logo.png', username: '李四', official: false, time: '2018-05-12 09:38' },
                // { guid: 'dfsdfwerwerwerwerwer', avatar: '@/assets/logo.png', username: '王五', official: false, time: '2018-05-12 09:38' },
                // { guid: 'dfsdfwerwerwer567657', avatar: '@/assets/logo.png', username: '赵六', official: false, time: '2018-05-12 09:38' },
                // { guid: 'dfsdfwerwerwer978978', avatar: '@/assets/logo.png', username: '张七', official: false, time: '2018-05-12 09:38' },
                // { guid: 'dfsdfwerwerwer098089', avatar: '@/assets/logo.png', username: '刘八', official: false, time: '2018-05-12 09:38' }
            ], // 用户列表数据
            saveMessageList: [],  // 保存用户列表数据
            searchNoResult: false,  // 未搜索到用户时显示
        }
    },
    components: {
        XAvatar,
        SearchWrap,
        LoadMore
    },
    methods: {
        /**
         * li的点击处理事件
         * 将点击的数据对象传递到父组件
         * 通过vuex改变Loading的状态
         */
        async handleLiClick(item){
            this.$emit('clickChosedLi', item);
            this.isActive = item.guid;
            this.$store.commit('changeShowLoad', true);
            const res = await getData('chatCon', {});
            this.$store.commit('changeShowLoad', false);
            const { data: { data } } = res;
            this.$store.commit('addChatConList', data);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */       
        async getUserList(init){
            this.$store.commit('changeShowLoad', true);
            const res = await getData('userList', {eid: 'admin'});
            this.$store.commit('changeShowLoad', false);
            let { data: { data } } = res;
            init ? this.messageList = this.messageList.concat(data) : this.messageList = data;
            this.saveMessageList = this.messageList;
            console.log(this.saveMessageList);
            // 存储到vuex
            this.$store.commit('addUserList', this.messageList);
        },
        // 加载更多按钮的点击事件处理
        handleLoadBtnClick(item){
            this.getUserList(item)
        },
        /**
         * 接收searchWrap子组件传递过来的值
         */
        handleQuickCreate(obj){
            this.$emit('quickCreateGroup', obj);
        },
        /**
         *  接受searchWrap子组件传递过来的搜索的值
         */
        async handleChangeSearchVal(searchVal){
            console.log(searchVal);
            if ( searchVal !== '' ) {
                this.searchNoResult = false;
                this.messageList = this.messageList.filter( v => v.username === searchVal);          
                if ( this.messageList.length === 0 ) {
                    const res = await this.$getData('searchSomeMember', {});
                    console.log('搜索结果:', res);
                    if ( res.data.data ) {
                        const { data: { data } } = res;
                        this.messageList = data;
                    } else {
                        this.searchNoResult = true;
                    }
                }
            } else {
                this.messageList = this.saveMessageList;
            }
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
    height: 698px;
    background-color: #f5f5f5;
    position: relative;
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
                .infoWrap{
                    margin-left: 10px;
                    .titleWrap{
                        display: flex;
                        .title{
                            width: 164px;                      
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
}
</style>
