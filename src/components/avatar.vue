<template>
    <a-avatar 
        shape="square" 
        size="default"
        :src="imgUrl"
    />    
</template>

<script>
export default {
    name: 'avatar',
    props: {
        imgUrl: {
            type: String,
            required: true
        }
    }
}
</script>

<style lang='less' scoped>
  .ant-avatar{
    width: 38px;
    height: 38px;
    border: 1px solid #bbbbbb;
    border-radius: 0;
  }
</style>
