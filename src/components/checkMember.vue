<template>
    <div class="checkMemberTopWrap">
        <div class="checkSearchWarap">
            <slot></slot>
            <a-input placeholder="搜索" v-model="searchVal" ref="userNameInput">
                <a-icon slot="prefix" type="search" />
                <a-icon v-if="searchVal" slot="suffix" type="close-circle" @click="emitEmpty" />
            </a-input>
            <span class="iconfont icondelete" @click="handleCloseClick"></span>
        </div>
        <list-user :listUser="checkMemberList">
            <a-checkbox  @change="onChange" />
        </list-user>
        <div class="chosedNumWrap">
            <span class="word">已选<i>10</i>人</span>
            <a-button class="greenBtn" size="small">确定</a-button>
        </div>
        
    </div>
</template>

<script>
import ListUser from '@/components/listUser'
export default {
    name: 'checkMember',
    data() {
        return {
            searchVal: '',
            checkMemberList: []
        }
    },
    components: {
        ListUser
    },
    methods: {
        onChange(e) {
            console.log(`checked = ${e.target.checked}`)
        },        
        handleCloseClick() {
            this.$emit('quickCreateGroup', true);
        }
    },
    async created() {
        const res = await this.$getData('checkMemberList', {});
        const { data: { data } } = res;
        this.checkMemberList = data
    },
}
</script>

<style lang="less" scoped>
.checkMemberTopWrap{
    width: 250px;
    height: 698px;
    .checkSearchWarap{
        width: 250px;
        height: 70px;
        background-color: #dddddd;
        padding: 9px 8px 10px 17px;
        position: relative;
        /deep/.ant-input{
            height: 27px;
        }
        span.icondelete{
            position: absolute;
            top: 9px;
            right: 8px;
            font-size: 14px;
            cursor: pointer;
            line-height: 10px;
            color: #7d94a8;
        }
    }
    ul{
        height: 588px;
    }
    .chosedNumWrap{
        height: 40px;
        background-color: #dddddd;
        display: flex;
        padding: 8px 8px 7px 17px;
        .word{
            color: #333333;
            i{
                color: #fc5b2c;
            }
        }
        
        button{
            margin-left: auto;
        }
    }
}
</style>
