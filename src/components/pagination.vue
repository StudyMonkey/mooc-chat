<template>
    <div class="paginationWrap">
        <a-pagination showQuickJumper :defaultCurrent="1" :total="500" @change="handlePageChange" />
    </div>    
</template>

<script>
export default {
    name: 'pagination',
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
