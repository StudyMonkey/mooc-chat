<template>
    <div class="addressListTopWrap">
        <div class="middleWrap">
            <div v-show="quickCreateGroup">
                <search-wrap @changeSearchVal="handleChangeSearchVal" @quickCreate="handleQuickCreateGroup" />
                <list-user @toAddressList="handleAcceptAddressList" type="addressUserList" :listUser="addressUserList" />
                <load-more @loadMoreBtnClick="handleLoadBtnClick" />            
            </div>
            <div v-show="!quickCreateGroup">
                <check-member @changeSearchVal="handleChangeSearchVal" @checkMemberSureBtn="handleCheckMemberSureBtn" @quickCreateGroup="handleQuickCreateGroup">
                    <span>勾选好友，快速创建小组</span>
                </check-member>
            </div> 
        </div>
        <div class="addressListRightWrap">
            <not-click v-if="hasChosed" />
            <div v-else>
                <div class="addressTitleWrap">
                    <x-avatar :imgUrl="oneUser.avatar" />
                    <span v-text="oneUser.username"></span>
                </div>
                <div class="addressInfoWrap">
                    <p>
                        <span>用户名：<i v-text="oneUser.username"></i></span>
                    </p>
                    <p>
                        <span>姓名：<i v-text="oneUser.memoName"></i></span>
                    </p> 
                    <p>
                        <span>单位：<i v-text="oneUser.part"></i></span>
                    </p> 
                    <div class="memoNameDiv">
                        <span>备注名：</span>
                        <memo-name @saveMemoName="handleSaveMemoName" />                       
                    </div> 
                    <div class="addressBtnWrap">
                        <a-button size="small" @click="handleIsTop" v-text="oneUser.isTop ? '取消置顶' : '置顶' "></a-button>
                        <a-button class="greenBtn" size="small" @click="handleSendMessage">发消息</a-button>    
                    </div>                                                           
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchWrap from '@/components/searchWrap'
import ListUser from '@/components/listUser'
import XAvatar from '@/components/avatar'
import MemoName from '@/components/memoName'
import LoadMore from '@/components/loadMore'
import NotClick from '@/components/notClick'
import CheckMember from '@/components/checkMember'
import { matchChangeColor, clearMatchColor } from '../utils/utils'
export default {
    name: 'member',
    data() {
        return {
            addressUserList: [],
            saveAddressUserList: [],
            hasChosed: true,
            oneUser: '',
            searchNoResult: false, // 搜索好友的结果显示
            quickCreateGroup: true
        }
    },
    components: {
        SearchWrap,
        ListUser,
        XAvatar,
        MemoName,
        LoadMore,
        NotClick,
        CheckMember
    },
    created () {
        this.commonGetAddressList(false);
    },
    methods: {
        async commonGetAddressList(obj){
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('addressUserList', {});
            const { data: { data } } = res;
            console.log(data);
            if ( obj === false ) {
                this.addressUserList = data;
            } else {
                this.addressUserList = this.addressUserList.concat(data);
            }          
            this.saveAddressUserList = this.addressUserList;
            this.$store.commit('changeShowLoad', false);            
        },

        /**
         *  加载更多子组件传递过来的布尔值
         * 传递给 commonGetAddressList 调用方法
         */
        handleLoadBtnClick(item){
            this.commonGetAddressList(item)
        },
        /*  接受listUser传递过来的选择对象 */
        handleAcceptAddressList(item) {
            this.hasChosed = false;
            this.oneUser = item;
        },
        /**
         *  公用提示显示消息方法
         */
        commonMessage(title, mes){            
            let _this = this;
            this.$confirm({
                title,
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.oneUser.isTop = !_this.oneUser.isTop;
                    _this.$message.success(mes)
                }
            })            
        },

        /* 置顶和取消置顶的点击切换方法 */
        handleIsTop(){           
            if ( this.oneUser.isTop ) {
                this.commonMessage('确认将该好友取消置顶？', '取消置顶好友成功');
            } else {
                this.commonMessage('确认将该好友置顶？', '置顶好友成功');              
            }
        },
        /**
         *  接受searchWrap子组件传递过来的搜索的值
         */
        async handleChangeSearchVal(searchVal){
            console.log(searchVal);
            if ( searchVal !== '' ) {
                clearMatchColor(this.addressUserList, 'username', 'memoName');
                console.log(this.addressUserList);
                this.searchNoResult = false;              
                this.addressUserList = matchChangeColor(this.addressUserList, searchVal, 'username', 'memoName');              
                // this.addressUserList = this.addressUserList.filter( v => v.name === searchVal);
                if ( this.addressUserList.length === 0 ) {
                    const res = await this.$getData('searchSomeMember', {});
                    console.log('搜索结果:', res);
                    if ( res.data.data ) {
                        const { data: { data } } = res;
                        this.addressUserList = data;
                    } else {
                        this.searchNoResult = true;
                    }
                }
            } else { 
                clearMatchColor(this.addressUserList, 'username', 'memoName');              
                this.addressUserList = this.saveAddressUserList;
            }
        },
        /**
         *  接收searchWrap点击创建交流小组的状态切换值
         */
        handleQuickCreateGroup(item){
            this.quickCreateGroup = item
        },
        /**
         *  接收勾选好友checkMember组件点击确定按钮传递过来的事件
         */
        handleCheckMemberSureBtn(arr){
            // 若勾选好友人数大于1，则创建小组并跳转聊天页面，否则只隐藏操作
            this.quickCreateGroup = true;
            if ( arr.length > 0 ) {
                console.log(arr);
                // 接收勾选的好友的数组，发送接口创建小组，隐藏并跳转到聊天界面               
                this.$router.push({
                    path: '/chat'
                })
            } 
        },
        /**
         * 发送消息的事件处理
         * 这里需要把这个人的id传到聊天页面
         * 让聊天界面的this.isActive等于这个id设置选中状态
         */
        handleSendMessage(){
            this.$router.push({
                path: '/chat'
            })
        },
        /**
         *  接收子组件修改备注名的点击传递事件
         */        
        handleSaveMemoName(name){
            console.log(name)
        }
    },
}
</script>

<style lang="less" scoped>
.addressListTopWrap{
    display: flex;
    .middleWrap{
        .listUserUlWrap{
            height: 600px;
        }
    }
    .addressListRightWrap{
        width: 669px;
        height: 698px;
        border: 1px solid #c1bfba;
        border-left: none;
        background-color: #ffffff;
        .addressTitleWrap{
            display: flex;
            padding: 15px 0;
            align-items: center;
            background-color: #f5f5f5;
            .ant-avatar{
                margin: 0 10px 0 15px;
            }
        }
        .addressInfoWrap{
            padding: 36px 0 0 195px;
            p,.memoNameDiv{
                font-size: 14px;
                color: #333333;
                margin-bottom: 34px; 
            }
            .memoNameDiv{
                display: flex;
            }
            .addressBtnWrap{
                .greenBtn{
                    margin-left: 30px;
                }
            }
        }

    }
}

    
</style>
