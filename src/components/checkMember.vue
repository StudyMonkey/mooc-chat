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
        <list-user @sendCheckLiToParent="handleSendCheckLiToParent" :listUser="checkMemberList">
            <a-checkbox  @change="onChange" />
        </list-user>
        <div class="chosedNumWrap">
            <span class="word">已选<i>{{hasCheckedList.length}}</i>人</span>
            <a-button class="greenBtn" size="small" @click="checkMemberSureBtn">确定</a-button>
        </div>
        
    </div>
</template>

<script>
import ListUser from '@/components/listUser'
import { debounce, matchChangeColor, clearMatchColor } from '@/utils/utils'
export default {
    name: 'checkMember',
    data() {
        return {
            searchVal: '',
            pageNo: 1,
            checkMemberList: [],
            saveCheckMemberList: [], // 暂存请求到的数据
            hasCheckedList: [], // 勾选上的好友列表
        }
    },
    components: {
        ListUser
    },
    methods: {
        emitEmpty(){
            this.searchVal = ''
        },
        onChange(e) {
            console.log(`checked = ${e.target.checked}`)
        },
        /**
         *  传递给chatPage父组件一个显示隐藏的值  
         */        
        handleCloseClick() {
            this.$emit('quickCreateGroup', true);
        },
        /**
         *  处理listUser传递过来的参数
         */
        handleSendCheckLiToParent(item){
            const index = this.hasCheckedList.findIndex( v => v === item );
            if ( index === -1 ) {
                this.hasCheckedList.push(item);
            } else {
                this.hasCheckedList.splice(index, 1);
            }          
        },
        /**
         *  点击确定按钮传递给父组件所勾选的好友和隐藏状态
         */
        checkMemberSureBtn(){
            console.log(this.hasCheckedList);
            this.$emit('checkMemberSureBtn', this.hasCheckedList);

            // this.hasCheckedList = []
        }
    },
    async created() {
        const res = await this.$getData('/myFriends.do', {eid: this.$myEid, pageNo: this.pageNo});
        console.log(res);
        const { data: { rows } } = res;
        this.checkMemberList = rows;
        this.saveCheckMemberList = this.checkMemberList;

        // 节流操作
        this.$watch('searchVal', debounce(async (newQuery) => {
            // newQuery为输入的值
            console.log(newQuery) 
            if ( newQuery !== '' ) {
                this.checkMemberList = this.checkMemberList.filter( v => v.remark.indexOf(newQuery) > -1);
                this.checkMemberList = matchChangeColor(this.checkMemberList, newQuery, 'remark');
                this.$emit('changeSearchVal', newQuery); 
            } else {
                clearMatchColor(this.checkMemberList, 'remark');
                this.checkMemberList = this.saveCheckMemberList;
            }
                                       
        }, 300))
    },
}
</script>

<style lang="less" scoped>
.checkMemberTopWrap{
    width: 250px;
    height: 698px;
    position: relative;
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
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        .word{
            color: #333333;
            i{
                color: #fc5b2c;
                margin: 0 5px;
            }
        }
        
        button{
            margin-left: auto;
        }
    }
}
</style>
