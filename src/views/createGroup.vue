<template>
    <div class="createGroupTopWrap">
        <x-prompt>
            <p>交流小组并非单位组织的单位
                学习小组。如您是单位管理员并未
                创建单位学习小组请点击下方按钮
                前往系统后台直接创建单位学习小
                组。
            </p>
            <a-button size="small">前往创建</a-button>
        </x-prompt>
        <div class="createRightTop">
            <right-title>
                <span>创建小组</span>
            </right-title>
            <div class="createBtnWrap">
                <a-button class="createChatGroup">创建交流小组</a-button>
                <a-button>创建单位学习小组</a-button>               
            </div>
            <div class="createConWrap">           
                <div class="groupNameWrap">
                    <span>小组名称<i>*</i>：</span>
                    <a-input class="groupName" v-model="groupName" placeholder="请输入想创建的交流小组名称" />
                </div>
                <upload-img>
                    <span>小组头像：</span>
                </upload-img>
                <div class="">
                    <span>是否审核：</span>
                    <a-radio-group name="radioGroup" :defaultValue="0">
                        <a-radio :value="0">需要审核</a-radio>
                        <a-radio :value="1">不需要审核</a-radio>
                    </a-radio-group>   
                </div> 
                <div class="groupDescriptionWrap">
                    <span>小组描述：</span>
                    <a-textarea class="groupDescription" :rows="4" v-model="groupDescription" placeholder="请输入小组描述......" />
                </div> 
                <div class="submitBtnWrap">
                    <a-button class="greenBtn">提交</a-button> 
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
export default {
    name: 'prompt',
    data() {
        return {
            groupName: '', 
            groupDescription: '' // 小组描述          
        }
    },
    components: {
        XAvatar,
        XPrompt,
        RightTitle,
        UploadImg
    },
    methods: {

    },

}
</script>

<style lang='less' scoped>
.createGroupTopWrap{
    display: flex;
    .createRightTop{
        background-color: #ffffff;
        .createBtnWrap{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 669px;
            height: 69px;
            border-bottom: 1px solid #dcdcdc;
            button.createChatGroup{
                margin-right: 102px;
            }
        }
        .createConWrap{
            padding: 40px 114px 0 114px;
            div{
                display: flex;
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
                padding-top: 163px;
            }                     
        }
    }
}
</style>
