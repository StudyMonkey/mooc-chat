<template>
    <div class="groupLogoWrap">
        <slot></slot>
        <x-avatar imgUrl="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <a-upload
            :fileList="fileList"
            :remove="handleRemove"
            listType="picture"
            :beforeUpload="beforeUpload"
            class="upload-list-inline"
        >
            <a-button class="chosedBtn" size="small" :disabled="fileList.length >= 1">选择</a-button>
        </a-upload>
        <a-button
            size="small"
            @click="handleUpload"
            :disabled="fileList.length === 0"
            :loading="uploading"
        >
            {{uploading ? '上传中...' : '点击上传' }}
        </a-button>            
    </div>
</template>

<script>
import XAvatar from '@/components/avatar'
export default {
    name: 'uploadImg',
    data() {
        return {
            fileList: [], // 上传的图片
            uploading: false,
        }
    },
    components: {
        XAvatar,
    },
    methods: {
        handleRemove(file) {
            const index = this.fileList.indexOf(file);
            const newFileList = this.fileList.slice();
            newFileList.splice(index, 1);
            this.fileList = newFileList
        },
        beforeUpload(file) {
            this.fileList = [...this.fileList, file]
            return false;
        },
        handleUpload() {
            const { fileList } = this;
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append('files[]', file);
            });
            this.uploading = true

            setTimeout( () => {
                this.uploading = false
                this.$message.success('upload successfully.');   
                this.$emit('uploadImg', true);
                this.fileList = []; 
                console.log('upload-img');            
            }, 1000)
        },
    },
}
</script>

<style lang="less" scoped>
    .groupLogoWrap{
        display: flex;
        align-items: center;
        button{
            margin-top: 0;
            &.chosedBtn{
                margin: 0 10px;
            }
        }
        /deep/.ant-upload-list{
            float: right;
            .ant-upload-list-item{
                margin: 0 10px 0 0;
                float: left;
            }
        }
    }    
</style>