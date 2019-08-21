<template>
    <div>
        <div v-if="hasClickAdd">
            <div class="memberSearchWrap">
                <a-input v-model="searchVal" placeholder="请输入用户名或昵称......" >
                    <a-icon v-if="searchVal" slot="suffix" type="close-circle" @click="emitSearchValEmpty" />
                </a-input>
                <a-button class="searchBtn greenBtn" size="small" @click="handleSearchBtn">搜索</a-button>
                <a-tooltip placement="bottomRight">
                    <template slot="title">
                        <span>{{ chosedLi.official ? '单位学习小组请在系统后台添加小组成员' : '点击添加成员' }}</span>
                    </template>
                    <a-button 
                        :class="[chosedLi.official ? 'grayBtn' : 'addMember']" 
                        size="small" 
                        :disabled="chosedLi.official" 
                        @click="handleAddMemberShow"
                    >添加成员</a-button>
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
                                    <span :class="identityClass(item)"></span>
                                    <span v-text="item.memberEid"></span>
                                </td>
                                <td class="nickname" v-text="item.memberNick">
                                </td>
                                <td v-text="identityWord(item)"></td>
                                <td class="operate">
                                    <a-tooltip>
                                        <template slot="title">
                                            私信
                                        </template>
                                        <span 
                                            v-if="item.memberEid !== $myEid"
                                            class="iconfont iconliaotian"
                                            @click="handlePrivateChat(item)"
                                        ></span>
                                    </a-tooltip>
                                    <a-tooltip>
                                        <template slot="title">
                                            授权为管理员
                                        </template>
                                        <span 
                                            v-if="memberType === '3' && item.memberType !== 3 " 
                                            class="iconfont iconyuechi1"
                                            @click="handleUpdateAdmin(item)"
                                        ></span>
                                    </a-tooltip>                           
                                    <a-tooltip>
                                        <template slot="title">
                                            删除成员                                       
                                        </template>  
                                        <span 
                                            v-if="item.memberEid !== $myEid && memberType === '3'"
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
                    v-show =" memberTotal > 10 " 
                    :total="memberTotal" 
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
                <div class="memberTableArea">            
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
                                    <a-checkbox 
                                        :checked="item.checked"
                                        @change="handleAddMember($event, item)"
                                    ></a-checkbox>
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
                </div> 
                <x-pagination 
                    style="bottom:50px;"
                    v-show="searchTotal > 10" 
                    :total="searchTotal" 
                    @pageChange="handleSearchMemberPageChange " 
                />                              
                <a-button 
                    size="small" 
                    class="greenBtn sureBtn" 
                    @click="handleAddMemberSureBtn" 
                    :disabled="memberArray.length < 1"
                >确定</a-button> 
                <!-- <div v-else>未搜索到成员信息</div>               -->
            </div>                  
        </div>        
    </div>
</template>

<script>
import noticeImg from '@/assets/images/nnn.jpg'
import XPagination from '@/components/pagination'
export default {
    name: 'memberList',
    props: {
        listMember: {
            type: Array,
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
        },
        total(n, o){
            if ( n !== o ) {
                this.memberTotal = this.total;
            }
        },
        getChosedLi(n, o){
            if ( n !== o ) {
                this.chosedLi = this.$store.state.chosedLi;
                this.memberType = this.$store.state.memberType;
            }
        },
    },
    computed: {
        identityClass(item) {
            return function(item){
                if ( item.memberType === 3 && item.isAdmin === 1 ) {
                    return 'iconfont iconqunzhu'
                } else if ( item.memberType === 3 && item.isAdmin === 2 ) {
                    return 'iconfont iconguanliyuan'
                } else {
                    return 'pl22'
                } 
            }
        },
        identityWord(item) {
            return function(item){
                if ( item.memberType === 3 && item.isAdmin === 1 ) {
                    return '群主'
                } else if ( item.memberType === 3 && item.isAdmin === 2 ) {
                    return '管理员'
                } else if( item.memberType === 2 ) {
                    return '组长'
                } else {
                    return '成员'
                }
            }
        },
        getChosedLi(){
            return this.$store.state.chosedLi
        }
    },
    data() {
        return {
            memberList: [], // 成员列表数据
            searchMemberList: [], // 搜索的成员列表数据
            searchVal: '', // input框输入的搜索内容
            searchMember: '',
            websocket: this.$store.state.ws,
            hasClickAdd: true, // 点击添加成员按钮
            chosedLi: this.$store.state.chosedLi,  // 从vuex里面获取
            user: this.$store.state.user,
            pageNo: 1,  // 翻页数，默认为1
            searchPageNo: 1,  // 搜索用户的翻页数，默认为1
            searchTotal: 0,   // 搜索用户出来的总数
            memberType: this.$store.state.memberType,  // 用户在小组的权限
            memberArray: [],  // 所勾选的用户保存的数组
            memberTotal: '', // 传递过来的total总数目
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
                title: `确定删除${item.memberNick}？`,
                async onOk() {
                    const res = await _this.$getData('/member/deleteMember.action', {
                        id: item.id,
                        groupId: _this.chosedLi.groupId,
                        memberType: item.memberType
                    })
                    if ( res.data.success ) {
                        _this.$message.success('删除小组成员成功'); 
                        console.log(_this.memberTotal);
                        if ( _this.memberTotal - 2 < 10 ) {
                            _this.pageNo = 1;
                        }
                        _this.commonGetMembetList();
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
            const res = await this.$getData('/member/memberList.action', {
                memberSearchWord: this.searchVal,
                groupId: this.chosedLi.groupId,
                pageNo: this.pageNo
            });
            const { data: { rows } } = res;
            this.memberTotal = res.data.total;
            this.memberList = rows; 
        },
        // 翻页点击事件
        handlePageChange(pageNumber) {
            this.pageNo = pageNumber;
            this.commonGetMembetList();
        },
        // 搜索用户的翻页点击事件
        handleSearchMemberPageChange(pageNumber){
            this.searchPageNo = pageNumber;
            this.handleSearchHttp();
        },
        handleSearchBtn(){
            if ( this.searchVal !== '' ) {
                this.pageNo = 1;
                this.commonGetMembetList();
            } else {
                this.$message.info('搜索内容不能为空');
            }
        },
        /**
         * 请求搜索内容并请求一次空值
         */
        emitSearchValEmpty(){
            this.searchVal = '';
            this.commonGetMembetList();
        },
        /**
         * 私信接口的处理
         * 返回的obj对象里包含了一个groupId,这时应该刷新左侧用户列表
           才能产生所建立的聊天关系
         */
        async handlePrivateChat(item){
            console.log(item);
            const res = await this.$getData('/member/privateMessage.action', {
                memberEid: item.memberEid,
                memberNick: item.memberNick,
                eid: this.$myEid,
                ename: this.$myName
            });
            console.log(res);
            const { data: { obj } } = res;
            // 传递给chatPage一个事件，然后chatPage告诉chatList应该要请求一次列表，
            // 且在对应的groupId上有激活状态
            this.$store.commit('changeGroupId', obj.groupId);
            this.$store.commit('changeAutoClick', 2);
        },
        /**
         * 搜索用户的多次请求事件相同处理
         */
        async handleSearchHttp(){
            const res = await this.$getData('/searchuser.do', {
                pageNo: this.searchPageNo,
                name: this.searchMember,
                myEid: this.$myEid,
            });
            console.log(res.data);
            const { data: { count, rows } } = res;
            this.searchTotal = count;
            this.searchMemberList = rows;
        },
        /**
         *  搜索所有用户的事件处理
         */
        handleSearchAllMember(){
            this.searchPageNo = 1;
            this.handleSearchHttp();
        },
        /**
         * 授权管理员操作
         */
        async handleUpdateAdmin(item){
            console.log(item);
            let _this = this;
            this.$confirm({
                title: `确定授权[${item.memberNick}]为管理员身份么？`,
                async onOk(){
                    const res = await _this.$getData('/member/updateAdmin.action', {
                        groupId: _this.chosedLi.groupId,
                        id: item.id,
                        userEid: item.memberEid
                    });
                    if ( res.data.success ) {
                        _this.$message.success('授权管理员成功');
                        _this.pageNo = 1;
                        _this.commonGetMembetList();                
                    } else {
                        _this.$message.error('授权失败，管理员数量已达最大值');
                    }
                },
                okText: '确认',
                cancelText: '取消',                
            })
        },
        /**
         *  添加用户到数组
         */
        handleAddMember(e, item){
            if ( e.target.checked ) {
                item.checked = true;
                this.memberArray.push(item);
            } else {
                item.checked = false;
                const index = this.memberArray.findIndex( v => v.id === item.id);
                this.memberArray.splice(index, 1);            
            }
            console.log(this.memberArray);
        },
        /**
         *  添加用户到小组的确定事件
         */
        async handleAddMemberSureBtn(){
            let membersId = '';
            let membersName = '';
            this.memberArray.forEach( (v,i) => {
                if ( i !== this.memberArray.length-1 ) {
                    membersId += v.userEid + ',';
                    membersName += v.userName + ','
                } else {
                    membersId += v.userEid;
                    membersName += v.userName;
                }
            });
            const res = await this.$getData('/member/addGroupMemberNum.action', {
                groupId: this.chosedLi.groupId,
                joinNum: this.memberArray.length,
                membersId,
                membersName,
            });
            console.log(res);
            const { data: { obj: { cacheId,sortName } } } = res;
            if ( res.data.success ) {
                if ( cacheId === 'zero' && sortName !== 'zero' ) {
                    this.$message.success(`${sortName}添加入群成功`);
                } else if ( cacheId !== 'zero' && sortName === 'zero' ) {
                    this.$message.error(`${cacheId}已是小组成员`);
                } else {
                    this.$message.info(`${res.data.obj.cacheId}已是小组成员，${res.data.obj.sortName}添加成功`);
                }
                this.memberArray.map( v => {
                    v.checked = false
                })
                this.memberArray = [];
                // this.searchMember = '';
                console.log('成员列表的长度', this.memberList.length);
                // if ( this.memberList.length < 3 ) {
                //     this.$store.commit('changeGetUserList', 2);
                // }              
                // this.handleSearchAllMember();
                // 添加成员成功之后，聊天框发送一条系统通知
                let newObj = {};
                console.log('发消息的人', this.user);
                newObj.fromEid = this.user.eid,
                newObj.fromEidDept = this.user.displayunitname;
                newObj.fromPic = noticeImg;
                newObj.fromName = this.user.username,
                newObj.time = new Date();
                newObj.groupId = this.chosedLi.groupId;
                newObj.groupName = this.chosedLi.name;
                newObj.groupUrl = this.chosedLi.avatar;                
                newObj.chatType = 1; // 其他类型的chatType 都为 1
                newObj.to = '0';
                newObj.atEids = ''; 
                newObj.text = `恭喜新成员${res.data.obj.sortName}加群成功`
                
                this.websocket.send(JSON.stringify(newObj));
            }
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
            this.pageNo = 1;
            this.hasClickAdd = true;
            this.searchMember = '';  
            this.searchMemberList = [];          
            this.commonGetMembetList();
        }
    },
    created(){
        console.log(this.chosedLi);
    }

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
    /deep/.ant-input{
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
        &.grayBtn{
            background-color: #999999
        }
    }
}
.memberContentWrap{
    width: 638px;
    height: 566px;
    border: 1px solid #e5e5e5;
    .table_area{ 
        height: 500px; 
        overflow-y: scroll
    }
    .limitadm_table1{
        tr{
            &.tr1{
                td{
                    &.username{
                        padding-left: 38px;
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
                    position: relative;
                    span{
                        position: absolute;
                        cursor: pointer;
                        color: #999999;
                        top: 0;
                        &.iconliaotian{
                            left: 0
                        }
                        &.iconyuechi1{
                            margin-top: 2px;
                            left: 30px;
                            font-size: 23px;
                        }  
                        &.iconshanchengyuan{
                            left: 60px
                        }                      
                        &:hover{
                            color: #f1bd85;
                        }
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
        .memberTableArea{
            height: 400px;
            overflow-y: scroll;
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
        button.sureBtn{
            position: absolute;
            bottom: 10px;
            left: 50%;
            margin-left: -26px;
        }
    }
}
</style>
