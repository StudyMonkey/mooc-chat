<template>
    <div>
        <div v-if="hasClickAdd">
            <div class="memberSearchWrap">
                <a-input v-model="searchVal" placeholder="请输入用户名或昵称......" />
                <a-button class="searchBtn" size="small" @click="handleSearchBtn">搜索</a-button>
                <a-tooltip placement="bottomRight">
                    <template slot="title">
                        <span>{{ btnDisabled ? '单位学习小组请在系统后台添加小组成员' : '点击添加成员' }}</span>
                    </template>
                    <a-button class="addMember" size="small" :disabled="btnDisabled" @click="handleAddMemberShow">添加成员</a-button>
                </a-tooltip>        
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
                                            私信
                                        </template>
                                        <span class="iconfont iconsixin"></span>
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            授权为管理员
                                        </template>
                                        <span v-if="item.identityNum !== 0" class="iconfont iconyuechi"></span>
                                    </a-tooltip>                           
                                    <a-tooltip>
                                        <template slot="title">
                                            删除成员                                       
                                        </template>  
                                        <span @click="handleDeleteMember" class="iconfont iconshanchengyuan"></span>                      
                                    </a-tooltip>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <x-pagination @pageChange="handlePageChange" />
            </div>
        </div>
        <div v-else class="addMemberWrap">
            <div class="memberBtnWrap">
                <a-button @click="handleAddMemberBackBtn" size="small">返回</a-button>
                <span>添加成员</span>
            </div>
            <div class="memberTableWrap">
                <div class="addMemberSearchWrap">
                    <span>用户名：</span>
                    <a-input v-model="searchMember" placeholder="请输入搜索用户名" />
                    <a-button size="small">搜索</a-button>
                </div>
                <table class="limitadm_table1">
                    <tbody>
                        <tr class="h50 tr1">
                            <td class="checkboxTd"></td>
                            <td class="username">用户名</td>
                            <td class="name">姓名</td>
                            <td class="part">单位</td>
                        </tr>
                        <tr v-for="(item,index) in searchMemberList" :key="index">
                            <td class="checkboxTd">
                                <a-checkbox></a-checkbox>
                            </td>
                            <td class="username">
                                <span v-text="item.username"></span>
                            </td>
                            <td class="name" v-text="item.name">
                            </td>
                            <td v-text="item.part"></td>
                        </tr>
                    </tbody>
                </table> 
                <a-button>确定</a-button> 
                <!-- <div v-else>未搜索到成员信息</div>               -->
            </div>                  
        </div>        
    </div>
</template>

<script>
import XPagination from '@/components/pagination'
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
            searchMemberList: [
                { username: '43081119941024001X', name: '张三', part: '戏精学院'  }
            ], // 搜索的成员列表数据
            searchVal: '', // input框输入的搜索内容
            searchMember: '',
            btnDisabled: false,
            hasClickAdd: true, // 点击添加成员按钮
        }
    },
    components: {
        XPagination,
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
                okText: '确认',
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
        },
        /*  添加成员的按钮点击事件处理
         *  仅显示隐藏部分div
         */
        handleAddMemberShow(){
            this.hasClickAdd = false;
        },
        /*  返回按钮的点击事件处理
         *  仅显示隐藏部分div
         */        
        handleAddMemberBackBtn(){
            this.hasClickAdd = true;
        }
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
        tr{
            &.tr1{
                td{
                    &.username{
                        padding-left: 38px;
                    }
                    &.operate{
                        padding-right: 18px;
                        justify-content: center;
                    }
                }
            } 
            td{
                &.username{
                    width: 200px;
                    padding-left: 20px;
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
    }
}
.addMemberWrap{
    width: 640px;
    padding: 18px 0;
    .memberBtnWrap{
        width: 640px;
        height: 25px;
        margin-bottom: 16px;
        button{
            margin-right: 10px;
        }
        span{
            color: #333333;
            font-size: 14px;
        }
    } 
    .memberTableWrap{
        width: 638px;
        height: 554px;
        border: 1px solid #e5e5e5;
        .addMemberSearchWrap{
            display: flex;
            padding: 15px 15px 15px 19px;
            input{
                width: 490px;
                height: 26px;
                margin-right: 6px;
            }
            button{
                height: 26px;
                background-color: #70b24c;
                color: #ffffff;
            }
        }
        table{
            tr{
                td{
                    &.checkboxTd{
                        width: 20px;
                        padding: 0 21px 0 15px;
                    }
                    &.username{
                        width: 175px;
                    }
                    &.name{
                        width: 85px;
                    }
                    &.part{
                        width: 300px;
                    }
                }
            }
        }
    }
}
</style>
