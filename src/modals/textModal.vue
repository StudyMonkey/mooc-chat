<template>
    <a-modal 
        title="添加文本链接"
        v-model="linkVisible"
        centered
        :visible.sync="textModalVisible"
        :footer="null"
    >
        <div class="linkAddressWrap linkAddressWrap_sec linkAddressWrap_sec1">
            <span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题<i>*</i>：</span>
            <a-input placeholder="请输入文本链接标题..." v-model="textLinkTitle" />
        </div>
        <div class="linkAddressWrap linkAddressWrap_sec">
            <span>链接地址<i>*</i>：</span>
            <a-input placeholder="请输入文本链接地址..." v-model="textLinkAddress" />
        </div>
        <div class="footerPrompt">
            <p><span class="iconfont icontishi"></span>可发送带有超链接的点击跳转的文字</p>
            <a-button class="greenBtn" @click="handleTextLinkSureBtn">确定</a-button>
        </div>
    </a-modal> 
</template>

<script>
export default {
    name: 'textModal',
    data(){
        return{
            textModalVisible: false,
            textLinkTitle: '',
            textLinkAddress: ''
        }
    },
    methods: {
        init() {
            console.log('init方法')
            this.textModalVisible = true
        },
        handleTextLinkSureBtn(){
            this.textModalVisible = false
            if ( this.textLinkTitle !== '' ) {
                this.$emit('handleText', this.textLinkTitle, this.textLinkAddress)
            }        
        }
    }
}
</script>