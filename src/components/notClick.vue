<template>
    <div class="notClickChat">
        <img :src="notClickLogo" alt="">
    </div>
</template>

<script>
    import notClickLogo from '@/assets/images/icon.png'
    export default {
        name: 'notClick',
        data(){
            return{
                notClickLogo
            }
        }

    }   
</script>

<style scoped>
.notClickChat{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    background: #ffffff;
}
.notClickChat img{
    width: 120px;
    height: 176px;
}
</style>