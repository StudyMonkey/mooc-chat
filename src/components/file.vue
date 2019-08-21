<template>
    <div class="fileTopWrap">
        <a-modal 
            title="分享到其他小组"
            v-model="shareVisible"
            centered
            :footer="null">
            <div class="shareSearchWrap">
                <span class="searchWordSpan">查找相关小组：</span>
                <a-input class="searchGroupInput" v-model="searchGroup">
                    <a-icon v-if="searchGroup" slot="suffix" type="close-circle" @click="emitSearchGroupEmpty" />
                </a-input>
                <a-button @click="handleShareGroupSearch">搜索</a-button>
            </div>
            <div class="searchGroupTableWrap">
                <table class="limitadm_table1 searchGroupTable">
                    <thead>
                        <tr class="h50 tr1">
                            <td class="checkboxTd" style="width:50px"></td>
                            <td class="groupName">小组名称</td>
                            <td class="groupDesc">小组描述</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in searchGroupResult" :key="item.groupId">
                            <td class="checkboxTd" style="width:50px">
                                <a-checkbox 
                                    :checked="item.checked"
                                    @change="handleGroupResultCheck($event, item)"
                                ></a-checkbox>
                            </td>
                            <td v-text="item.name" :title="item.name"></td>
                            <td v-text="item.description ? item.description : '暂无小组描述'"></td>
                        </tr>
                    </tbody>               
                </table>
            </div>
            <div class="searchGroupBtnWrap">
                <a-checkbox 
                    @change="handleAllCheck" 
                    :checked="this.searchResultCheck.length > 0 && this.searchResultCheck.length === this.searchGroupResult.length"
                ><span class="fl">全选：</span></a-checkbox>
                <a-button @click="handleSearchGroupShareBtn">分享</a-button>
            </div>
        </a-modal> 
        <div class="table_area">
            <table class="limitadm_table1">
                <tbody>
                    <tr class="h50 tr1">
                        <td class="filename">文件名</td>
                        <td class="fileAuthor">上传者</td>
                        <td class="fileDateTime">上传时间</td>
                        <td class="operate">操作</td>
                    </tr>
                    <div v-if="fileList.length > 0" style="width: 636px;">
                        <tr 
                            
                            v-for="(item,index) in fileList" 
                            :key="index"
                        >
                            <td class="filename overHidden">
                                <span class="iconfont iconwenjian1"></span>
                                <span v-text="item.fileName"></span>
                            </td>
                            <td class="fileAuthor overHidden" v-text="item.fileEidName">
                            </td>
                            <td class="fileDateTime" v-text="item.createDate"></td>
                            <td class="operate" style="width: 90px;">                          
                                <a-tooltip>
                                    <template slot="title">
                                        下载
                                    </template>
                                    <span 
                                        class="iconfont iconxiazai"
                                        @click="handleDownloadFile(item)"
                                    ></span>
                                </a-tooltip>                            
                                <a-tooltip>
                                    <template slot="title">
                                        分享
                                    </template>
                                    <span 
                                        class="iconfont iconfenxiang"
                                        @click="handleShareModalShow(item)"
                                    ></span>
                                </a-tooltip>
                                <a-tooltip>
                                    <template slot="title">
                                        删除                                      
                                    </template>  
                                    <span                                        
                                        @click="handleDeleteFile(item)" 
                                        class="iconfont icondelete"
                                        v-if="memberType === '3' || item.fileEid === $myEid"
                                    ></span>                      
                                </a-tooltip>                          
                            </td>
                        </tr>
                    </div>
                    <div class="noHaveFile" v-else>暂无任何群文件上传记录</div>
                </tbody>
            </table>
        </div>
        <x-pagination 
            v-show="total > 7" 
            :total="total" 
            @pageChange="handlePageChange" 
        />
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
        },
        total: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            chosedLi: this.$store.state.chosedLi,
            fileList: [],
            filePageNo: 1,
            memberType: this.$store.state.memberType,  // 从vuex取出来的用户权限
            searchGroupResult: [],  // 搜索其他小组的结果数组
            searchResultCheck: [],  // 将check的值放入的数组
            shareVisible: false,    // 控制分享其他小组的显示隐藏
            searchGroup: '',        // 搜索小组的输入值
            fileChecked: false,
            chosedShareItem: {}  // 所选择的分享的列表对象
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
        /**
         *  翻页事件处理
         */
        async handlePageChange(pageNum) {
            this.filePageNo = pageNum
            thsi.getFileList();
        },
        handleDownloadFile(item){
            console.log(item);
        },
        /**
         *  查找相关小组的事件处理
         */
        async handleShareGroupSearch(){
            if ( this.searchGroup !== '' ) {
                const res = await this.$getData('/leftHotGroups.do', {
                    eid: this.$myEid,
                    name: this.searchGroup,
                    pageNo: 1,
                    isGroup: true
                });
                const { data: { rows } } = res;
                this.searchGroupResult = rows;
            } else {
                this.$message.info('小组名称不能为空');
            }
        },
        /**
         *  清空查找相关小组
         */
        emitSearchGroupEmpty(){
            this.searchGroup = '';
        },
        /**
         *  查找的小组checkbox勾选效果
         */
        handleGroupResultCheck(e, item){
            if ( e.target.checked ) {
                item.checked = true;
                this.searchResultCheck.push(item);
            } else {
                item.checked = false;
                const index = this.searchResultCheck.findIndex( v => v.groupNo === item.groupNo );
                this.searchResultCheck.splice(index, 1);
            }
        },
        /**
         *  全选的checkbox事件处理
         */
        handleAllCheck(e){           
            if ( e.target.checked ) {
                this.searchGroupResult.map ( v => {                 
                    v.checked = true;                                
                    this.searchResultCheck.push(v)
                })
            } else {
                this.searchGroupResult.map ( v => {
                    v.checked = false;
                })                
                this.searchResultCheck = []
            }
        },
        /*
         *  分享到其他小组的分享按钮点击事件处理
        */
       async handleSearchGroupShareBtn(){
           let fileGroupId = '';
           this.searchResultCheck.forEach( (v,index) => {
               if ( index !== this.searchResultCheck.length-1 ) {
                   fileGroupId += v.groupId + ','
               } else {
                   fileGroupId += v.groupId
               }
           });
           const res = await this.$getData('/member/shareFileToGroup.action', {
                shareFileId: this.chosedShareItem.fileId,
                moocFileId: this.chosedShareItem.moocFileId,
                shareGroupId: fileGroupId
           });
           console.log(res);
           const { data: { obj, success } } = res;
           if ( success && obj.bakField2 === "true" ) {
               this.$message.success(obj.bakField);
           } else {
               this.$message.error(obj.bakField);
           }
       },
        /**
         *  显示分享到其他小组的弹窗
         */
        handleShareModalShow(item){
            this.shareVisible = true;
            this.chosedShareItem = item;
        },
        /**
         *  获取文件列表
         */
        async getFileList(){
            const res1 = await this.$getData('/member/groupFileList.action', {
                groupId: this.chosedLi.groupId,
                pageNo: this.filePageNo
            });
            this.fileList = res1.data.rows;            
        },
        /**
         *  删除文件操作
         */
        handleDeleteFile(item){
            let _this = this;
            this.$confirm({
                title: '确定删除该文件？',
                okText: '确认',
                cancelText: '取消',
                async onOk(){
                    const res = await _this.$getData('/member/deleteGroupFile.action', {
                        groupId: _this.chosedLi.groupId,
                        fileId: item.fileId,
                        moocFileId: item.moocFileId,
                        fileType: item.fileType
                    });
                    const { data: { success, msg } } = res;
                    if ( success && msg === 'deleteSuccess' ) {
                        _this.$message.success('删除群文件成功');
                        _this.filePageNo = 1;
                        _this.getFileList();
                        // console.log(this.fileList);                        
                    }
                }
            })
        }
    },
}
</script>

<style lang='less' scoped>
.noHaveFile{
    width: 636px;
    text-align: center;
    font-size: 14px;
    padding: 20px 0;
}
.fileTopWrap{
    margin-top: 15px;
    width: 638px;
    height: 600px;
    border: 1px solid #e5e5e5;
    position: relative;
    .limitadm_table1{
        tr.h50{
            td{
                &.filename{
                    padding-left: 38px;
                }
                &.operate{
                    color: #2e766e;
                }
            }
        }
        td{
            &.filename{
                width: 300px;
                padding-left: 20px;              
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
            }
            &.fileDateTime{
                width: 156px;
                text-align: center;
                line-height: 25px;
                padding-right: 10px;
            }
            &.operate{
                width: 80px;
                padding-left: 12px;
                // text-align: center;                
                position: relative;
                color: #999999;
                span{
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    &:hover{
                        color: #f1bd85;
                    }
                    &.iconxiazai{
                        left: 0;
                    }
                    &.iconfenxiang{
                        left: 25px;
                    }
                    &.icondelete{
                        left: 50px
                    }
                }
            }
        }
    }  
}
</style>
