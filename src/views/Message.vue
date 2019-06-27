<template>
    <div class="messagePageWrap">
        <a-tabs size="small" type="card" defaultActiveKey="group" @change="handleTabsChange">
            <a-tab-pane tab="小组消息" key="group">
                <div class="table_area">
                    <table class="limitadm_table1 messageGroupTable">
                        <tbody>
                            <tr class="h50 tr1">
                                <td class="username">用户名</td>
                                <td class="name">姓名</td>
                                <td class="part">单位</td>
                                <td class="joinGroup">申请加入的群</td>
                                <td class="joinReason">申请理由</td>
                                <td class="time">申请时间</td>
                                <td class="operate">处理方法</td>
                            </tr>
                            <tr v-for="(item,index) in groupMesList" :key="index">
                                <td class="username" v-text="item.userEid"></td>
                                <td class="name" v-text="item.userName"></td>
                                <td class="part" v-text="item.deptName"></td>
                                <td class="joinGroup" v-text="item.groupName"></td>
                                <td 
                                    class="joinReason" 
                                    v-text="item.applyContent ? item.applyContent : '未填写入群理由'"
                                ></td>
                                <td class="time">{{$timeFormat(item.applyTime)}}</td>
                                <td class="operate">
                                    <a-button 
                                        class="sureBtn" 
                                        size="small"
                                        @click="handleGroupSureBtnClick(item)"
                                    >同意</a-button>
                                    <a-button 
                                        class="cancelBtn" 
                                        size="small"
                                        @click="handleGroupCancelBtnClick(item)"
                                    >拒绝</a-button>                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                
            </a-tab-pane>
            <a-tab-pane tab="个人消息" key="person" forceRender>
                <div class="table_area">
                    <table class="limitadm_table1 messageGroupTable messagePersonTable">
                        <tbody>
                            <tr class="h50 tr1">
                                <td class="username">用户名</td>
                                <td class="name">姓名</td>
                                <td class="part">单位</td>
                                <td class="joinReason">申请理由</td>
                                <td class="time">申请时间</td>
                                <td class="operate">处理方法</td>
                            </tr>
                            <tr v-for="(item,index) in personMesList" :key="index">
                                <td class="username" v-text="item.userEid"></td>
                                <td class="name" v-text="item.userName"></td>
                                <td class="part" v-text="item.deptName"></td>
                                <td class="joinReason" v-text="item.applyContent"></td>
                                <td class="time">{{$timeFormat(item.applyTime)}}</td>
                                <td class="operate">
                                    <a-button 
                                        class="sureBtn" 
                                        size="small"
                                        @click="handleSureBtnClick(item)"
                                    >同意</a-button>
                                    <a-button 
                                        class="cancelBtn" 
                                        size="small"
                                        @click="handleCancelBtnClick(item)"
                                    >拒绝</a-button>                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                 
            </a-tab-pane>
            <a-tab-pane tab="系统消息" key="systerm">
                <div class="table_area systermTableArea">
                    <table class="limitadm_table1">
                        <tbody>
                            <tr class="h50 tr1">
                                <td class="username">类型</td>
                                <td class="name">时间</td>
                                <td style="width:500px;" class="part">事件</td>
                            </tr>  
                            <tr v-for="(item,index) in systermMesList" :key="index">
                                <td>{{item.noticeTitle}}</td>
                                <td>{{item.noticeTime}}</td>
                                <td>{{item.noticeContent}}</td>
                            </tr>                          
                        </tbody>
                    </table>
                </div>
                <x-pagination 
                    v-show =" systermTotal > 10 " 
                    :total="systermTotal" 
                    @pageChange="handlePageChange" 
                />
            </a-tab-pane>
        </a-tabs>       
    </div>
</template>

<script>
import XPagination from '@/components/pagination'
export default {
    name: 'message',
    components: {
        XPagination
    },
    methods: {
        async commonGetMessageList(tab){
            let url = tab === 'group' ? '/messagegroup.do' : '/messageuser.do';
            const res = await this.$getData(url, {
                eid: this.$myEid
            }); 
            const { data: { rows } } = res; 
            if ( tab === 'group' ) {
                this.groupMesList = rows;
            } else {
                this.personMesList = rows;
            } 
        },
        /**  相同的请求群组申请列表的方法
         *   调用了vuex里面的changeShowLoad方法，改变遮蔽层显示隐藏
         */
        async handleTabsChange(key) {
            console.log(key);
            if ( key === 'group' ) {
                this.commonGetMessageList(key);
            } else if ( key === 'person'  ) {
                this.commonGetMessageList(key);
            } else if ( key === 'systerm' ) {
                this.sysPageNo = 1;
                this.commonGetSystermList(this.sysPageNo);
            } 
        },
        /**
         *  共同的获取系统消息列表的方法
         */
        async commonGetSystermList(pageNo){
            const res = await this.$getData('/sys/systemNoticeList.action', {
                pageNo,
                eid: this.$myEid
            });
            const { data: { rows,total } } = res;
            this.systermMesList = rows;
            this.systermTotal = total;            
        },
        /**
         *  系统消息的分页事件处理
         */
        handlePageChange(pageNo){
            this.sysPageNo = pageNo;
            this.commonGetSystermList(this.sysPageNo);
        },
        /**
         *  加入小组的同意拒绝按钮事件处理
         */        
        async commonHandleJoinGroup(item, type){
            const res = await this.$postData('/operatejoingroup.do', {
                userEid: item.userEid,
                userName: item.userName,
                applyId: item.applyId,
                groupNo: item.groupNo,
                acceptEid: this.$myEid,
                type
            });
            console.log(res);
            if ( res.data.success ) {
                this.$message.success('操作成功');
            }
            this.commonGetMessageList('group');          
        },
        /**
         *  同意按钮点击事件
         */
        handleGroupSureBtnClick(item){
            console.log(item);
            this.commonHandleJoinGroup(item, "1");
        },
        /**
         *  拒绝按钮点击事件
         */        
        handleGroupCancelBtnClick(item){
            let _this = this;
            this.$confirm({
                title: '确定拒绝此人加入该学习小组？',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.commonHandleJoinGroup(item, '0');
                }
            })            
        },        
        /**
         *  个人消息的同意拒绝按钮事件共同处理
         */        
        async commonHandlePersonMes(item, type){
            const res = await this.$postData('/operatefriend.do', {
                userEid: item.userEid,
                userName: item.userName,
                applyId: item.applyId,
                acceptEid: this.$myEid,
                optype: type
            });
            console.log(res);
            if ( res.data.success ) {
                this.$message.success('操作成功');
            }
            this.commonGetMessageList('person');
            // return res.data.success;            
        },        

        /** 
         *  同意按钮的事件处理
         */
        handleSureBtnClick(item){
            this.commonHandlePersonMes(item, 'agree');

        },
        /** 
         *  拒绝按钮的事件处理
         */
        handleCancelBtnClick(item){
            let _this = this;
            this.$confirm({
                title: '确定拒绝添加此人为好友？',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.commonHandlePersonMes(item, 'refuse');
                }
            })
        }        
    },
    data() {
        return {
            groupMesList: [],
            personMesList: [],
            systermMesList: [],  // 系统消息的列表
            sysPageNo: 1,  //  系统消息的分页
            systermTotal: 1  //  系统消息的总数
        }
    },
    created () {
        this.commonGetMessageList('group');
    },
}
</script>

<style lang="less">
.messagePageWrap{
    height: 700px;
    background-color: #ffffff;
    .ant-tabs{
        width: 920px;
        height: 700px;
        .ant-tabs-nav-container{
            background-color: #f5f5f5;
            padding-left: 12px;
        }
        .ant-tabs-bar{
            margin-bottom: 0;
        }
        .ant-tabs-tab{
            height: 35px;
            line-height: 35px !important;
            margin-top: 5px !important;
        }
    }
    .messageGroupTable{
        tr{
            background-color: #ffffff;
            &:hover{
                background-color: #fbf6ed;
            }
            &.tr1{
                &:hover{
                    background-color: #ffffff;
                }
            }
            td{
                &.username{
                    padding-left: 16px;
                    width: 105px;
                }
                &.name{
                    width: 70px;
                }
                &.part{
                    width: 200px;
                }
                &.joinGroup{
                    width: 170px;
                }
                &.reason{
                    width: 130px;
                }
                &.time{
                    text-align: center;
                    width: 100px;
                    padding-right: 20px;
                }
                &.operate{
                    width: 114px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    button{
                        height: 26px;
                        color: #333333;
                        &.sureBtn{
                            margin-right: auto;
                        }
                        &.cancelBtn{
                            margin-left: auto;
                        }
                    }
                }
            }
        }

    }
    .messagePersonTable{
        tr{
            td{
                &.username{
                    width: 178px;
                }
                &.name{
                    width: 90px;
                }
                &.part{
                    width: 200px;
                }
                &.joinReason{
                    width: 215px;
                }
            }
        }
    }
    .systermTableArea{
        padding-left: 10px;
    }
}


</style>

