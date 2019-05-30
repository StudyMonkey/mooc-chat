<template>
    <ul class="lm_scroll listUserUlWrap">
        <li 
            v-for="item in checkMemberList" 
            :key="item.id"
            :class="isActive === item.id ? 'bg_active' : ''"
            @click="handleListUserClick(item)"
        >
            <x-avatar :imgUrl="item.avatar" />
            <p v-html="item.username"></p>
            <div class="checkboxWrap" @click="handleSendToCheckMember(item)">
                <slot></slot>
            </div>            
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
            checkMemberList: [],
            isActive: ''
        }
    },
    methods: {
        handleListUserClick(item) {          
            if ( this.type ) {
                this.isActive = item.id;
                this.$emit('toAddressList', item);
            }
        },
        handleSendToCheckMember(item){
            console.log(item);
            this.$emit('sendCheckLiToParent', item);
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
        &.bg_active{
            background-color: #f3e2cb;
        }
        .ant-avatar{
            margin-right: 9px;
        }
        .checkboxWrap{
            margin-left: auto;
        }
    }    
}
</style>