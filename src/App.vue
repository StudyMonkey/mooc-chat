<template>
  <div id="app">
    <div class="head" v-html="obj.headString"></div>
    <router-view :key="key" />
    <div class="foot" v-html="obj.footString"></div>
  </div>
</template>

<script>


export default {
  name: 'app',
  data(){
    return{
      obj: ''
    }
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date()
    }
  },
  async created() {
    const res = await this.$getData('/sys/getCopyRight.action', {
      eid: this.$myEid,
      cid: ''
    })
    this.obj = res.data.obj;  
  }
}
// JavaScript Document
$(function(){

  $(document).on('mouseenter', ".hasList a",function(){
    $(this).parent().children('p').toggleClass('none');   
  });
  $(document).on('mouseleave', ".hasList a", function(){
    $(this).children('p').toggleClass('none'); 
  });   
	$(document).on('mouseenter', '.n_my_img', function(){
		$(".n_sj").toggleClass("none");
		$(".n_x_list").toggleClass("none");
  });
	$(document).on('mouseleave', '.n_my_img', function(){
		$(".n_sj").toggleClass("none");
		$(".n_x_list").toggleClass("none");
	});  
})

						  		 

	    







</script>

<style lang='less'>
@import './less/common.less';
@import './less/lm_headFootcom.css';

.fade-enter-active,.fade-leave-active{
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
