<template>
    <div class="searchWrap">
        <a-input placeholder="搜索" v-model.trim="searchVal" ref="userNameInput">
            <a-icon slot="prefix" type="search" />
            <a-icon v-if="searchVal" slot="suffix" type="close-circle" @click="emitEmpty" />
        </a-input>
        <a-tooltip>
            <template slot="title">
                快速创建交流小组
            </template>
            <a-button @click="handleCreateGroupClick"><span class="iconfont iconincrease"></span></a-button>
        </a-tooltip>      
    </div>
</template>

<script>
import { debounce } from '@/utils/utils'
export default {
    name: 'searchWrap',
    data() {
        return {
            searchVal: ''
        }
    },
    methods: {
        // 清空搜索内容
        emitEmpty() {
            this.searchVal = ''
        },
        /**
         * 快速创建小组的点击事件处理
         */
        handleCreateGroupClick(){
            this.$emit('quickCreate', false);
        }
    },
    created () {
        // 节流操作
        this.$watch('searchVal', debounce(async (newQuery) => {
            // newQuery为输入的值
            console.log(newQuery) 
            this.$emit('changeSearchVal', newQuery);                            
        }, 300))
    },
}
</script>

<style lang='less' scoped>
.searchWrap{
    display: flex;
    padding: 22px 14px 21px 14px;
    background-color: #dddddd;
    .ant-btn{
        padding: 0 6px;
        height: 27px;
        &:hover{
            color: #ff5400
        }
        span.iconfont{
            font-size: 14px;
        }
    }
    /deep/.ant-input{
        width: 188px;
        height: 27px;
    }        
}
</style>
