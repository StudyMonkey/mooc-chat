<template>
  <div class="mainWrap">
    <div class="topWrap">
      <Loading v-if="showLoad" />
      <LeftMenu />
      <div>
        <router-view />
      </div>
    </div> 
  </div>
</template>

<script>

import { setCookie } from '@/utils/utils'

export default {
  name: 'main',
  data(){
      return{}
  }
}
</script>

<style lang='less'>

</style>
