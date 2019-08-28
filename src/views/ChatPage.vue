<template>
    <div class="chatTopWrap">
        <div v-show="quickCreateGroup">
            <chat-list @clickChosedLi="handleClickChosedLi" @quickCreateGroup="handleQuickCreateGroup" />
        </div>
        <div v-show="!quickCreateGroup">
            <check-member @changeSearchVal="handleChangeSearchVal" @checkMemberSureBtn="handleCheckMemberSureBtn" @quickCreateGroup="handleQuickCreateGroup">
                <span>勾选好友，快速创建小组</span>
            </check-member>
        </div>     
        <div class="chatMainWrap">
            <not-click v-if="!chosedChat" />
            <div v-else>
                <div class="chatTitleWrap">
                    <span :class="[ chosedChat.groupType === 1 ? 'iconqunliao' : 'iconsiliao', 'iconfont' ]"></span>
                    <p v-text="chosedChat.groupName"><span></span></p>
                </div>
                <!-- 私聊不显示小组编号 -->
                <p class="chatGroupNum" v-if="chosedLi.groupType !== 2">小组编号：<span>{{chosedChat.groupNo}}</span></p>
                <div class="card-container">
                    <a-tabs type="card" @change="handleTabsChange" v-model="tabStr"  defaultActiveKey="chatMain">
                        <a-tab-pane tab="聊天" key="chatMain">
                            <chat-main />
                        </a-tab-pane>
                        <a-tab-pane v-if="chosedLi.groupType !== 2" tab="话题" key="chatTopic" forceRender>
                            <chat-topic 
                                :listTopic="topicList" 
                                :total="total" 
                            />                      
                        </a-tab-pane>
                        <a-tab-pane tab="成员" key="member">
                            <chat-member 
                                :listMember="memberList"
                                :total="total"                               
                            />
                        </a-tab-pane>
                        <a-tab-pane  v-if="chosedLi.groupType !== 2" tab="文件" key="file">
                            <chat-file 
                                :listFile="fileList" 
                                :chosedLi="chosedLi"
                                :total="total" 
                            />
                        </a-tab-pane>
                        <a-tab-pane  v-if="chosedLi.groupType !== 2" tab="公告" key="notice">
                            <chat-notice :listNotice="noticeList"/>
                        </a-tab-pane>
                        <a-tab-pane tab="设置" key="setting">
                            <chat-set />
                        </a-tab-pane>
                    </a-tabs>
                </div> 
            </div>
           
        </div>
    </div>
</template>

<script>
import ChatList from '@/components/chatList'
import CheckMember from '@/components/checkMember'
import ChatMain from '@/components/chat'
import ChatTopic from '@/components/topic'
import ChatMember from '@/components/member'
import ChatNotice from '@/components/notice'
import ChatFile from '@/components/file'
import ChatSet from '@/components/set'
import NotClick from '@/components/notClick'
import { mapMutations } from 'vuex'
export default {
    name: 'member',
    data() {
        return {
            chosedChat: '',
            total: 0, // 分页总条数
            chosedLi: {}, // 选中的左侧单个列表
            chatList: [],  // 传递给聊天的数组
            topicList: [], // 传递给话题的数组 
            memberList: [], // 传递给成员的数组
            noticeList: [], // 传递给公告的数组
            fileList: [], // 传递给文件的数组
            quickCreateGroup: true, // 点击快速创建小组切换状态
            tabStr: 'chatMain',  // tab标签页切换的存值
        }
    },
    computed: {
        groupIdChange(){
            return this.$store.state.groupId
        },
        userListChange(){
            return this.$store.state.getUserList
        }        
    },
    watch: {
        groupIdChange: {
            handler(n, o) {
                if ( n !== o ) {
                    console.log(this.$store.state.groupId);
                    this.tabStr = 'chatMain';
                    // this.getUserList(false, true);
                }
            },
            deep: true
        },
        userListChange: {
            handler(n, o) {
                if ( n !== o ) {
                    console.log(this.$store.state.getUserList);
                    if ( this.$store.state.getUserList === 2 ) {
                        this.chosedChat = '' //  将左侧列表所选择的置为空
                    }
                }
            },
            deep: true
        }        
    },
    components: {
        ChatList,
        CheckMember,
        ChatMain,
        ChatTopic,
        ChatMember,
        ChatNotice,
        ChatFile,
        ChatSet,
        NotClick
    },
    methods: {
        ...mapMutations(['changeGetUserList']),
        async commonGetMethod(url, params){
            const res = await this.$getData(url, params);
            const { data } = res;
            this.total = data.total;
            return data.rows;
        },
        async handleTabsChange (key) {
            if ( key === 'chatMain' ) {  
                this.chatList = await this.commonGetMethod('/chat/detail.do', {
                    groupId: this.chosedLi.groupId,
                    chatEid: this.chosedLi.chatEid
                });
            } else if ( key === 'chatTopic' ){
                this.topicList = await this.commonGetMethod('/chat/getTopics.action', {
                    groupId: this.chosedLi.groupId,
                    pageNo: 1
                });
            } else if ( key === 'member' ) {
                this.memberList = await this.commonGetMethod('/member/memberList.action', {
                    memberSearchWord: '',
                    groupId: this.chosedLi.groupId,
                    pageNo: 1
                }); 
            } else if ( key === 'notice' ) {
                this.noticeList = await this.commonGetMethod('/chat/getNoticeList.action', {
                    groupId: this.chosedLi.groupId,
                });
            } else if ( key === 'file' ) {
                this.fileList = await this.commonGetMethod('/member/groupFileList.action', {
                    groupId: this.chosedLi.groupId,
                    pageNo: 1
                });
            }
        },
        // 接受chatList子组件所选择的聊天列表
        handleClickChosedLi( obj, item ){
            this.chosedChat = obj; // 点击选中之后调用接口获取到的对象信息
            this.chosedLi = item;
        },
        /**
         *  处理快速创建小组传递过来的显示隐藏参数
         */
        handleQuickCreateGroup(obj){
            this.quickCreateGroup = obj
        },
        /**
         * 处理快速创建小组确定按钮的事件传递
         * checkMember组件传递过来的勾选好友的数组值
         */
        async handleCheckMemberSureBtn(arr){
            this.quickCreateGroup = true;
            if ( arr.length > 0 ) {
                let friendEidArr = '';
                arr.map( (v,index) => {
                    if ( index !== arr.length-1 ) {
                        friendEidArr+=v.friendEid+','
                    } else {
                        friendEidArr+=v.friendEid
                    }                
                });
                console.log(friendEidArr);
                const res = await this.$getData('/multipersonchat.do', {
                    eid: this.$myEid,
                    friendEids: friendEidArr
                });
                if ( res.data.success ) {
                    this.$message.success(res.data.msg);
                    //this.$router.push({path: '/chat'});
                    // 修改vuex里面的状态，chatList监听到状态改变就会获取一次列表
                    this.changeGetUserList(1);
                }               
                
            }          
        },
        /**
         * 处理快速创建小组
         * checkMember组件传递过来的搜索值
         */
        handleChangeSearchVal(str){
            console.log(str);           
        }
    },  
}
</script>

<style lang="less">
.chatTopWrap{
    display: flex;
    border: 1px solid #c1bfba;
    .chatMainWrap{
        width: 670px;
        .chatGroupNum{
            background-color: #f5f5f5;
            padding: 0 15px; 
            line-height: 14px;
        }
        .chatTitleWrap{
            display: flex;
            font-size: 15px;
            line-height: 14px;
            background-color: #f5f5f5;
            padding: 15px 15px 10px 15px;
            i{
                height: 20px;
                line-height: 21px;
            }
            p{
                max-width: 800px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-left: 4px;
                line-height: 20px;
                margin-top: -6px;
            }
        }
        .card-container {
            overflow: hidden;
            height: 646px;
            background-color: #ffffff;
            .ant-tabs-bar{
                display: flex;
                justify-content: flex-end;
                background-color: #f5f5f5;
                padding-right: 15px;
                border-bottom: none;
                margin-bottom: 0;
                &::after{
                    clear: both;
                    content: "";
                    visibility: hidden;
                }
            }
            .ant-tabs.ant-tabs-card .ant-tabs-card-bar{
                .ant-tabs-tab{
                    line-height: 25px;
                    background-color: #f5f5f5;
                    &:hover{
                        background-color: #f9eedf;
                        color: #666666;
                    }
                }
                .ant-tabs-nav-container{
                    height: 27px;
                }
                .ant-tabs-tab-active{
                    background-color: #ffffff;
                    color: #666666;
                }
            } 
            .ant-tabs-tabpane{
                clear: both;
                padding-left: 15px;
            }
        }        
    }
}

.ant-tabs-bar{
    margin-bottom: 15px;
}


</style>





