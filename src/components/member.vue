<template>
    <div>
        <div class="memberSearchWrap">
            <a-input v-model="searchVal" placeholder="请输入用户名或昵称......" />
            <a-button class="searchBtn" size="small" @click="handleSearchBtn">搜索</a-button>
            <a-button class="addMember" size="small">添加成员</a-button>
        </div>
        <div class="memberContentWrap">
            <div class="table_area">
                <table class="limitadm_table1">
                    <tbody>
                        <tr class="h50 tr1">
                            <td class="username">用户</td>
                            <td class="nickname">昵称</td>
                            <td>身份</td>
                            <td class="operate">操作</td>
                        </tr>
                        <tr v-for="(item,index) in memberList" :key="index">
                            <td class="username">
                                <span :class="identityClass(item.identityNum)"></span>
                                <span v-text="item.username"></span>
                            </td>
                            <td class="nickname" v-text="item.nickname">
                            </td>
                            <td v-text="item.identity"></td>
                            <td class="operate">
                                <a-tooltip>
                                    <template slot="title">
                                        发起私聊
                                    </template>
                                    <span class="iconfont iconsixin"></span>
                                </a-tooltip>
                                <a-tooltip>
                                    <template slot="title">
                                        转让群主给该用户
                                    </template>
                                    <span v-if="item.identityNum !== 0" class="iconfont iconyuechi"></span>
                                </a-tooltip>                           
                                <a-tooltip>
                                    <template slot="title">
                                        删除该小组成员                                       
                                    </template>  
                                    <span @click="handleDeleteMember" class="iconfont iconshanchengyuan"></span>                      
                                </a-tooltip>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="paginationWrap">
                <a-pagination showQuickJumper :defaultCurrent="1" :total="500" @change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'memberList',
    props: {
        listMember: {
            type: Array,
            required: true
        }
    },
    watch: {
        listMember(newValue, oldValue) {
            if ( newValue !== oldValue ){
                this.memberList = this.listMember
            }
        }
    },
    computed: {
        identityClass(num) {
            return function(num){
                if ( num === 0 ) {
                    return 'iconfont iconqunzhu'
                } else if ( num === 1 ) {
                    return 'iconfont iconguanliyuan'
                } else {
                    return 'pl22'
                } 
            }
        }
    },
    data() {
        return {
            memberList: [], // 成员列表数据
            searchVal: '', // input框输入的搜索内容
        }
    },
    methods: {
        // 删除小组成员事件处理
        handleDeleteMember(){
            let _this = this;
            this.$confirm({
                title: '确定删除该小组成员？',
                onOk() {
                    _this.$emit('changeMemberLoad', true);
                    setTimeout( () => {
                        _this.$emit('changeMemberLoad', false);
                        _this.$message.success('删除小组成员成功');
                    }, 1500)                  
                },
                onText: '确认',
                cancelText: '取消',
            })
        },
        // 翻页点击事件
        async handlePageChange(pageNumber) {
            this.$emit('changeMemberLoad', true);
            const res = await this.$getData('memberList', {page: pageNumber});
            this.$emit('changeMemberLoad', false);
            const { data: { data } } = res;
            this.memberList = data;         
        },
        handleSearchBtn(){
            this.$message.info('开始搜索');
        }
    },
    created () {

    },

}
</script>

<style lang="less" scoped>
.pl22{ padding-left: 22px }
.memberSearchWrap{
    display: flex;
    margin: 15px 0 5px 0;
    input{
        width: 507px;
        height: 27px;
    }
    button{
        height: 25px;
        margin-top: 1px;
        color: #ffffff;
        &.searchBtn{
            margin: 1px 6px;
            background-color: #70b24c;
        }
        &.addMember{
            background-color: #35a8eb
        }
    }
}
.memberContentWrap{
    width: 638px;
    height: 566px;
    border: 1px solid #e5e5e5;
    .limitadm_table1{
        width: 100%;
        table-layout:fixed;
        tr.h50{
            height: 50px;
            line-height: 50px;
            background-color: #f5f5f5;
            &:hover{
                background-color: #f5f5f5;
            }            
            td{
                color: #2e766e;
                font-size: 16px;
                font-weight: bold;
                &.username{
                    padding-left: 38px;
                }
                &.operate{
                    padding-right: 18px;
                    justify-content: center;
                }
            }
        }
        tr{
            &:hover{
                background-color: #fbf6ed;
            }
        }
        td{
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            &.username{
                width: 200px;
                padding-left: 20px;
                word-break:keep-all;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span.iconfont{
                    float: left;
                    margin-right: 4px;
                }
                span.iconqunzhu{
                    color: #35a8eb
                }
                span.iconguanliyuan{
                    color: #43b30d;
                }
            }
            &.nickname{
                width: 188px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break:keep-all;
            }
            &.operate{
                width: 100px;
                text-align: center;                
                padding-right: 18px;
                display: flex;
                span{
                    cursor: pointer;
                    &:hover{
                        color: #f1bd85;
                    }
                }
                span.iconsixin{
                    margin-right: auto
                }
                span.iconshanchengyuan{
                    margin-left: auto
                }
            }
        }
    }
    .paginationWrap{
        position: absolute;
        bottom: 12px;
        left: 0;
        right: 0;
        .ant-pagination{
            text-align: center;
        } 
    }
}
</style>
