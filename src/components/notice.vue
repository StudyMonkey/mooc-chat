<template>
    <div class="noticeTopWrap">
        <ul>
            <li v-for="(item,index) in noticeList" :key="index">
                <div class="noticeInfoWrap">
                    <span class="iconfont iconbiaoqing"></span>
                    <p class="noticeTitle" v-text="item.title"></p>
                    <div @click="handleDivClick(index)">
                        <span v-text="isActive === index ? '收起' : '展开'"></span>
                        <span :class="['iconfont', isActive === index ? 'iconbiaoqing' : 'iconsixin']"></span>
                    </div>
                </div>
                <div class="noticeContentWrap" v-show="isActive === index" v-text="item.content"></div>
            </li>
        </ul>
        <div class="createNoticeWrap">
            <div><span>公告标题：</span><a-input placeholder="请输入您想创建的公告标题......" /></div>
            <div>
                <span>公告内容：</span>
                <a-textarea placeholder="请输入您想创建的公告内容......" :rows="4" />
            </div>
            <a-button size="small">创建</a-button>
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
            noticeList: []
        }
    },
    watch: {
        listNotice(n, o) {
            if ( n !== o ) {
                this.noticeList = this.listNotice;
                console.log(this.noticeList);
            }
        }
    },
    methods: {
        handleDivClick(index) {
            this.isActive = index;
        }
    },
    
}
</script>

<style lang="less" scoped>
.noticeTopWrap{
    margin-top: 15px;
    width: 638px;
    height: 600px;
    border: 1px solid #e5e5e5;
    position: relative;
    ul{
        li{         
            padding: 0 20px;
            &:hover{
                background-color: #fbf6ed;
            }
            .noticeInfoWrap{
                height: 50px;
                line-height: 50px;
                display: flex;
                span.iconbiaoqing{
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
                div{
                    margin-left: auto;
                }                
            }
            .noticeContentWrap{
                border: 1px solid #dcdcdc;
                text-indent: 30px;
                padding: 14px 10px;
                background-color: #ffffff;
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

