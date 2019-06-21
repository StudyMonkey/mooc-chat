<template>
    <div class="setTopWrap">
        <a-modal
            title="请填写退出小组的理由"
            v-model="quitGroupModal"
            centered
            @ok="handleQuitGroupSure"
            okText="确认"
            cancelText="取消"
        >
            <a-textarea v-model="exitReason" placeholder="在此输入退出小组理由..." />
        </a-modal>        
        <div class="groupNameWrap">
            <span>小组名称：</span>
            <a-input class="groupName" v-model="groupName" placeholder="请输入小组名称......" />
        </div>
        <upload-img 
            :groupImg="groupShowImg" 
            @changeUploadImg="handleChangeImage"
        >
            <span>小组头像：</span>
        </upload-img>
        <div class="groupDescriptionWrap">
            <span>小组描述：</span>
            <a-textarea class="groupDescription" :rows="4" v-model="groupDescription" placeholder="请输入小组描述......" />
        </div>
        <div class="nickNameWrap">
            <span>我在小组的昵称：</span>
            <a-input v-model="groupNickName" placeholder="请输入您在该小组的昵称......" />
        </div>
        <div class="selectWrap">
            <span>添加成员：</span>
            <a-select 
                style="width: 209px;height:25px;" 
                v-model="addMember"
                :disabled="memberType === 3 "
            >
                <a-select-option :value="1">允许全员添加小组成员</a-select-option>
                <a-select-option :value="2">仅允许管理员添加小组成员</a-select-option>
            </a-select>
        </div>
        <div class="selectWrap">
            <span>加群方式：</span>
            <a-select 
                style="width: 209px;height:25px;" 
                v-model="addGroup"
                :disabled="memberType === 3 "
            >
                <a-select-option :value="1">需要身份验证</a-select-option>
                <a-select-option :value="2">不需要身份验证</a-select-option>
            </a-select>            
        </div>
        <div class="selectWrap">
            <span>群主转移：</span>
            <a-tooltip>
                <template slot="title">
                    {{ isAdmin !== 1 ? '群主身份才能操作群主转移' : null }}
                </template>
                <a-select 
                    style="width: 209px;height:25px;" 
                    v-model="changeGroupOwner"
                    :disabled="isAdmin !== 1"
                >
                    <a-select-option :value="0">请选择管理员姓名</a-select-option>
                    <a-select-option 
                        v-for="(item,index) in memberOptionList" 
                        :key="index"
                        :value="item.memberEid"
                    >{{item.memberNick}}</a-select-option>
                </a-select> 
            </a-tooltip>           
        </div>   
        <div class="btnWrap">
            <a-button size="small" 
                @click="handleTopChatClick"
            >{{ isTop === "false" ? "聊天置顶" : "取消置顶" }}</a-button>
            <a-button 
                v-if="$myEid === 'ksz'"
                size="small" 
                @click="handleClearChat"
            >清除聊天</a-button>
            <a-button 
                v-if="$myEid === 'ksz'"
                :disabled="hasClearRight" 
                size="small" 
                @click="handleClearTopic"
            >清除话题</a-button>
            <a-button size="small" @click="handleQuitGroupClick">退出小组</a-button>
            <a-tooltip>
                <template slot="title">
                    {{ isAdmin !== 1 ? '群主身份才能操作解散小组' : null }}
                </template>
                <a-button 
                    size="small" 
                    @click="handleDismissGroupClick" 
                    :disabled="isAdmin !== 1" 
                    v-if="!chosedLi.official"
                >解散小组</a-button>
            </a-tooltip>
        </div>       
        <a-button class="saveBtn greenBtn" @click="handleSaveBtnClick">保存</a-button>
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import UploadImg from '@/components/uploadImg'
import { mapMutations } from 'vuex'
export default {
    name: 'set',
    data() {
        return {
            groupName: '', // 小组名称
            groupDescription: '', // 小组描述
            groupNickName: '', // 小组昵称
            hasClearRight: true,
            addMember: '',  // 添加成员方式
            addGroup: '',   // 加群方式
            changeGroupOwner: 0,  // 群主转移
            memberOptionList: [],  // 群主转移下拉列表的数据
            chosedLi: this.$store.state.chosedLi,
            memberType: this.$store.state.memberType,  // 从vuex里面取出来的用户权限
            isAdmin: this.$store.state.isAdmin,  // 从vuex里面取出来的用户群主和管理员身份
            isTop: '',   // 是否置顶
            groupNo: '',
            exitReason: '',   // 退出小组的理由
            quitGroupModal: false,   //  控制退出小组的理由Modal框显示隐藏
            groupIcon: '',  // 小组图片
            groupShowImg: [{  // 从返回里面取得回显的图片
                uid: '-1',
                name: '',
                status: 'done',
                url: ''
            }]
        }
    },
    components: {
        XAvatar,
        UploadImg
    },
    methods: {
        ...mapMutations(['changeGetUserList']),
        // 通用的确认事件处理
        comfirmMethod(title, mes){
            let _this = this;
            this.$confirm({
                title,
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.$message.success(mes);
                }
            })             
        },
        // 清除聊天点击事件处理
        handleClearChat(){
            this.comfirmMethod('确认清除聊天？', '清除聊天成功');
        },
        // 清除话题点击事件处理
        handleClearTopic(){
            this.comfirmMethod('确认清除话题？', '清除话题成功');
        },
        /**
         *  聊天置顶的接口请求处理
         */
        async handleTopChat(url, params){
            const res = await this.$getData('/sys/groupTopOnOff.action', {
                eid: this.$myEid,
                groupId: this.chosedLi.groupId,
                isTop: this.isTop
            });
            console.log(res);
            if ( res.data.success ) {
                let message = this.isTop === "false" ? "成功设置小组置顶" : "成功取消小组置顶";
                this.$message.success(message);
                // 通知一下chatList组件重新获取更新一下列表
                
                // _this.commonGetMembetList();
            }                         
        },
        // 聊天置顶的点击事件处理
        handleTopChatClick(){
            let _this = this;
            let title = this.isTop === "false" ? '确认将该小组设为置顶？' : '确认将该小组取消置顶？'
            this.$confirm({
                title,
                async onOk() {
                    _this.handleTopChat();
                    _this.changeGetUserList(2);
                    // _this.$store.commit('changeGetUserList', 2);                               
                },
                okText: '确认',
                cancelText: '取消',
            })
            
        },
        // 上传图片传递的事件处理
        handleChangeImage(imgObj){
            console.log(imgObj);
            this.groupIcon = imgObj[0].response.obj
        },
        // 退出小组点击确认
        async handleQuitGroupSure(){
            const res = await this.$getData('/sys/groupExit.action', {
                groupId: this.chosedLi.groupId,
                groupNo: this.groupNo,
                exiterNick: this.$store.state.user.username,
                exitReason: this.exitReason,
                eid: this.$myEid,
                offcial: this.chosedLi.official
            });
            const { data: { success,msg } } = res;
            if ( success && msg === 'exitGroup' ) {
                this.quitGroupModal = false;
                this.$message.success(`您已成功退出[${this.groupNo}]小组`);
                // 还要刷新一下左侧列表
                this.changeGetUserList(2);
            }
        },
        // 退出小组点击事件处理
        handleQuitGroupClick(){
            let _this = this;
            this.$confirm({
                title: '确认要退出该小组么？',
                async onOk() {
                    _this.quitGroupModal = true
                    // _this.handleQuitGroupSure();                               
                },
                okText: '确认',
                cancelText: '取消',
            })           
        },
        async handleDismissGroupSure(){
            const res = await this.$getData('/sys/deleteGroup.action', {
                eid: this.$myEid,
                groupId: this.chosedLi.groupId
            })
            if ( res.data.success ) {
                this.$message.success('解散小组成功');
            }
            console.log(res);
        },
        // 解散小组点击事件处理
        handleDismissGroupClick(){
            let _this = this;
            this.$confirm({
                title: '解散群后，相关群信息，群成员信息都会删除，无法找回，请确认操作是否继续!',
                async onOk() {
                    _this.handleDismissGroupSure();
                    _this.changeGetUserList(2);
                    // _this.handleQuitGroupSure();                               
                },
                okText: '确认',
                cancelText: '取消',
            });             
        },
        // 保存按钮的点击事件处理
        async handleSaveBtnClick() {
            if ( this.groupNickName !== '' &&  this.groupName !== '' ) {
                const res = await this.$getData('/sys/updateSettings.action', {
                    eid: this.$myEid,
                    groupId: this.$store.state.groupId,
                    adminEid: this.changeGroupOwner,
                    memberNick: this.groupNickName,
                    groupName: this.groupName,
                    affirmFlag: this.addGroup,
                    groupDesc: this.groupDescription,
                    addFlag: this.addMember, 
                    groupIcon: this.groupIcon                   
                });
                this.$message.success('修改设置成功');
            }
        }
    },
    async created(){
        console.log('用户身份', this.$store.state.isAdmin);
        const res = await this.$getData('/sys/settings.action', {
            eid: this.$myEid,
            groupId: this.chosedLi.groupId
        });
        // addFlag  添加成员  1   2
        // affirmFlag 加群方式  1  2
        console.log(res);
        const { data: { obj,adminList } } = res;
        this.groupName = obj.groupName;
        this.groupDescription = obj.groupDesc;
        this.groupNickName = obj.bakField;
        this.addMember = obj.addFlag;
        this.addGroup = obj.affirmFlag;
        this.memberOptionList = adminList;
        this.isTop = obj.bakField2;
        this.groupNo = obj.groupNo;
        this.groupShowImg[0].url = 'http://172.26.75.217:8080'+obj.groupIcon;
        this.groupShowImg[0].name = '小组头像' + obj.groupIcon.split('.')[1];
    },
}
</script>

<style lang='less' scoped>
.setTopWrap{
    margin-top: 15px;
    width: 638px;
    height: 598px;
    border: 1px solid #e5e5e5;
    position: relative;
    padding: 20px;
    .groupNameWrap{
        display: flex;
        .groupName{
            width: 524px;
            height: 27px;
        }        
    }
    .groupDescriptionWrap{
        display: flex;
        textarea{
            resize: none;
            width: 524px;
            height: 102px;
        }
    }
    .nickNameWrap{
        display: flex;
        input{
            width: 482px;
            height: 27px;
        }
    }
    button{
        color: #333333;
        &.greenBtn{
            color: #ffffff;
            &:hover{
                color: #ffffff;
            }
        }
        &.saveBtn{
            position: absolute;
            bottom: 20px;
            left: 50%;
            margin-left: -26px;
        }
    }
    div{
        margin-bottom: 20px;
        &.selectWrap{
            div{
                margin-bottom: 0;
            }
        }
        button{
            margin-right: 20px;
        }
        span{
            font-size: 14px;
            color: #666666;
        }
    }

}

</style>
