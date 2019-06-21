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
import LeftMenu from '@/components/leftMenu'
import Loading from '@/components/loading'
import { setCookie } from '@/utils/utils'

export default {
  name: 'main',
  components: {
    LeftMenu,
    Loading
  },
  computed: {
    getLoadStatus() {
      return this.$store.state.showLoad
    }
  },
  watch: {
    getLoadStatus(n, o) {
      if ( n !== o ) {
        this.showLoad = n;
      }      
    }
  },
  data() {
    return {
      showLoad: false
    }
  },
}
</script>

<style lang='less'>

</style>
