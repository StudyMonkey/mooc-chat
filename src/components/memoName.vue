<template>
    <div class="memoNameWrap">
        <div v-if="memoNameShow">
            <i>{{ person.remark ? person.remark : ( from === '1' ? '昵称' : '暂无添加备注') }}</i>
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
    props: {
        // chat传递过来的参数，默认为0，在通讯录页面也有调用
        from: {
            type: String,
            default: '0'
        },
        user: {
            type: Object,
            required: true,
            default: {}
        }
    },
    data(){
        return {
            memoNameShow: true,
            person: this.user,
            memoName: ''
        }
    },  
    watch: {
        user: {
            handler(n, o) {
                console.log(this.person);
                if ( n !== o ) {
                    this.person = this.user;
                    this.memoName = this.person.remark
                }
            },
            deep: true
        }
    }, 
    methods: {
        /**
         * 点击修改备注名事件
         */
        handlePenClick(){
            this.memoNameShow = false;
        },
        async saveMemoName(){
            this.person.remark = this.memoName
            const res = await this.$postData('/modifyRemark.do', { 
                userEid: this.$myEid,
                friendEid: this.person.friendEid,
                remark: this.person.remark
            })
            console.log(res);
            if ( res.data.success ) {
                this.memoNameShow = true;
                this.$emit('saveMemoName');
            }

        },
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

