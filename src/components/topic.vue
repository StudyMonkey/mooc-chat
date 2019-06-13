<template>
    <div>
        <div class="chatTopicWrap" v-if="!showChat">
            <ul class="lm_scroll topicUlWrap">
                <li 
                    class="topicListLi" 
                    v-for="(item,index) in topicList" 
                    :key="index"
                    @click="handleTopicLiClick(item)"
                >
                    <span class="iconfont iconhuati"></span>
                    <p class="topicTitle" v-text="item.topicName"></p>
                    <p class="topicOwner">创建者：<span v-text="item.topicEidName"></span></p>
                </li>
                <x-pagination 
                    v-show="total > 10"
                    :total="total" 
                    @pageChange="handlePageChange"             
                />                
            </ul>
            <div class="createTopicWrap">
                <span>话题名称：</span>
                <a-input v-model="createTopicName" placeholder="请输入话题名称......" />
                <a-button class="greenBtn" size="small" @click="handleTopicCreate">创建</a-button>
            </div>
        </div>
        <div v-else>
            <div class="chosedTopicWrap">
                <a-button @click="handleTopicBackBtn" size="small">返回</a-button>
                <p class="topicTitle" v-text="chosedTopicTitle"></p>
                <p class="topicOwner">创建者：<span v-text="chosedTopicOwner"></span></p>
            </div>
            <div class="topicChat">
                <chat-main />
            </div>           
        </div>        
    </div>

</template>

<script>
import ChatMain from '@/components/chat'
import XPagination from '@/components/pagination'
export default {
    name: 'topic',
    components: {
        ChatMain,
        XPagination
    },
    props: {
        listTopic: {
            type: Array,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
    },
    watch: {
        listTopic(n,o){
            this.topicList = this.listTopic;
        },
        total(n,o){
            if ( n !== o ) {
                console.log(this.total)
            }
        }
    },
    data() {
        return {
            showLoad: false,
            showChat: false,
            topicList: [], 
            chosedLi: this.$store.state.chosedLi,  // 从vuex里面获取  
            pageNo: 1,  // 当前页码数        
            chosedTopicTitle: '', // 所选话题标题
            chosedTopicOwner: '', // 所选话题创建者
            createTopicName: '' // 创建话题名称
        }
    },
    methods: {
        async handleTopicLiClick(item) {
            this.chosedTopicTitle = item.topicName;
            this.chosedTopicOwner = item.topicEidName;
            this.showChat = true;
            const res = await this.$getData('/chat/enterTopic.action', {
                topicId: item.topicId,  // 'a776d19e-29e8-484d-b506-f857bbe943d9'
            });
            const { data: { rows } } = res;
            console.log(res);
        },
        handleTopicBackBtn(){
            this.showChat = false
        },
        async handleTopicCreate(){
            if ( this.createTopicName ) {
                const res = await this.$getData('/chat/createTopic.action', {
                    topicName: this.createTopicName,
                    groupId: this.chosedLi.groupId
                });
                const { data: { success, msg } } = res;
                if ( success === true && msg === "createdSuccess" ) {
                    this.$message.success('创建话题成功');
                    const res = await this.$getData('/chat/getTopics.action', {
                        pageNo: this.pageNo,
                        groupId: this.chosedLi.groupId,
                    });
                    this.topicList = res.data.rows;
                    console.log(this.topicList);                     
                }
                this.createTopicName = '';
            } else {
                this.$message.error('话题名称不能为空');
            }
        },
        /**
         * 翻页点击事件
         */
        async handlePageChange(pageNumber) {
            this.pageNo = pageNumber;
            const res = await this.$getData('/chat/getTopics.action', {
                pageNo: this.pageNo,
                groupId: this.chosedLi.groupId,
            });
            const { data: { rows } } = res;
            this.topicList = rows;      
        },        
    },
    created(){
        console.log(this.total);
        console.log(this.$store.state.chosedLi);
    }
}
</script>

<style lang="less">
.chatTopicWrap{
    width: 638px;
    height: 598px;
    margin-top: 15px;
    border: 1px solid #e5e5e5;
    background-color: #ffffff;
    position: relative;
    ul.topicUlWrap{
        height: 498px;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        .topicListLi{
            display: flex;
            padding: 0 20px;
            height: 42px;
            line-height: 42px;
            &:hover{
                background-color: #fbf6ed
            }
            span.iconhuati{
                color: #46b30f;
                margin: 0 7px 0 0;
            }
            .topicTitle{
                max-width: 460px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                cursor: pointer;
            }
            .topicOwner{
                margin-left: auto;
            }
        }
    }  
    .createTopicWrap{
        padding: 35px 20px;
        background-color: #f5f5f5;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        span{
            font-size: 14px;
        }
        input{
            width: 466px;
            height: 27px;
            margin-right: 6px;
        }
    }
}
.chosedTopicWrap{
    width: 638px;   
    display: flex;
    margin: 15px 0 0 0;
    padding: 7px 10px;
    border: 1px solid #e5e5e5;
    background-color: #f5f5f5;
    align-items: center;
    .topicTitle{
        margin-left: 10px;
        max-width: 460px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .topicOwner{
        margin-left: auto;
    }

}
.topicChat{
    .chatMainBox{
        margin-top: 0;
        .chatScrollArea{
            height: 386px;
        }
    }
}
</style>

