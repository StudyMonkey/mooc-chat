<template>
    <div class="noticeTopWrap">
        <div v-if="noticeList.length > 0">
            <ul class="lm_scroll">
                <li v-for="(item,index) in noticeList" :key="index">
                    <div class="noticeInfoWrap">
                        <span class="iconfont icongonggao"></span>
                        <p  @click="handleDivClick(index)" class="noticeTitle" v-text="item.title"></p>
                        <p class="dateTime" v-text="item.time"></p>
                    </div>
                    <div v-show="isActive === index">
                        <div class="noticeContentWrap" v-text="item.content"></div>
                        <a-button size="small" class="fr" @click="handleNoticeDelete(item)">删除</a-button>
                    </div>               
                </li>
            </ul>
        </div>
        <div v-else>暂无任何小组公告信息</div>
        <div class="createNoticeWrap">
            <div><span>公告标题：</span><a-input v-model="noticeTitle" placeholder="请输入您想创建的公告标题......" /></div>
            <div>
                <span>公告内容：</span>
                <a-textarea v-model="noticeContent" placeholder="请输入您想创建的公告内容......" :rows="4" />
            </div>
            <a-button size="small" @click="handleCreateNotice">创建</a-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'notice',
    props: {
        listNotice: {
            type: Array,
            required: true 
        }
    },
    data() {
        return {
            isActive: '',
            noticeList: [],
            noticeTitle: '', // 创建的话题标题
            noticeContent: '', // 创建的话题内容 
        }
    },
    watch: {
        listNotice(n, o) {
            if ( n !== o ) {
                this.noticeList = this.listNotice;
            }
        },
    },
    methods: {
        /*  展开收起按钮操作事件处理
        *   根据传入的index修改值
        */
        handleDivClick(index) {
            if ( this.isActive === index ) {
                this.isActive = ''
            } else {
                this.isActive = index
            }
        },
        /* 点击创建按钮的事件处理
        *  获取到公告的标题noticeTitle和内容noticeContent的值，push到数组
        *  再调用后台接口
        */
        handleCreateNotice(){
            if ( this.noticeTitle && this.noticeContent ) {
                let obj = {};
                obj.title = this.noticeTitle;
                obj.content = this.noticeContent;
                obj.creator = 'me'
                this.noticeList.push(obj);
                this.noticeTitle = '';
                this.noticeContent = '';
            } else {
                this.$message.error('部分信息填写不完整，请填写完整后点击创建');
            }
        },
        /**
         * 公告的点击删除事件处理
         */
        handleNoticeDelete(item){
            console.log(item);
            const index = this.noticeList.findIndex( v => v === item );
            this.noticeList.splice(index, 1);
            this.isActive = '';
        }
    },
    
}
</script>

<style lang="less" scoped>
.noticeTopWrap{
    margin-top: 15px;
    width: 638px;
    height: 598px;
    border: 1px solid #e5e5e5;
    position: relative;
    ul{
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
        li{         
            padding: 0 20px;
            overflow: hidden;
            &:hover{
                background-color: #fbf6ed;
            }
            .noticeInfoWrap{
                height: 50px;
                line-height: 50px;
                display: flex;
                span.icongonggao{
                    color: #43b30d;
                    margin-right: 7px;
                }
                .noticeTitle{
                    max-width: 410px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #333333;
                }
                .dateTime{
                    margin-left: auto;
                }              
            }
            .noticeContentWrap{
                border: 1px solid #dcdcdc;
                text-indent: 30px;
                padding: 14px 10px;
                background-color: #ffffff;
            }
            .ant-btn-sm{
                margin: 10px 0 20px 0;
            }
        }
    }
    .createNoticeWrap{
        padding: 15px 20px;
        background-color: #f5f5f5;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        div{
            display: flex;
            margin-bottom: 15px;
            span{
                line-height: 32px;
            }
            input{
                width: 524px;
            }
            textarea{
                width: 524px;
                resize: none
            }
        }
        button{
            margin-top: -5px;
            float: right;
            height: 27px;
            background-color: #70b24c;
            color: #fff;            
        }
    }
}
</style>

