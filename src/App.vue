<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'app',
  created() {

  },
}
</script>

<style lang='less'>
@import './less/common.less';

.fade-enter-active,.fade-leave-active{
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
