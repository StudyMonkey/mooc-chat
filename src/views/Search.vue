<template>
    <div class="searchTopWrap">
        <a-modal
            class="searchModalWrap"
            v-model="groupVisible"
            :footer="null"
        >
            <div class="modalHeaderWarap">
                <x-avatar :imgUrl="chosedGroup.groupImgUrl" />
                <div>
                    <p v-text="chosedGroup.groupName"></p>
                    <p class="groupCard">小组编号：<span v-text="chosedGroup.groupNumber"></span></p>
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
                <x-avatar :imgUrl="chosedMember.userImgUrl" />
                <div>
                    <p 
                        v-text="chosedMember.nickName ? chosedMember.nickName : chosedMember.userName"
                        :title="chosedMember.nickName ? chosedMember.nickName : chosedMember.userName"
                    ></p>
                    <p class="groupCard">用户名: <span v-text="chosedMember.userEid"></span></p>
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
                    <a-input v-model="groupNum" placeholder="请输入精确的小组编号" />
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
                <div class="groupResultWrap" v-show="searchMember === ''">
                    <ul class="groupList" v-show="groupList.length > 0">
                        <li 
                            v-for="item in groupList" 
                            :key="item.groupNumber"
                        >
                            <div class="groupInfoWrap">
                                <x-avatar :imgUrl="item.groupImgUrl" />
                                <div>
                                    <p class="overHidden" v-text="item.groupName"></p>
                                    <p>
                                        <span class="iconfont iconqunliao1"></span>
                                        <span class="colorSpan"><i v-text="item.groupMemberCount ? item.groupMemberCount : 0"></i>人</span>
                                    </p>
                                </div>
                            </div>                           
                            <p class="groupDescrition" v-text="item.groupDesc ? item.groupDesc : '这个小组管理员很懒，暂未写任何描述'"></p>
                            <div class="groupBtnWrap">
                                <p><span>小组编号：</span><span v-text="item.groupNumber "></span></p>
                                <a-button size="small" @click="handleJoinClick(item)">加入</a-button>
                            </div>  
                        </li>                       
                    </ul>
                    <x-pagination  
                        v-show="groupList.length > 0"
                        :changePage="changePage" 
                        :pageSize="groupPageSize" 
                        :total="groupTotal" 
                        @pageChange="handlePageChange" 
                    />
                    <div  v-show="groupList.length < 0">未搜索到任何有关
                        <span v-show="groupName">{{ '小组名称为'+ groupName}}</span>
                        <span v-show="groupNum">{{',小组编号为'+groupNum }}</span>的内容
                    </div>
                </div>
                <div class="MemberResultWrap" v-show="searchMember !== ''">
                    <div class="table_area" v-show="memberList.length > 0">
                        <table class="limitadm_table1">
                            <tbody>
                                <tr class="h50 tr1">
                                    <td class="username">用户名</td>
                                    <td class="name">姓名</td>
                                    <td class="part">单位</td>
                                    <td></td>
                                </tr>
                                <tr v-for="item in memberList" :key="item.id">
                                    <td class="username" v-text="item.userEid"></td>
                                    <td class="name" v-text="item.userName"></td>
                                    <td class="part" v-text="item.userDepartment"></td>
                                    <td>
                                        <a-button 
                                            :disabled="item.friend"
                                            size="small"
                                            @click="handleAddMemberClick(item)"
                                        >{{item.friend ? '已是好友': '添加好友'}}</a-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> 
                    <x-pagination  
                        v-show="memberList.length > 0" 
                        :changePage="changePage" 
                        :total="memberTotal" 
                        @pageChange="handleUserPageChange" 
                    />                   
                    <div v-show="memberList.length < 0">未搜索到任何有关
                        <span v-show="searchMember">{{'用户名为'+ searchMember}}</span>
                    </div>                    
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
            groupTotal: 0,  // 搜索小组的结果总条数
            groupPageSize: 6, // 小组的每页显示条数
            changePage: 0,   // 切换小组和用户显示时，需将 current 置为1 
            memberTotal: '', // 搜索用户的结果总条数
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
            const res = await this.$getData(url, params);
            url === '/searchuser.do' ? this.memberTotal = res.data.count : this.groupTotal = res.data.count;
            const { data: { rows } } = res;
            return rows;    
        },
        /*  点击查询用户事件处理
         *  判断用户名是否为空给出提示
         */
        async handleSearchMember() {
            if ( this.searchMember ) {
                this.memberList = await this.commonGetData('/searchuser.do', {
                    pageNo: 1,
                    name: this.searchMember,
                    myEid: this.$myEid,
                });
                this.changePage = 1;
                this.groupList = [];
                this.hasResult = false;
                this.groupNum = '';
                this.groupName = '';                
                // this.searchMember = '';
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
                this.groupList = await this.commonGetData('/searchgroup.do', {
                    pageNo: 1,
                    name: this.groupName,
                    groupNo: this.groupNum
                });
                this.changePage = 2;
                console.log(this.groupList);
                this.memberList = [];
                this.hasResult = false;
                this.searchMember = '';
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
        /*  
        *  Modal框的点击发送事件处理
        *  点击发送申请加入小组的请求
        */
        async handleSendJoinReq(){
            this.groupVisible = false;          
            const res = await this.$postData('/applygroup.do', {
                applyContent: this.joinGroupReason,  // 输入的申请理由
                groupNo: this.chosedGroup.groupNumber,  // 选择的小组编号
                userEid: this.$myEid,
            });
            const { data: { success, code, msg } } = res;
            if ( success && code === 200 ) {
                this.$message.success(msg);
                this.joinGroupReason = '';
            } else if( success && code === 300 ) {
                this.$message.warning(msg);
            } else {
                this.$message.warning('申请加入小组失败');
            }        
        },
        /*  
         *  点击添加好友的事件处理
         */
        handleAddMemberClick(item){
            this.chosedMember = item;
            this.memberVisible = true;
        },
        /**
         * 点击发送添加好友请求
         */
        async handleAddMemberReq(){
            const res = await this.$postData('/applyfriend.do', {
                applyContent: this.addMemberReason,
                userEid: this.$myEid,
                friendEid: this.chosedMember.userEid
            });          
            this.memberVisible = false;
            this.addMemberReason = '';
            if ( res.data.success === true ) {
                this.$message.success(res.data.msg);
            }                     
        },
        /**
         * 搜索小组的结果翻页点击事件
         */
        async handlePageChange(pageNumber) {
            this.groupList = await this.commonGetData('/searchgroup.do', {
                pageNo: pageNumber,
                groupNo: this.groupNum,
                name: this.groupName
            });       
        },
        /**
         * 搜索用户的结果翻页点击事件
         */        
        async handleUserPageChange(page) {
            this.memberList = await this.commonGetData('/searchuser.do', {
                pageNo: page,
                name: this.searchMember,
                myEid: this.$myEid,
            });
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

