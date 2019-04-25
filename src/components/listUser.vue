<template>
    <ul class="lm_scroll listUserUlWrap">
        <li 
            v-for="item in checkMemberList" 
            :key="item.id"
            @click="handleListUserClick(item)"
        >
            <x-avatar :imgUrl="item.avatar" />
            <span v-text="item.name"></span>
            <slot></slot>
        </li>
    </ul>
</template>

<script>
import XAvatar from '@/components/avatar'
export default {
    name: 'listUser',
    props: {
        listUser: {
            type: Array,
            required: true 
        },
        type: {
            type: String,
            default: ''
        }
    },
    watch: {
        listUser(n, o) {
            if ( n !== o ){
                this.checkMemberList = this.listUser;
            }
        }
    },
    components: {
        XAvatar,
    },
    data() {
        return {
            checkMemberList: []
        }
    },
    methods: {
        handleListUserClick(item) {
            if ( this.type ) {
                this.$emit('toAddressList', item);
            }
        }
    },
}
</script>

<style lang="less" scoped>
.listUserUlWrap{
    overflow-y: auto;
    li{
        display: flex;
        padding: 10px 20px 10px 10px;
        line-height: 40px;
        &:hover{
            background-color: #f3e2cb;
        }
        .ant-avatar{
            margin-right: 9px;
        }
        .ant-checkbox-wrapper{
            margin-left: auto;
        }
    }    
}
</style>