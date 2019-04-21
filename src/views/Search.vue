<template>
    <div class="searchTopWrap">
        <Loading v-if="showLoad" />
        <a-modal
            v-model="visible"
            onOk="handleOk"
            :footer="null"
        >
            <div class="modalHeaderWarap">
                <x-avatar imgUrl="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                <div>
                    <p>某某某某小组</p>
                    <p>小组编号：12345678</p>
                </div>
            </div>
            

            <a-textarea placeholder="请输入申请理由..." :rows="4" />
            <a-button>发送</a-button>
        </a-modal>        
        <div class="searchMiddleWrap">
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
            <div v-if="hasResult">
                未搜索时显示的内容
            </div>
            <div v-else>
                <p class="searchTitle">搜索结果</p>
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
                                        <span class="iconfont iconsixin"></span>
                                        <span class="colorSpan"><i v-text="item.number"></i>人</span>
                                    </p>
                                </div>
                            </div>                           
                            <p class="groupDescrition" v-text="item.groupdesc"></p>
                            <div class="groupBtnWrap">
                                <p><span>小组编号：</span><span v-text="item.groupId"></span></p>
                                <a-button type="primary" size="small" @click="handleJoinClick">加入</a-button>
                            </div>  
                        </li>                       
                    </ul>
                    <x-pagination @pageChange="handlePageChange" />
                </div>
                <div v-if="memberList.length > 0" class="MemberResultWrap">

                </div>

            </div>
            
        </div>
    </div>
</template>

<script>
import Loading from '@/components/loading'
import XAvatar from '@/components/avatar'
import XPagination from '@/components/pagination'
export default {
    name: 'search',
    data() {
        return {
            visible: false, //modal框显示
            showLoad: false,
            searchMember: '', // 搜索用户名输入内容
            groupList: [],  // 查询的小组列表
            memberList: [],  // 查询的用户列表
            groupNum: '',
            groupName: '',
            hasResult: false
        }
    },
    components: {
        Loading,
        XAvatar,
        XPagination
    },
    methods: {
        /*  点击查询用户事件处理
         *  判断用户名是否为空给出提示
         */
        handleSearchMember() {
            if ( this.searchMember ) {
                this.showLoad = true;
                setTimeout( () => {
                    this.showLoad = false;
                    this.$message.success('搜索用户成功');
                    this.memberResult = true;
                }, 1000)
            } else {
                this.$message.error('请输入需要查找的用户名');
            }
        },
        /*  点击查询小组事件处理
         *  判断小组编号和名称是否为空给出提示
         */
        async handleSearchGroup(){
            if ( this.groupNum || this.groupName ) {
                this.showLoad = true;          
                
                const res = await this.$getData('groupList', {});
                const { data: { data } } = res;
                this.showLoad = false;
                this.$message.success('搜索小组成功');       
                this.groupList = data;
                this.groupResult = true;
            } else {
                this.$message.error('请输入需要查找的小组编号或名称');
            }
        },
        /**  点击加入事件的处理
         * 
         */
        handleJoinClick(){
            this.visible = true;
        },
        // 翻页点击事件
        async handlePageChange(pageNumber) {
            this.showLoad = true;
            const res = await this.$getData('groupList', {page: pageNumber});
            this.showLoad = false;
            const { data: { data } } = res;
            this.groupList = data;         
        },        
    },
}
</script>

<style lang="less" scoped>
.modalHeaderWarap{
    display: flex;
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
        width: 250px;
        background-color: #f5f5f5;
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
    }

}

</style>

