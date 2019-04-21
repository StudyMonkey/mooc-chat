<template>
    <div class="settingTopWrap">
        <div class="setMiddleWrap">
            <div class="promptWrap">
                <span class="iconfont iconsixin"></span>
                温馨提示
            </div>
            <div class="promptContent">
                <p>【好友请求验证】和【小组请求验证】默认为直接通过，如果想不被打扰可更改设置；</p>
                <p>如果设置为拒绝添加好友，【是否允许推荐】也会<span>自动更改为拒绝推荐。</span></p>                                        
            </div>
        </div>
        <div class="systemSetWrap">
            <p class="systemTitle">系统设置</p>
            <div class="setSelectWrap">
                <div class="setSelect">
                    <span>好友请求验证：</span>            
                    <a-select v-model="selectFriend" style="width: 209px">
                        <a-select-option value="0">直接通过，无需验证</a-select-option>
                        <a-select-option value="1">需要经过我的同意</a-select-option>
                        <a-select-option value="2">不允许任何人加我为好友</a-select-option>                    
                    </a-select>
                </div>
                <div class="setSelect">
                    <span>小组请求验证：</span>            
                    <a-select v-model="selectGroup" style="width: 209px">
                        <a-select-option value="0">直接加入，无需验证</a-select-option>
                        <a-select-option value="1">需要经过我的同意</a-select-option>
                        <a-select-option value="2">不允许加入任何学习小组</a-select-option>                    
                    </a-select>
                </div>
                <div class="setSelect">
                    <span>是否允许推荐：</span>            
                    <a-select v-model="selectRecommand" style="width: 209px">
                        <a-select-option value="0">允许推荐</a-select-option>
                        <a-select-option value="1">不允许推荐</a-select-option>
                    </a-select>
                </div>
                <a-button @click="handleSubmit">提交</a-button> 
            </div>          
        </div>
    </div>
</template>

<script>
export default {
    name: 'setting',
    data() {
        return {
            selectFriend: "0",
            selectGroup: "0",
            selectRecommand: "0"
        }
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
    .setMiddleWrap{
        width: 250px;
        .promptWrap{
            display: flex;
            height: 36px;
            align-items: center;
            background-color: #e7e7e7;
            color: #666666;
            span{
                color: #ff5400;
                margin: 0 3px 0 11px;
            }
        }
        .promptContent{
            height: 664px;
            color: #444444;
            background-color: #f5f5f5;
            padding: 21px 17px 0 18px;
            p{
                text-indent: 23px;
            }
            span{
                color: #fd672b;
            }
        }
    } 
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

