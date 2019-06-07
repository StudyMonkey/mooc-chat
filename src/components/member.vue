<template>
    <div>
        <div v-if="hasClickAdd">
            <div class="memberSearchWrap">
                <a-input v-model="searchVal" placeholder="请输入用户名或昵称......" />
                <a-button class="searchBtn greenBtn" size="small" @click="handleSearchBtn">搜索</a-button>
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
                                    <span :class="identityClass(item.memberType)"></span>
                                    <span v-text="item.memberEid"></span>
                                </td>
                                <td class="nickname" v-text="item.memberNick">
                                </td>
                                <td v-text="identityWord(item.memberType)"></td>
                                <td class="operate">
                                    <a-tooltip>
                                        <template slot="title">
                                            私信
                                        </template>
                                        <span 
                                            v-if="item.memberEid !== $myEid"
                                            class="iconfont iconliaotian"
                                        ></span>
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            授权为管理员
                                        </template>
                                        <span 
                                            v-if="item.memberType !== 3" 
                                            class="iconfont iconyuechi1"
                                            @click="handleUpdateAdmin(item)"
                                        ></span>
                                    </a-tooltip>                           
                                    <a-tooltip>
                                        <template slot="title">
                                            删除成员                                       
                                        </template>  
                                        <span 
                                            v-if="item.memberEid !== $myEid"
                                            @click="handleDeleteMember(item)" 
                                            class="iconfont iconshanchengyuan"
                                        ></span>                      
                                    </a-tooltip>
                                    
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <x-pagination 
                    v-show =" total > 10 " 
                    :total="total" 
                    @pageChange="handlePageChange" 
                />
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
                    <a-button size="small" class="greenBtn" @click="handleSearchAllMember">搜索</a-button>
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
                                <a-checkbox @change="handleAddMember(item)"></a-checkbox>
                            </td>
                            <td class="username">
                                <span v-text="item.userEid"></span>
                            </td>
                            <td class="name" v-text="item.userName">
                            </td>
                            <td v-text="item.userDepartment"></td>
                        </tr>
                    </tbody>
                </table> 
                <a-button size="small" class="greenBtn sureBtn" @click="handleAddMemberSureBtn">确定</a-button> 
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
        },
        chosedLi: {
            type: Object,
            required: true
        },
        total: {
            type: Number,
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
                if ( num === 3 ) {
                    return 'iconfont iconqunzhu'
                } else if ( num === 2 ) {
                    return 'iconfont iconguanliyuan'
                } else {
                    return 'pl22'
                } 
            }
        },
        identityWord(num) {
            return function(num){
                if ( num === 3 ) {
                    return '管理员'
                } else if ( num === '2' ) {
                    return '组长'
                } else {
                    return '成员'
                }
            }
        }
    },
    data() {
        return {
            memberList: [], // 成员列表数据
            searchMemberList: [], // 搜索的成员列表数据
            searchVal: '', // input框输入的搜索内容
            searchMember: '',
            btnDisabled: false,
            hasClickAdd: true, // 点击添加成员按钮
            pageNo: 1,  // 翻页数，默认为1
            memberArray: [],  // 所勾选的用户保存的数组
        }
    },
    components: {
        XPagination,
    },
    methods: {
        // 删除小组成员事件处理
        handleDeleteMember(item){
            let _this = this;
            this.$confirm({
                title: '确定删除该小组成员？',
                async onOk() {
                    _this.$store.commit('changeShowLoad', true);
                    const res = await _this.$getData('/member/deleteMember.action', {
                        id: item.id
                    })
                    console.log(res);
                    _this.$store.commit('changeShowLoad', false);
                    if ( res.data.success ) {
                        _this.$message.success('删除小组成员成功'); 
                    }                                 
                },
                okText: '确认',
                cancelText: '取消',
            })
        },
        /**
         * 搜索和翻页的相同请求事件处理
         */
        async commonGetMembetList(){
            this.$store.commit('changeShowLoad', true);
            const res = await this.$getData('/member/memberList.action', {
                memberSearchWord: this.searchVal,
                groupId: this.chosedLi.groupId,
                pageNo: this.pageNo
            });
            this.$store.commit('changeShowLoad', false);
            const { data: { rows } } = res;
            this.memberList = rows; 
        },
        // 翻页点击事件
        handlePageChange(pageNumber) {
            this.pageNo = pageNumber;
            this.commonGetMembetList();
        },
        handleSearchBtn(){
            // if ( this.searchVal !== '' ) {
                this.pageNo = 1;
                this.commonGetMembetList();
            // }
        },
        /**
         *  搜索所有用户的事件处理
         */
        async handleSearchAllMember(){
            const res = await this.$getData('/searchuser.do', {
                pageNo: 1,
                name: this.searchMember,
                myEid: this.$myEid,
            });
            console.log(res);
            this.searchMemberList = res.data.rows;
        },
        /**
         * 授权管理员操作
         */
        async handleUpdateAdmin(item){
            console.log(item);
            let _this = this;
            this.$confirm({
                title: '确定授权该成员为管理员身份么？',
                async onOk(){
                    _this.$store.commit('changeShowLoad', true);
                    const res = await _this.$getData('/member/updateAdmin.action', {
                        groupId: _this.chosedLi.groupId,
                        id: item.id,
                        userEid: item.memberEid
                    });
                    _this.$store.commit('changeShowLoad', false);
                    console.log(res);
                    if ( res.data.success ) {
                        _this.$message.success('授权管理员成功');
                        _this.pageNo = 1;
                        _this.commonGetMembetList();                
                    }
                },
                okText: '确认',
                cancelText: '取消',                
            })
        },
        /**
         *  添加用户到数组
         */
        handleAddMember(item, e){
            console.log(item);
            console.log(e);
            if ( e.target.checked ) {
                this.memberArray.push(item);
            } else {
                const index = this.memberArray.findIndex( v => v.id === item.id);
                console.log(index);
            }
        },
        /**
         *  添加用户到小组的确定事件
         */
        handleAddMemberSureBtn(){

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
        margin-top: 1px;
        &.searchBtn{
            margin: 1px 6px;
        }
        &.addMember{
            background-color: #35a8eb;
            color: #ffffff;
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
                        color: #999999;
                        &:hover{
                            color: #f1bd85;
                        }
                    }
                    span.iconliaotian{
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
    padding: 18px 0 0 0;
    .memberBtnWrap{
        width: 640px;
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
        position: relative;
        .addMemberSearchWrap{
            display: flex;
            padding: 15px 15px 15px 19px;
            input{
                width: 488px;
                height: 26px;
                margin-right: 6px;
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
        button.sureBtn{
            position: absolute;
            bottom: 19px;
            left: 50%;
            margin-left: -26px;
        }
    }
}
</style>
