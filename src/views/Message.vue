<template>
    <div class="messagePageWrap">
        <a-tabs defaultActiveKey="group" @change="handleTabsChange">
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
                                <td class="username" v-text="item.username"></td>
                                <td class="name" v-text="item.name"></td>
                                <td class="part" v-text="item.part"></td>
                                <td class="joinGroup" v-text="item.group"></td>
                                <td class="joinReason" v-text="item.reason"></td>
                                <td class="time" v-text="item.time"></td>
                                <td class="operate">
                                    <a-button 
                                        class="sureBtn" 
                                        size="small"
                                        @click="handleSureBtnClick"
                                    >同意</a-button>
                                    <a-button 
                                        class="cancelBtn" 
                                        size="small"
                                        @click="handleCancelBtnClick"
                                    >拒绝</a-button>                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                
            </a-tab-pane>
            <a-tab-pane tab="个人申请" key="person" forceRender>
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
                            <tr v-for="(item,index) in groupMesList" :key="index">
                                <td class="username" v-text="item.username"></td>
                                <td class="name" v-text="item.name"></td>
                                <td class="part" v-text="item.part"></td>
                                <td class="joinReason" v-text="item.reason"></td>
                                <td class="time" v-text="item.time"></td>
                                <td class="operate">
                                    <a-button 
                                        class="sureBtn" 
                                        size="small"
                                        @click="handleSureBtnClick"
                                    >同意</a-button>
                                    <a-button 
                                        class="cancelBtn" 
                                        size="small"
                                        @click="handleCancelBtnClick"
                                    >拒绝</a-button>                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>                 
            </a-tab-pane>
            <a-tab-pane tab="系统消息" key="systerm">Content of Tab Pane 3</a-tab-pane>
        </a-tabs>       
    </div>
</template>

<script>
export default {
    name: 'message',
    methods: {
        /**  相同的请求群组申请列表的方法
         *   调用了vuex里面的changeShowLoad方法，改变遮蔽层显示隐藏
         */
        async commonGetGroupMesList(){
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('groupMesList', {});
            const { data: { data } } = res;
            this.groupMesList = data;
            this.$store.commit('changeShowLoad', false);
        },
        handleTabsChange(key) {
            console.log(key)
        },
        /** 点击同意按钮的事件处理
         * 
         */
        handleSureBtnClick(){
            this.commonGetGroupMesList();
            this.$message.success('同意加入小组成功');
        },
        /** 点击拒绝按钮的事件处理
         * 
         */
        handleCancelBtnClick(){
            let _this = this;
            this.$confirm({
                title: '确定拒绝此人加入该学习小组？',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.$message.success('成功拒绝此人加入学习小组');
                    _this.commonGetGroupMesList();
                }
            })
        }        
    },
    data() {
        return {
            groupMesList: [ ],
        }
    },
    created () {
        this.commonGetGroupMesList();
    },
}
</script>

<style lang="less">
.messagePageWrap{
    height: 700px;
    background-color: #ffffff;
    .ant-tabs{
        width: 920px;
        .ant-tabs-nav-container{
            background-color: #f5f5f5;
            padding-left: 12px;
        }
        .ant-tabs-bar{
            margin-bottom: 0;
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
        td{
            &.username{
                width: 178px;
            }
            &.name{
                width: 90px;
            }
            &.part{
                width: 304px;
            }
        }
    }
}


</style>

