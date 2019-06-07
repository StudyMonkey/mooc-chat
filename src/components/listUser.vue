<template>
    <div :class="[showLoadMore ? 'height600' : 'height628', 'lm_scroll listUserUlWrap']">
        <ul>
            <li 
                v-for="item in checkMemberList" 
                :key="item.id"
                :class="isActive === item.friendEid ? 'bg_active' : ''"
                @click="handleListUserClick(item)"
            >
                <x-avatar :imgUrl="item.imgUrl" />
                <span v-html="item.remark"></span>
                <div class="checkboxWrap" @click="handleSendToCheckMember(item)">
                    <slot></slot>
                </div>            
            </li>
        </ul>
        <div class="searchNoResult" v-show="checkMemberList.length < 1">
            <span class="searchBg iconfont iconsousuo-copy"></span>
            <div>
                <p>未匹配到任何好友</p>
                <p class="overHidden">搜索内容:<span>{{inputSearchVal}}</span></p>
            </div>
        </div>        
    </div>

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
        },
        inputSearchVal: {
            type: String,
        },
        showLoadMore: {
            type: Boolean
        }
    },
    watch: {
        listUser(n, o) {
            if ( n !== o ){
                this.checkMemberList = this.listUser;
                if ( this.checkMemberList.length < 1 ) {
                    this.searchNoResult = true;
                }
            }
        },
        inputSearchVal(n,o){
            if ( n !== o ) {
                console.log(this.inputSearchVal)
            }
        }
    },
    components: {
        XAvatar,
    },
    data() {
        return {
            checkMemberList: [],
            isActive: '',
            searchNoResult: false
        }
    },
    methods: {
        async handleListUserClick(item) {          
            if ( this.type ) {
                this.isActive = item.friendEid;
                const res = await this.$getData('/friendDept.do', { eid: item.friendEid});
                console.log(res);
                const { data: { obj } } = res;
                item.obj = obj;
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
.height600{height: 600px;}
.height628{height: 628px;}
.listUserUlWrap{
    overflow-y: auto;
    ul{
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
    .searchNoResult{
        display: flex;
        padding: 10px;
        .searchBg{
            display: inline-block;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #ffffff;
            background-color: #70b24c;
            margin-right: 10px;
        }
        div{
            p.overHidden{
                width: 170px;
            }
        }
    }    
}
</style>