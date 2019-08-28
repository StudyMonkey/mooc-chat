<template>
    <div class="groupLogoWrap">
        <slot></slot>
        <!-- <x-avatar imgUrl="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
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
        </a-button>    -->
        <a-upload
            action="/moocGroupApi/group/upload/icon.action"
            name="picture"
            accept=".gif,.png,.jpg,.bmp"
            listType="picture-card"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
        >
            <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
            </div> 
        </a-upload> 
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>                
    </div>
</template>

<script>
export default {
    name: 'uploadImg',
    data() {
        return {
            // fileList: [], // 上传的图片
            // uploading: false,
            previewVisible: false,
            previewImage: '',
            fileList: [],   
        
        }
    },
    props: {
        groupImg: {
            type: Array,
            default: []
        }
    },
    methods: {
        handleCancel () {
            this.previewVisible = false
        },
        handlePreview (file) {
            this.previewImage = file.url || file.thumbUrl
            this.previewVisible = true
        },
        handleChange ({ file, fileList, event }) {
            if ( file.size / 1024 > 100 ) {
                this.$message.error('上传的图片大小不能超过100K,建议更换图片');
                return false;
            } 
            this.fileList = fileList;     
            console.log(this.fileList); 
            this.$emit('changeUploadImg', this.fileList);
        },        
        // handleRemove(file) {
        //     const index = this.fileList.indexOf(file);
        //     const newFileList = this.fileList.slice();
        //     newFileList.splice(index, 1);
        //     this.fileList = newFileList
        // },
        // beforeUpload(file) {
        //     this.fileList = [...this.fileList, file]
        //     return false;
        // },
        // handleUpload() {
        //     const { fileList } = this;
        //     const formData = new FormData();
        //     fileList.forEach((file) => {
        //         formData.append('files[]', file);
        //     });
        //     this.uploading = true

        //     setTimeout( () => {
        //         this.uploading = false
        //         this.$message.success('upload successfully.');   
        //         this.$emit('uploadImg', true);
        //         this.fileList = []; 
        //         console.log('upload-img');            
        //     }, 1000)
        // },
    },
    created(){
        this.fileList = this.groupImg;
    }
}
</script>

<style lang="less" scoped>
    .groupLogoWrap{
        display: flex;
        align-items: center;
    }    
</style>