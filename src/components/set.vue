<template>
    <div class="setTopWrap">
        <div class="groupNameWrap">
            <span>小组名称：</span>
            <a-input class="groupName" v-model="groupName" placeholder="请输入小组名称......" />
        </div>
        <upload-img>
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
            <a-select style="width: 209px;height:25px;" defaultValue="0">
                <a-select-option value="0">允许全员添加小组成员</a-select-option>
                <a-select-option value="1">仅允许管理员添加小组成员</a-select-option>
            </a-select>
        </div>
        <div class="selectWrap">
            <span>加群方式：</span>
            <a-select style="width: 209px;height:25px;" defaultValue="0">
                <a-select-option value="0">需要身份验证</a-select-option>
                <a-select-option value="1">不需要身份验证</a-select-option>
            </a-select>            
        </div>
        <div class="selectWrap">
            <span>群主转移：</span>
            <a-select style="width: 209px;height:25px;" defaultValue="0">
                <a-select-option value="0">请选择管理员姓名</a-select-option>
                <a-select-option value="1">选择其他人</a-select-option>
            </a-select>            
        </div>   
        <div class="btnWrap">
            <a-button size="small" 
                @click="handleTopChatClick"
            >聊天置顶</a-button>
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
            <a-button size="small" @click="handleDismissGroupClick" v-if="!chosedLi.official">解散小组</a-button>
        </div>       
        <a-button class="saveBtn greenBtn" @click="handleSaveBtnClick">保存</a-button>
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import UploadImg from '@/components/uploadImg'
export default {
    name: 'set',
    data() {
        return {
            groupName: '', // 小组名称
            groupDescription: '', // 小组描述
            groupNickName: '', // 小组昵称
            addMember: '0', // 添加成员，默认第一项
            addGroup: '0', // 加群方式，默认第一项
            transferLeader: '0', // 群主转移，默认第一项
            hasClearRight: true,
            chosedLi: this.$store.state.chosedLi,
            memberType: this.$store.state.memberType,  // 从vuex里面取出来的用户权限
        }
    },
    components: {
        XAvatar,
        UploadImg
    },
    methods: {
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
        // 聊天置顶的点击事件处理
        handleTopChatClick(){
            this.$message.info('点击了聊天置顶的按钮');
        },
        // 退出小组点击事件处理
        handleQuitGroupClick(){
            this.comfirmMethod('确定退出该小组？', '退出小组成功');            
        },
        // 解散小组点击事件处理
        handleDismissGroupClick(){
            this.comfirmMethod('确定解散该小组？', '解散小组成功');
        },
        // 保存按钮的点击事件处理
        handleSaveBtnClick() {
            this.$message.success('修改设置成功');
        }
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
