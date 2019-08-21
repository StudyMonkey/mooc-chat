<template>
    <div class="paginationWrap">
        <a-pagination showQuickJumper v-model="current" :pageSize="pageSize" :defaultCurrent="1" :total="total" @change="handlePageChange" />
    </div>    
</template>

<script>
export default {
    name: 'pagination',
    props: {
        total: {
            type: Number,
            // required: true
        },
        pageSize: {
            type: Number,
            default: 10
        },
        changePage: {
            type: Number
        }
    },
    data(){
        return {
            current: 1
        }
    },
    watch: {
        changePage(){
            console.log(this.changePage);
            if( this.changePage !== 0 ) {
                this.current = 1;
            }
        }
    },
    methods: {
        handlePageChange(pageNum) {
            this.$emit('pageChange', pageNum)
        }
    },
}
</script>

<style lang='less' scoped>
.paginationWrap{
    position: absolute;
    bottom: 12px;
    left: 0;
    right: 0;
    .ant-pagination{
        text-align: center;
    } 
}
</style>
