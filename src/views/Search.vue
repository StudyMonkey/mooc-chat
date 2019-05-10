<template>
    <div class="searchTopWrap">
        <a-modal
            class="searchModalWrap"
            v-model="groupVisible"
            :footer="null"
        >
            <div class="modalHeaderWarap">
                <x-avatar :imgUrl="chosedGroup.avatar" />
                <div>
                    <p v-text="chosedGroup.groupTitle"></p>
                    <p class="groupCard">小组编号：<span v-text="chosedGroup.groupId"></span></p>
                </div>
            </div>
            <a-textarea v-model="joinGroupReason" placeholder="请输入申请理由..." :rows="4" />
            <a-button @click="handleSendJoinReq" size="small">发送</a-button>
        </a-modal>  
        <a-modal
            class="searchModalWrap"
            v-model="memberVisible"
            :footer="null"
        >
            <div class="modalHeaderWarap">
                <x-avatar :imgUrl="chosedMember.avatar" />
                <div>
                    <p>昵称</p>
                    <p class="groupCard">用户名：<span v-text="chosedMember.username"></span></p>
                </div>
            </div>
            <a-textarea v-model="addMemberReason" placeholder="请输入申请理由..." :rows="4" />
            <a-button @click="handleAddMemberReq" size="small">发送</a-button>
        </a-modal>              
        <div class="searchMiddleWrap middleWrap">
            <div class="searchGroup">
                <p class="searchTitle">小组:</p>
                <div>
                    <span>编号：</span>
                    <a-input v-model="groupNum" placeholder="请输入小组编号" />
                </div>
                <div>
                    <span>名称：</span>
                    <a-input v-model="groupName" placeholder="请输入小组名称" />
                </div>  
                <a-button size="small" @click="handleSearchGroup">搜索</a-button>              
            </div>
            <div class="searchMember">
                <p class="searchTitle">用户:</p>
                <div>
                    <span>用户名：</span>
                    <a-input v-model="searchMember" placeholder="请输入用户名" />
                </div>
                <a-button size="small" @click="handleSearchMember">搜索</a-button> 
            </div>

        </div>
        <div class="searchRightWrap">
            <not-click v-if="hasResult" />
            <div v-else>
                <right-title>
                    <span>搜索结果</span>
                </right-title>
                <div v-if="groupList.length > 0" class="groupResultWrap">
                    <ul class="groupList">
                        <li 
                            v-for="item in groupList" 
                            :key="item.id"
                        >
                            <div class="groupInfoWrap">
                                <x-avatar :imgUrl="item.avatar" />
                                <div>
                                    <p class="overHidden" v-text="item.groupTitle"></p>
                                    <p>
                                        <span class="iconfont iconqunliao1"></span>
                                        <span class="colorSpan"><i v-text="item.number"></i>人</span>
                                    </p>
                                </div>
                            </div>                           
                            <p class="groupDescrition" v-text="item.groupdesc"></p>
                            <div class="groupBtnWrap">
                                <p><span>小组编号：</span><span v-text="item.groupId"></span></p>
                                <a-button size="small" @click="handleJoinClick(item)">加入</a-button>
                            </div>  
                        </li>                       
                    </ul>
                    <x-pagination @pageChange="handlePageChange" />
                </div>
                <div v-if="memberList.length > 0" class="MemberResultWrap">
                    <div class="table_area">
                        <table class="limitadm_table1">
                            <tbody>
                                <tr class="h50 tr1">
                                    <td class="username">用户名</td>
                                    <td class="name">姓名</td>
                                    <td class="part">单位</td>
                                    <td></td>
                                </tr>
                                <tr v-for="item in memberList" :key="item.id">
                                    <td class="username" v-text="item.username"></td>
                                    <td class="name" v-text="item.name"></td>
                                    <td class="part" v-text="item.part"></td>
                                    <td>
                                        <a-button 
                                            size="small"
                                            @click="handleAddMemberClick(item)"
                                        >添加好友</a-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <x-pagination @pageChange="handleUserPageChange" />                   
                </div>
            </div>           
        </div>
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import RightTitle from '@/components/rightTitle'
import XPagination from '@/components/pagination'
import NotClick from '@/components/notClick'
export default {
    name: 'search',
    data() {
        return {
            groupVisible: false,  // 小组加入的modal框显示
            memberVisible: false, // 添加好友的modal框显示
            searchMember: '', // 搜索用户名输入内容
            groupList: [],  // 查询的小组列表
            memberList: [],  // 查询的用户列表
            chosedGroup: '',  // 所点击的小组对象
            chosedMember: '', // 所点击的好友对象
            joinGroupReason: '', // 申请加入小组的理由
            addMemberReason: '', // 添加好友的理由
            groupNum: '',
            groupName: '',
            hasResult: true
        }
    },
    components: {
        XAvatar,
        RightTitle,
        XPagination,
        NotClick
    },
    methods: {
        /**  通用的获取数据方法
         *   传递参数url和查询条件
         */
        async commonGetData(url, params){
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData(url, params);
            this.$store.commit('changeShowLoad', false);
            const { data: { data } } = res;
            return data;    
        },
        /*  点击查询用户事件处理
         *  判断用户名是否为空给出提示
         */
        async handleSearchMember() {
            if ( this.searchMember ) {
                this.memberList = await this.commonGetData('searchMember', {});
                this.groupList = [];
                this.hasResult = false;
                this.searchMember = '';
                this.$message.success('搜索用户成功');
            } else {
                this.$message.error('请输入需要查找的用户名');
            }
        },
        /*  点击查询小组事件处理
         *  判断小组编号和名称是否为空给出提示
         */
        async handleSearchGroup(){
            if ( this.groupNum || this.groupName ) {
                this.groupList = await this.commonGetData('groupList', {});
                this.memberList = [];
                this.hasResult = false;
                this.groupNum = '';
                this.groupName = '';
                this.$message.success('搜索小组成功');  
            } else {
                this.$message.error('请输入需要查找的小组编号或名称');
            }
        },
        /**  点击加入事件的处理
         *   modal的状态改为显示，传入点击的对象值
         */
        handleJoinClick(item){
            this.groupVisible = true;
            this.chosedGroup = item;
        },
        /*  Modal框的点击发送事件处理
        *
        */
        handleSendJoinReq(){
            this.groupVisible = false;
            this.joinGroupReason = '';
            this.$message.success('申请加入该小组的请求已发送');
        },
        /*  点击添加好友的事件处理
         *  
         */
        handleAddMemberClick(item){
            this.chosedMember = item;
            this.memberVisible = true;
        },
        handleAddMemberReq(){
            this.memberVisible = false;
            this.addMemberReason = '';
            this.$message.success('添加好友请求已发送');            
        },
        // 翻页点击事件
        async handlePageChange(pageNumber) {
            this.groupList = await this.commonGetData('groupList', {page: pageNumber})       
        },
        async handleUserPageChange(page) {
            this.memberList = await this.commonGetData('searchMember', {page});
        }        
    },
}
</script>

<style lang="less" scoped>

.searchModalWrap{
    .modalHeaderWarap{
        display: flex;
        .ant-avatar{
            margin-right: 9px;
        }
        div{
            p{
                color: #333333;
                &.groupCard{
                    font-size: 14px;
                }
            }
        }
    }
    textarea{
        resize: none;
        margin: 10px 0;
    }
    button{
        height: 25px;
        background-color: #70b24c;
        color: #ffffff;
        margin-left: 425px;
    }
    /deep/.ant-modal-body{
        padding: 0;
    }
}

.searchTopWrap{
    display: flex;
    height: 700px;
    .searchTitle{
        height: 36px;
        line-height: 36px;
        font-size: 14px;
    }
    .searchMiddleWrap{
        .searchGroup{
            height: 187px;
        }
        .searchGroup,.searchMember{
            div{
                margin-top: 20px;
                display: flex;
                span{
                    margin-left: 10px;
                }
                input{
                    width: 180px;
                    height: 28px;
                }
            }
            button{
                height: 25px;
                background-color: #70b24c;
                color: #ffffff;
                float: right;
                margin: 10px 16px 0 0;
            }
        }
        .searchMember{
            div{
                input{
                    width: 165px;
                }
            }
        }
        p{
            background-color: #e7e7e7;
            text-indent: 10px;
            color: #2e766e;
        }
    }
    .searchRightWrap{
        width: 670px;
        height: 100%;
        border: 1px solid #c1bfba;
        border-left: none;
        background-color: #ffffff;
        .searchTitle{
            text-indent: 15px;
            background-color: #f5f5f5;
            color: #666666;
        }
        .groupResultWrap{
            position: relative;
            height: 664px;
            padding: 36px 6px 14px 36px;
            .groupList{
                li{
                    width: 282px;
                    height: 158px;
                    border: 1px solid #e2e2e2;
                    background-color: #ffffff;
                    margin: 0 30px 20px 0;
                    position: relative;
                    float: left;
                    .groupInfoWrap{
                        display: flex;
                        padding: 10px 10px 9px 10px;
                        .ant-avatar{
                            margin-right: 7px;
                        }
                        div{
                            p{
                                width: 210px;
                                line-height: 20px;
                                span.colorSpan{
                                    color: #e97307;
                                    font-size: 14px;
                                }
                                span.iconfont{
                                    color: #c5c8cb;
                                    margin-right: 7px;
                                }
                            }                   
                        }
                    }
                    .groupDescrition{
                        padding: 0 10px;
                        font-size: 13px;
                        color: #7a7a7a;
                    }
                    .groupBtnWrap{
                        display: flex;
                        padding: 0 10px;
                        height: 36px;
                        align-items: center;
                        background-color: #f5f5f5;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        p{
                            font-size: 13px;
                            color: #666666;
                        }
                        button{
                            margin-left: auto;
                        }
                    }
                }
            }
        }
        .MemberResultWrap{
            width: 638px;
            height: 632px;
            border: 1px solid #e5e5e5;
            margin: 15px;
            position: relative;
            .limitadm_table1{
                tr{                  
                    &.tr1{
                        td{

                            &.username{
                                padding-left: 27px;
                            }
                        }
                    }
                    td{
                        &.username{
                            padding-left: 20px;
                            width: 172px;                         
                        }
                        &.name{
                            width: 66px;
                        }
                        &.part{
                            width: 305px;
                        }
                    }
                }
            }
        }
    }

}

</style>

