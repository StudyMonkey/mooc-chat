<template>
  <div id="app">
    <div class="topWrap">
      <LeftMenu />
      <div>
        <router-view/>
      </div>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>   
  </div>
</template>

<<script>
import LeftMenu from '@/components/leftMenu'
export default {
  name: 'app',
  components: {
    LeftMenu,
  }
}
</script>

<style lang='less' scoped>
.topWrap{
  display: flex
}
</style>
