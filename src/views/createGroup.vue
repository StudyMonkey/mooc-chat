<template>
    <div class="createGroupTopWrap">
        <x-prompt>
            <p v-if="userType === 'maneger'">普通学习小组并非单位组织的单位
                学习小组。如您是单位管理员并未
                创建单位学习小组请点击下方按钮
                前往系统后台直接创建单位学习小
                组。
                <a-button size="small" type="primary" v-show="user.applyflag">
                    <router-link tag="a" to="/moocadm/system" target="_blank">
                        前往创建
                    </router-link>              
                </a-button>                
            </p>
            <p v-else>
                普通学习小组并非单位组织的单位
                学习小组。如您还未加入您的单位
                学习小组，请联系上级申请加入；
                如您是单位管理员请联系上级或者
                平台授予管理员身份再前往管理后
                台创建单位学习小组。
            </p>
        </x-prompt>
        <div class="createRightTop">
            <right-title>
                <span>创建小组</span>
            </right-title>
            <div class="createBtnWrap">
                <a-button 
                    :class="[ userType !== 'maneger' ? 'bgActive' : '','createChatGroup']" 
                    @click="handleCreateGroup('normal')"
                >创建普通学习小组</a-button>
                <a-button 
                    :disabled="!user.applyflag" 
                    :class="userType === 'maneger' ? 'bgActive' : '' "  
                    @click="handleCreateGroup('maneger')"
                >创建单位学习小组</a-button>   
                <span :class="userType === 'maneger' ? 'left455' : 'left203' "></span>            
            </div>
            <div class="createConWrap">  
                <div v-if=" userType!== 'maneger'">
                    <div class="groupNameWrap">
                        <span>小组名称<i>*</i>：</span>
                        <a-input 
                            class="groupName" 
                            v-model="groupName" 
                            placeholder="请输入想创建的普通学习小组名称,长度大于6个字符" 
                        />
                    </div>
                    <upload-img @changeUploadImg="handleChangeImage">
                        <span>小组头像：</span>
                    </upload-img>
                    <div class="">
                        <span>是否审核：</span>
                        <a-radio-group v-model="needVerify" name="radioGroup">
                            <a-radio :value="1">需要审核</a-radio>
                            <a-radio :value="2">不需要审核</a-radio>
                        </a-radio-group>   
                    </div> 
                    <div class="groupDescriptionWrap">
                        <span>小组描述：</span>
                        <a-textarea 
                            class="groupDescription" 
                            :rows="4" 
                            v-model="groupDescription" 
                            placeholder="请输入小组描述......" 
                        />
                    </div> 
                    <div class="submitBtnWrap">
                        <a-button 
                            class="greenBtn" 
                            :disabled="!canCommit" 
                            @click="handleCreateBtnClick"
                        >提交</a-button> 
                    </div>                    
                </div>  
                <div class="partGroupWrap" v-else>
                    <a-tooltip placement="top">
                        <template slot="title">
                            {{ user.applyflag ? '点击前往后台创建单位学习小组' : '非单位学习小组管理员不可点击' }}
                        </template>
                        <a-button>
                            <router-link tag="a" to="/moocadm/system" target="_blank">前往创建单位学习小组</router-link>
                        </a-button> 
                    </a-tooltip>   
                </div>       
                                         
            </div>
        </div>
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
import XPrompt from '@/components/prompt'
import RightTitle from '@/components/rightTitle'
import UploadImg from '@/components/uploadImg'
import { getLocal } from '@/utils/utils'
export default {
    name: 'prompt',
    data() {
        return {
            groupName: '', 
            userType: '', // 用户身份
            groupDescription: '', // 小组描述 
            user: this.$store.state.user || getLocal('user'),
            needVerify: 1,  // 是否需要审核 
            groupImage: '',       
        }
    },
    computed: {
        canCommit(){
            return this.groupName.length > 5
        }
    },
    components: {
        XAvatar,
        XPrompt,
        RightTitle,
        UploadImg
    },
    methods: {
        handleCreateGroup(str){
            this.userType = str
        },
        handleChangeImage(imgObj){
            this.groupImage = imgObj[0].response.obj
        },
        async handleCreateBtnClick(){
            const res = await this.$postData('/creategroup.do', {
                creator: this.$myEid,
                groupName: this.groupName,
                groupIcon: this.groupImage,
                affirmFlag: this.needVerify,
                groupDesc: this.groupDescription,
            });
            if ( res.data.success ) {
                this.$message.success('创建交流小组成功');
                this.$router.push('/lmgroups/main/chat');
            }
        }
    }
}
</script>

<style lang='less' scoped>
.left203{ left: 203px }
.left455{ left: 455px }
.bgActive{ 
    background-color: #ff8a00;
    color: #ffffff;
}
.createGroupTopWrap{
    display: flex;
    .middleWrap{
        .promptContent{
            p{
                line-height: 1.8
            }
            button{
                margin-top: 20px;
            }
        }
    }
    .createRightTop{
        background-color: #ffffff;
        .createBtnWrap{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 669px;
            height: 69px;
            border-bottom: 1px solid #e2e2e2;
            position: relative;
            button.createChatGroup{
                margin-right: 102px;
            }
            span{
                display: block;
                position: absolute;
                width: 15px;
                height: 15px;
                bottom: -9px;
                background-color: #ffffff;
                &::after{
                    content: "";
                    display: block;
                    width: 15px;
                    height: 15px;
                    border-right: 1px solid #e2e2e2;
                    border-top: 1px solid #e2e2e2;
                    transform: rotate(-45deg);
                }
            }
        }
        .createConWrap{
            padding: 40px 114px 0 114px;
            div{
                &.groupNameWrap,
                &.groupLogoWrap,
                &.groupDescriptionWrap,
                &.submitBtnWrap{
                    display: flex;
                }               
            }
            .groupNameWrap{
                margin-bottom: 28px;
                .groupName{
                    width: 360px;
                    height: 28px;
                }  
                span{
                    i{
                        color: red;
                    }
                }      
            }
            .groupLogoWrap{
                margin-bottom: 35px;
                /deep/.ant-avatar{
                    margin-left: 7px;
                }
            } 
            .ant-radio-group{
                margin-left: 6px;
            }
            .groupDescriptionWrap{
                margin-top: 41px;
                .groupDescription{
                    resize: none;
                    width: 360px;
                    height: 102px;
                    margin-left: 6px;
                }
            }  
            .submitBtnWrap{
                justify-content: center;
                padding-top: 123px;
            } 
            .partGroupWrap{
                text-align: center;
            }                    
        }
    }
}
</style>
