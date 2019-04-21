<template>
    <div class="fileTopWrap">
        <div class="table_area">
            <table class="limitadm_table1">
                <tbody>
                    <tr class="h50 tr1">
                        <td class="filename">文件名</td>
                        <td class="fileAuthor">上传者</td>
                        <td class="fileDateTime">上传时间</td>
                        <td class="operate">操作</td>
                    </tr>
                    <tr v-for="(item,index) in fileList" :key="index">
                        <td class="filename overHidden">
                            <span class="iconfont iconwenjian1"></span>
                            <span v-text="item.filename"></span>
                        </td>
                        <td class="fileAuthor overHidden" v-text="item.fileauthor">
                        </td>
                        <td class="fileDateTime" v-text="item.time"></td>
                        <td class="operate">                          
                            <a-tooltip>
                                <template slot="title">
                                    下载该文件
                                </template>
                                <span class="iconfont iconxiazai"></span>
                            </a-tooltip>                            
                            <a-tooltip>
                                <template slot="title">
                                    分享该文件
                                </template>
                                <span class="iconfont iconfenxiang"></span>
                            </a-tooltip>
                            <a-tooltip>
                                <template slot="title">
                                    删除该文件                                      
                                </template>  
                                <span @click="handleDeleteFile" class="iconfont icondelete"></span>                      
                            </a-tooltip>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <x-pagination @pageChange="handlePageChange" />
    </div>
</template>

<script>
import XPagination from '@/components/pagination'
export default {
    name: 'file',
    props: {
        listFile: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            fileList: []
        }
    },
    watch: {
        listFile(n, o) {
            if ( n !== o) {
                this.fileList = this.listFile;
            }
        }
    },
    components: {
        XPagination,
    },
    methods: {
        async handlePageChange(pageNum) {
            console.log(pageNum);
            this.$emit('changeShowLoad', true);
            const res = await this.$getData('fileList', {});
            this.$emit('changeShowLoad', false);
            const { data: { data } } = res;
            this.fileList = data;
        },
        handleDeleteFile(){
            let _this = this;
            this.$confirm({
                title: '确定删除该文件？',
                okText: '确认',
                cancelText: '取消',
                onOk(){
                    _this.$emit('changeShowLoad', true);
                    setTimeout(() => {
                        _this.$emit('changeShowLoad', false);
                        _this.$message.success('删除文件成功');
                    }, 1000)
                }
            })
        }
    },
}
</script>

<style lang='less' scoped>
.fileTopWrap{
    margin-top: 15px;
    width: 638px;
    height: 600px;
    border: 1px solid #e5e5e5;
    position: relative;
    .limitadm_table1{
        width: 100%;
        table-layout:fixed;
        tr.h50{
            height: 50px;
            line-height: 50px;
            background-color: #f5f5f5;
            td{
                color: #2e766e;
                font-size: 16px;
                font-weight: bold;
                &.filename{
                    padding-left: 38px;
                }
                &.operate{
                    justify-content: center;
                }
            }
        }
        tr{
            &:hover{
                background-color: #fbf6ed;
            }
        }
        td{
            height: 50px;
            line-height: 50px;
            font-size: 14px;
            color: #333333;
            &.filename{
                width: 360px;
                padding-left: 20px;
                word-break:keep-all;               
                span.iconfont{
                    float: left;
                    margin-right: 4px;
                }
                span.iconwenjian1{
                    color: #58bb28;
                }
            }
            &.fileAuthor{
                width: 90px;
                word-break:keep-all;
            }
            &.fileDateTime{
                width: 90px;
                text-align: center;
                line-height: 25px;
                padding-right: 10px;
            }
            &.operate{
                width: 76px;
                text-align: center;                
                display: flex;
                color: #999999;
                span{
                    cursor: pointer;
                    &:hover{
                        color: #f1bd85;
                    }
                }
                span.iconxiazai{
                    margin-right: auto
                }
                span.icondelete{
                    margin-left: auto
                }
            }
        }
    }
    .paginationWrap{
        position: absolute;
        bottom: 12px;
        left: 0;
        right: 0;
        .ant-pagination{
            text-align: center;
        } 
    }
   
}
</style>
