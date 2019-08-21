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

<style scoped>
.ant-avatar{
    width: 40px;
    height: 40px;
    border-radius: 0;
    border: 1px solid #bbbbbb;
}
</style>
