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
                            <p class="title overHidden" v-html="item.username"></p>
                            <span class="iconfont iconV" v-if="item.official"></span>
                        </div>
                        <p v-show="inputSearchVal === ''" class="time" v-text="item.time"></p>
                        <p v-show="inputSearchVal !== ''" v-html="item.memoName"></p>
                    </div>
                </li>                   
            </ul> 
            <div class="searchNoResult" v-show="searchNoResult">
                <span class="searchBg iconfont iconsousuo-copy"></span>
                <div>
                    <p>未匹配到任何用户</p>
                    <p class="overHidden">搜索内容:<span>{{inputSearchVal}}</span></p>
                </div>
            </div>   
        </div>
        <load-more @loadMoreBtnClick="handleLoadBtnClick"  />
    </div>    
</template>

<script>
import { getData, matchChangeColor, clearMatchColor } from '@/utils/utils'
import XAvatar from '@/components/avatar'
import SearchWrap from '@/components/searchWrap'
import LoadMore from '@/components/loadMore'
export default {
    name: 'chatList',
    data() {
        return {
            isActive: '', // li的下标，默认不选中任何
            messageList: [], // 用户列表数据
            saveMessageList: [],  // 保存用户列表数据
            searchNoResult: false,  // 未搜索到用户时显示
            inputSearchVal: '', // searchWrap组件的搜索值接收
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
            this.$store.commit('handleChosedLi', item);
            this.$emit('clickChosedLi', item);
            this.isActive = item.guid;
            this.$store.commit('changeShowLoad', true);
            const res = await getData('chatCon', {});
            this.$store.commit('changeShowLoad', false);
            const { data: { data } } = res;
            this.$store.commit('addChatConList', data);
            console.log(this.$store);
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
            this.inputSearchVal = searchVal;
            if ( searchVal !== '' ) {
/*                 let replaceReg_first = new RegExp('<span class="searchText">(.*?)<\/span>', 'g');
                for ( let i = 0 ; i < this.messageList.length; i++ ) {
                    this.messageList[i].username = this.messageList[i].username.replace(replaceReg_first, '$1');
                    this.messageList[i].memoName = this.messageList[i].memoName.replace(replaceReg_first, '$1');
                } */
                clearMatchColor(this.messageList, 'username', 'memoName');
                console.log(this.messageList);
                this.searchNoResult = false;             
                this.messageList = matchChangeColor(this.messageList, searchVal, 'username', 'memoName');
                console.log(this.messageList);
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
                this.searchNoResult = false;              
/*                 let replaceReg = new RegExp('<span class="searchText">(.*?)<\/span>', 'g');
                for ( let i = 0 ; i < this.saveMessageList.length; i++ ) {
                    this.saveMessageList[i].username = this.saveMessageList[i].username.replace(replaceReg, '$1');
                    this.saveMessageList[i].memoName = this.saveMessageList[i].memoName.replace(replaceReg, '$1');
                } */
                clearMatchColor(this.messageList, 'username', 'memoName');
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
        .searchNoResult{
            display: flex;
            padding: 10px;
            .searchBg{
                display: inline-block;
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                color: #ffffff;
                background-color: #70b24c;
                margin-right: 10px;
            }
            div{
                p.overHidden{
                    width: 170px;
                }
            }
        }
    }
}
</style>
