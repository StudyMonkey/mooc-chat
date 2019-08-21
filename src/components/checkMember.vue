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
        <div :class="[showLoadMore ? 'height600' : 'height628', 'lm_scroll listUserUlWrap']">
            <ul>
                <li 
                    v-for="item in checkMemberList" 
                    :key="item.id"
                >
                    <x-avatar :imgUrl="item.imgUrl" />
                    <span v-html="item.remark"></span>
                    <div class="checkboxWrap">
                        <a-checkbox :checked="item.checked"  @change="onChange($event, item)" />
                    </div>            
                </li>
            </ul>
            <div class="searchNoResult" v-show="checkMemberList.length < 1">
                <span class="searchBg iconfont iconsousuo-copy"></span>
                <div>
                    <p>未匹配到任何好友</p>
                    <p class="overHidden">搜索内容:<span>{{searchVal}}</span></p>
                </div>
            </div>        
        </div>        
        <!-- <list-user @sendCheckLiToParent="handleSendCheckLiToParent" :listUser="checkMemberList">
            <a-checkbox  @change="onChange" />
        </list-user> -->
        <div class="chosedNumWrap">
            <span class="word">已选<i>{{hasCheckedList.length}}</i>人</span>
            <a-button class="greenBtn" size="small" @click="checkMemberSureBtn">确定</a-button>
        </div>
        
    </div>
</template>

<script>
// import ListUser from '@/components/listUser'
import XAvatar from '@/components/avatar'
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
            showLoadMore: false,   // 加载更多的控制显示与隐藏
            saveClearCheckArr: this.clearCheckArr,  //  chat 组件传递过来的值
        }
    },
    props: {
        useType: { // 使用类型分为 1 创建多人聊天小组时使用， 2 发送名片时点击使用
            type: String,
            default: '1'
        },
        clearCheckArr: {
            type: Number,
            default: 1
        }
    },
    watch: {
        clearCheckArr: {
            handler (n, o) {
                this.saveClearCheckArr = n;
                if ( n !== o && this.saveClearCheckArr === 2 ) {
                    console.log('clearCheckArr的值', this.clearCheckArr);
                    this.checkMemberList.map ( v => {
                        v.checked = false
                    })
                    this.hasCheckedList = [];
                    this.saveClearCheckArr = 1;
                    
                }
            },
            deep: true
        }
    },
    components: {
        XAvatar
    },
    methods: {
        emitEmpty(){
            this.searchVal = ''
        },
        onChange(e, item) {
            console.log('useType', this.useType);
            if ( item.is_recommend === 2 || item.friends_auth === 3 ) {
                this.$message.error('该好友设置不允许推荐/添加好友');
                item.checked = !e.target.checked;
                return false;
            }
            item.checked = e.target.checked;
            const index = this.hasCheckedList.findIndex( v => v === item );
            if ( index === -1 ) {
                if ( this.useType === '2' && this.hasCheckedList.length > 0 ) {
                    this.$message.info('发送名片功能每次只允许发送一人');
                    item.checked = !e.target.checked;
                } else {
                    this.hasCheckedList.push(item);
                }           
            } else {
                this.hasCheckedList.splice(index, 1);
            } 
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
        // handleSendCheckLiToParent(item){
        //     console.log('useType', this.useType);
        //     console.log(this.hasCheckedList.length);
        //     const index = this.hasCheckedList.findIndex( v => v === item );
        //     if ( index === -1 ) {
        //         if ( this.useType === '2' && this.hasCheckedList.length > 0 ) {
        //             this.$message.info('发送名片功能每次只允许发送一人');
        //         } else {
        //             this.hasCheckedList.push(item);
        //         }           
        //     } else {
        //         this.hasCheckedList.splice(index, 1);
        //     }          
        // },
        /**
         *  点击确定按钮传递给父组件所勾选的好友和隐藏状态
         */
        checkMemberSureBtn(){
            console.log(this.hasCheckedList);
            this.$emit('checkMemberSureBtn', this.hasCheckedList);
        }
    },
    async created() {
        const res = await this.$getData('/myFriends.do', {eid: this.$myEid, pageNo: this.pageNo});
        console.log(res);
        const { data: { rows } } = res;
        this.checkMemberList = rows;
        this.checkMemberList.map ( v => v.checked = false );
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
