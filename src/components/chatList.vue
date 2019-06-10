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
                    <a-badge :count="item.unReadNum" :dot="item.groupType === 1 && item.unReadNumber > 0"> 
                        <x-avatar :imgUrl="item.avatar" />
                    </a-badge>
                    <div class="infoWrap">
                        <div class="titleWrap">
                            <p class="title overHidden" :title="item.name" v-html="item.name"></p>
                            <span class="iconfont iconV" v-if="item.official === 1" />
                        </div>
                        <p class="time" v-show="inputSearchVal === ''">{{$timeFormat(item.lastMsgTime)}}</p>
                        <!-- <p v-show="inputSearchVal !== ''">备注名</p> -->
                    </div>
                </li>                   
            </ul> 
            <div class="searchNoResult" v-show="searchNoResult">
                <span class="searchBg iconfont iconsousuo-copy"></span>
                <div>
                    <p>未匹配到任何{{ $route.path === '/chat' ? '用户' : '小组' }}</p>
                    <p class="overHidden">搜索内容:<span>{{inputSearchVal}}</span></p>
                </div>
            </div>  
        </div>
        <load-more v-show="showLoadMore" @loadMoreBtnClick="handleLoadBtnClick"  />
    </div>    
</template>

<script>
import XAvatar from '@/components/avatar'
import SearchWrap from '@/components/searchWrap'
import LoadMore from '@/components/loadMore'
import { matchChangeColor, clearMatchColor } from '@/utils/utils'
export default {
    name: 'chatList',
    data() {
        return {
            pageNo: 1,
            showLoadMore: true, // 默认显示加载更多，取出数据小于10条则隐藏
            isActive: '', // li的下标，默认不选中任何
            messageList: [], // 用户列表数据
            saveMessageList: [],  // 保存用户列表数据
            searchNoResult: false,  // 未搜索到用户时显示
            inputSearchVal: '', // 接收searchWrap组件的搜索值
            isGroup: false, // 区分聊天列表和我加入的小组
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
            this.isActive = item.groupId;
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('/chat/detail.do', {
                groupId: item.groupId,
                chatEid: item.chatEid
            });
            this.$store.commit('changeShowLoad', false);
            const { data: { obj } } = res;
            this.$store.commit('handleChosedLi', item);  // 将所选中的左侧列表存到vuex里面，还有其他的组件需要用到
            this.$emit('clickChosedLi', obj, item);
            this.$store.commit('addChatConList', obj.chatList);
        },
        /** 获取用户列表数据方法
         *  init为布尔值，初始化请求为false，加载更多按钮点击为true
         */       
        async getUserList(init){
            this.$store.commit('changeShowLoad', true);
            init ? this.pageNo++ : this.pageNo;
            // 由通讯录好友点到我加入的小组时，isGroup为false请求到了聊天列表的数据
            this.isGroup = this.$route.path === '/group' ? true : false;
            const res = await this.$getData('/leftHotGroups.do', { eid: this.$myEid, pageNo: this.pageNo, isGroup: this.isGroup })
            this.$store.commit('changeShowLoad', false);
            console.log(res);
            let { data: { rows } } = res;
            if ( rows.length < res.data.count ) {
                this.showLoadMore = false
            } else {
                this.showLoadMore = true
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
         *  接受searchWrap子组件传递过来的搜索的值进行搜索匹配
         *  走接口查询
         *  接口也没查询到任何数据的话，最后显示未搜索到的结果
         */
        async handleChangeSearchVal(searchVal){
            console.log(searchVal);
            this.inputSearchVal = searchVal;
            if ( searchVal !== '' ) {
                /**
                 * 每次修改都需要清空一下可能存在的span标签
                 */
                clearMatchColor(this.messageList, 'name');
                this.searchNoResult = false;

                let isGroup = this.$route.path === '/chat' ? false : true;
                this.$store.commit('changeShowLoad', true);
                const res = await this.$getData('/leftHotGroups.do', {
                    eid: this.$myEid,
                    name: searchVal,
                    pageNo: 1,
                    isGroup
                });
                const { data: { rows } } = res;
                this.$store.commit('changeShowLoad', false);
                if ( rows.length > 0 ) {
                    this.messageList = matchChangeColor(rows, searchVal, 'name');
                } else {
                    this.searchNoResult = true;
                }
            } else {
                clearMatchColor(this.messageList, 'name');
                this.messageList = this.saveMessageList;
                this.searchNoResult = false;
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
                            .searchText{
                                color: red;
                            }
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
