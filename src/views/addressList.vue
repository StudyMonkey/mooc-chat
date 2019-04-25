<template>
    <div class="addressListTopWrap">
        <div class="middleWrap">
            <search-wrap @changeSearchVal="handleChangeSearchVal" />
            <list-user @toAddressList="handleAcceptAddressList" type="addressUserList" :listUser="addressUserList" />
        </div>
        <div class="addressListRightWrap">
            <div v-if="hasChosed" class="hasChosed">未选择时显示的样式</div>
            <div v-else>
                <div class="addressTitleWrap">
                    <x-avatar :imgUrl="oneUser.avatar" />
                    <span v-text="oneUser.name"></span>
                </div>
                <div class="addressInfoWrap">
                    <p>
                        <span>用户名：<i v-text="oneUser.username"></i></span>
                    </p>
                    <p>
                        <span>姓名：<i v-text="oneUser.name"></i></span>
                    </p> 
                    <p>
                        <span>单位：<i v-text="oneUser.part"></i></span>
                    </p> 
                    <p>
                        <span>备注名：<i>暂无添加备注</i><span class="iconfont iconpen"></span></span>
                    </p> 
                    <div class="addressBtnWrap">
                        <a-button size="small" @click="handleIsTop" v-text="oneUser.isTop ? '取消置顶' : '置顶' "></a-button>
                        <a-button class="greenBtn" size="small">发消息</a-button>    
                    </div>                                                           
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SearchWrap from '@/components/searchWrap'
import ListUser from '@/components/listUser'
import XAvatar from '@/components/avatar'
export default {
    name: 'member',
    data() {
        return {
            addressUserList: [],
            saveAddressUserList: [],
            hasChosed: true,
            oneUser: '',
            searchNoResult: false, // 搜索好友的结果显示
        }
    },
    components: {
        SearchWrap,
        ListUser,
        XAvatar
    },
    async created () {
        this.$store.commit('changeShowLoad', true);
        const res = await this.$getData('addressUserList', {});
        const { data: { data } } = res;
        console.log(data);
        this.addressUserList = data;
        this.saveAddressUserList = this.addressUserList;
        this.$store.commit('changeShowLoad', false);
    },
    methods: {
        /*  接受listUser传递过来的选择对象 */
        handleAcceptAddressList(item) {
            this.hasChosed = false;
            this.oneUser = item;
        },
        /**
         *  公用提示显示消息方法
         */
        commonMessage(title, mes){            
            let _this = this;
            this.$confirm({
                title,
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.oneUser.isTop = !_this.oneUser.isTop;
                    _this.$message.success(mes)
                }
            })            
        },

        /* 置顶和取消置顶的点击切换方法 */
        handleIsTop(){           
            if ( this.oneUser.isTop ) {
                this.commonMessage('确认将该好友取消置顶？', '取消置顶好友成功');
            } else {
                this.commonMessage('确认将该好友置顶？', '置顶好友成功');              
            }
        },
        /**
         *  接受searchWrap子组件传递过来的搜索的值
         */
        async handleChangeSearchVal(searchVal){
            console.log(searchVal);
            if ( searchVal !== '' ) {
                this.addressUserList = this.addressUserList.filter( v => v.name === searchVal);
                if ( this.addressUserList.length === 0 ) {
                    const res = await this.$getData('searchSomeMember', {});
                    console.log('搜索结果:', res);
                    if ( res.data.data ) {
                        const { data: { data } } = res;
                        this.addressUserList = data;
                    } else {
                        this.searchNoResult = true;
                    }
                }
            } else {
                this.addressUserList = this.saveAddressUserList;
            }
        }        
    },
}
</script>

<style lang="less" scoped>
.addressListTopWrap{
    display: flex;
    .addressListRightWrap{
        width: 669px;
        height: 698px;
        border: 1px solid #c1bfba;
        border-left: none;
        background-color: #ffffff;
        .hasChosed{
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        .addressTitleWrap{
            display: flex;
            padding: 15px 0;
            align-items: center;
            background-color: #f5f5f5;
            .ant-avatar{
                margin: 0 10px 0 15px;
            }
        }
        .addressInfoWrap{
            padding: 36px 0 0 195px;
            p{
                font-size: 14px;
                color: #333333;
                margin-bottom: 34px; 
                span.iconfont{
                    cursor: pointer;
                    color: #f0b577;
                }
            }
            .addressBtnWrap{
                .greenBtn{
                    margin-left: 30px;
                }
            }
        }

    }
}

    
</style>
