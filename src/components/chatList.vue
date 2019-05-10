<template>
    <div class="userListWrap">
        <search-wrap @changeSearchVal="handleChangeSearchVal" @quickCreate="handleQuickCreate" />
        <div :class="[showLoadMore? 'height600' : 'height628', 'mesListWrap lm_scroll']">
            <ul>
                <li 
                    v-for="item in messageList" 
                    :key="item.groupId"
                    :class="isActive === item.groupId ? 'bg_active' : ''"
                    @click="handleLiClick(item)"
                >
                    <!-- 1 小组  2 私人 -->
                    <a-badge :count="item.unReadNum" :dot="item.groupType === 1"> 
                        <x-avatar :imgUrl="item.groupIcon" />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title overHidden" v-text="item.groupName"></p>
                            <span class="iconfont iconV" v-if="item.isAuth === 1" />
                        </div>
                        <p class="time">{{$timeFormat(item.lastMsgTime)}}</p>
                    </div>
                </li>                   
            </ul> 
            <div v-show="searchNoResult">未搜索到任何用户</div>   
        </div>
        <load-more v-show="showLoadMore" @loadMoreBtnClick="handleLoadBtnClick"  />
    </div>    
</template>

<script>
import XAvatar from '@/components/avatar'
import SearchWrap from '@/components/searchWrap'
import LoadMore from '@/components/loadMore'
export default {
    name: 'chatList',
    data() {
        return {
            pageNo: 1,
            showLoadMore: true, // 默认显示加载更多，取出数据小于10条则隐藏
            isActive: '', // li的下标，默认不选中任何
            messageList: [ ], // 用户列表数据
            saveMessageList: [],  // 保存用户列表数据
            searchNoResult: false,  // 未搜索到用户时显示
            isGroup: false, // 区分群里和我加入的小组
        }
    },
    components: {
        XAvatar,
        SearchWrap,
        LoadMore
    },
    watch: {
        $route: {
            handler (n, o){
                console.log(n)
                if ( n.path === '/group' ) {
                    this.isGroup = true;
                    this.pageNo = 1;
                    this.getUserList(false);
                } else if ( n.path === '/chat' ) {
                    this.isGroup = false;
                    this.pageNo = 1;
                    this.getUserList(false);
                }
            },
            deep: true
        }
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
            const res = await this.$getData('chatCon', {});
            this.$store.commit('changeShowLoad', false);
            const { data: { data } } = res;
            this.$store.commit('addChatConList', data);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */       
        async getUserList(init){
            // console.log(this.$route.path);
            this.$store.commit('changeShowLoad', true);
            init ? this.pageNo++ : this.pageNo;
            // const res = await getData('userList', {eid: 'admin'});
            const res = await this.$getData('/leftHotGroups.do', { eid: 'ksz', pageNo: this.pageNo, isGroup: this.isGroup })
            this.$store.commit('changeShowLoad', false);
            console.log(res);
            let { data: { rows } } = res;
            if ( rows.length < 10 ) {
                this.showLoadMore = false
            }
            init ? this.messageList = this.messageList.concat(rows) : this.messageList = rows;
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
                this.messageList = this.messageList.filter( v => v.groupName === searchVal);          
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
        },
    }, 
    created () {
        this.getUserList(false);
    },   
}
</script>

<style lang="less">
.height600{ height: 600px }
.height628{ height: 628px }
.userListWrap{
    width: 250px;
    height: 698px;
    background-color: #f5f5f5;
    position: relative;
    .mesListWrap{
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
                        span.iconV{
                            color: #ff6600;
                        }
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
