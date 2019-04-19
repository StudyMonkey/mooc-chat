<template>
    <div>
        <div class="memberSearchWrap">
            <a-input placeholder="请输入用户名或昵称......" />
            <a-button class="searchBtn" size="small">搜索</a-button>
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
                            <td class="username" v-text="item.username"></td>
                            <td class="nickname" v-text="item.nickname"></td>
                            <td v-text="item.identity"></td>
                            <td class="operate">
                                <a-icon type="message" />
                                <a-icon class="middleIcon" type="message" />
                                <a-icon type="user" />

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <a-pagination showQuickJumper :defaultCurrent="1" :total="500" @change="handlePageChange" />
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
    data() {
        return {
            memberList: [
                {username: '43081119941024001X', nickname: '一只鱼', identity: '群主'},
                {username: '萧涛', nickname: '一只鸡', identity: '管理员'},
                {username: '杜五', nickname: '一只鸭', identity: '成员'},
                {username: '张六', nickname: '一只鸟', identity: '成员'},
                {username: '小七', nickname: '一只鲨鱼', identity: '成员'},
                {username: '43081119941024001X', nickname: '一只鱼', identity: '群主'},
                {username: '萧涛', nickname: '一只鸡', identity: '管理员'},
                {username: '杜五', nickname: '一只鸭', identity: '成员'},
                {username: '张六', nickname: '一只鸟', identity: '成员'},
            ]
        }
    },
    methods: {
        handlePageChange(pageNumber) {
            console.log('Page: ', pageNumber);
        }
    },
    created () {

    },

}
</script>

<style lang="less" scoped>
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
            td{
                color: #2e766e;
                font-size: 16px;
                font-weight: bold;
                &.username{
                    padding-left: 38px;
                }
                &.operate{
                    padding-right: 18px
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
                i{
                    cursor: pointer;
                    &:hover{
                        color: #f1bd85;
                    }
                }
                .middleIcon{
                    margin: 0 15px;
                }
            }
        }
    }
    .ant-pagination{
        text-align: center;
    }
}
</style>
