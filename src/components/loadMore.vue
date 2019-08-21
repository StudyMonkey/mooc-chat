<template>
    <div class="loadMoreBtn" @click="handleLoadBtnClick">加载更多<a-icon type="caret-down" /></div>
</template>

<script>
export default {
    name: 'loadMorenWrap',
    methods: {
        handleLoadBtnClick(){
            this.$emit('loadMoreBtnClick', true)
        }
    },
}
</script>

<style lang='less' scoped>
.loadMoreBtn{
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
    color: #2e766e;
    background-color: #dddddd;
}
</style>
