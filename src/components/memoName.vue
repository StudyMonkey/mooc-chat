<template>
    <div class="memoNameWrap">
        <div v-if="memoNameShow">
            <i>{{ memoName ? memoName : ( from === '1' ? '昵称' : '暂无添加备注') }}</i>
            <span @click="handlePenClick" class="iconfont iconpen"></span>
        </div>
        <div class="memoNameBtnWrap" v-else>
            <a-input v-model="memoName" :placeholder="from === '1' ? '请输入昵称' : '请输入备注名'" class="memoName" />
            <a-button size="small" @click="saveMemoName">保存</a-button>
        </div>        
    </div>
</template>

<script>
export default {
    name: 'memoName',
    data(){
        return {
            memoName: '',
            memoNameShow: true
        }
    },
    props: {
        // chat传递过来的参数，默认为0，在通讯录页面也有调用
        from: {
            type: String,
            default: '0'
        }
    },
    methods: {
        /**
         * 点击修改备注名事件
         */
        handlePenClick(){
            this.memoNameShow = false;
        },
        saveMemoName(){
            this.memoNameShow = true;
            this.$emit('saveMemoName', this.memoName);
        }
    },
}
</script>

<style lang="less" scoped>
.memoNameWrap{
    line-height: 18px;
    span.iconfont{
        cursor: pointer;
        color: #f0b577;
        margin-left: 4px;
    }
    .memoNameBtnWrap{
        display: flex;
        input{
            height: 26px;
            margin-right: 5px;
        }
    }
}

</style>

