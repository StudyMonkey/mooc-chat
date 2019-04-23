<template>
    <div class="settingTopWrap">
        <x-prompt>
            <p>【好友请求验证】和【小组请求验证】默认为直接通过，如果想不被打扰可更改设置；</p>
            <p>如果设置为拒绝添加好友，【是否允许推荐】也会<span>自动更改为拒绝推荐。</span></p>             
        </x-prompt>
        <div class="systemSetWrap">
            <p class="systemTitle">系统设置</p>
            <div class="setSelectWrap">
                <div class="setSelect">
                    <span>好友请求验证：</span>            
                    <a-select v-model="selectFriend" style="width: 209px">
                        <a-select-option value="0">直接通过，无需验证</a-select-option>
                        <a-select-option value="1">需通过验证添加好友</a-select-option>
                        <a-select-option value="2">拒绝添加好友</a-select-option>                    
                    </a-select>
                </div>
                <div class="setSelect">
                    <span>小组请求验证：</span>            
                    <a-select v-model="selectGroup" style="width: 209px">
                        <a-select-option value="0">直接通过，无需验证</a-select-option>
                        <a-select-option value="1">通过验证添加小组</a-select-option>                  
                    </a-select>
                </div>
                <div class="setSelect">
                    <span>是否允许推荐：</span>            
                    <a-select v-model="selectRecommand" style="width: 209px">
                        <a-select-option value="0">允许推荐</a-select-option>
                        <a-select-option value="1">拒绝推荐</a-select-option>
                    </a-select>
                </div>
                <a-button @click="handleSubmit">提交</a-button> 
            </div>          
        </div>
    </div>
</template>

<script>
import XPrompt from '@/components/prompt'
export default {
    name: 'setting',
    data() {
        return {
            selectFriend: "0",
            selectGroup: "0",
            selectRecommand: "0"
        }
    },
    components: {
        XPrompt,
    },
    methods: {
        handleSubmit(){
            console.log(this.selectFriend, this.selectGroup, this.selectRecommand);
            this.$message.success('修改系统设置成功');
        }
    },
}
</script>

<style lang="less" scoped>
.settingTopWrap{
    display: flex;
    .systemSetWrap{
        width: 670px;
        .systemTitle{
            height: 36px;
            line-height: 36px;
            background-color: #f5f5f5;
            color: #666666;
            text-indent: 16px;
        }
        .setSelectWrap{
            text-align: center;
            color: #333333;
            div.setSelect{
                margin-top: 30px;
            }
            button{
                margin-top: 430px;
                background-color: #70b24c;
                color: #ffffff;
            }
        }
    }   
}

</style>

