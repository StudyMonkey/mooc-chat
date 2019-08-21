// JavaScript Document
$(document).ready(function(e) {
		  //推荐课程li元素边距
        	function mar_b(){
		    	var index = $(".train_frm1s li").length;
				//alert(index);
				for(var i=0;i<index;i++){
					if(i%4 ==0){
					   $(".train_frm1s li").eq(i-1).css('marginRight','0');	
				    }
				}		
		     }	
		   mar_b();
		   
		   //重要通知行高
		   function l_h(){
			   var h = $("#noFinf").height(); 
	           var len = $(".kc_notice li").length;
			   if(len >1){ 
			       $(".noFinf_title").css('marginTop',(h-20)/2);
			       $(".bg_half").css('marginTop',(h-20)/2);
			   }  
		   }
		   l_h();
		   
		   //军事头条和新闻公告的切换	
	      var t_name = $('.t_news .new_tittle .name');
	      t_name.click(function(){
			 var $this = $(this);
		     var index = $(this).index('.name');
			 $this.addClass('onShow');
			 $('.moreBtn').eq(index).removeClass('none');
			 $('.moreBtn').eq(index).siblings('a').addClass('none');
			 $this.parent('p').siblings('p').find('.name').removeClass('onShow');
		     $('.gs').eq(index).removeClass('none');
		     $('.gs').eq(index).siblings('.gs').addClass('none');
			 
	     });
		 
		 //微课精选 js 调用
		//LXC_scroll('jx_list','.jx_list','','','.jx_list_ul',3,0.5,1,true,1,'x',1);
		
		//云课堂 js 调用
		// LXC_scroll('ykt_list','.ykt_list','','','.ykt_list_ul',3,0.5,6,true,1,'x',1);
		
		//重要通知 js 调用
	//	LXC_scroll('kc_notice','.kc_notice','','','.kc_notice_ul',3,0.5,1,true,1,'y',1);
		
	
         // 首页头部 浮窗左侧滚动条JS
		(function($){
			$(window).on("load",function(){
				// $.mCustomScrollbar.defaults.scrollButtons.enable=true; //enable scrolling buttons by default
				// $.mCustomScrollbar.defaults.axis="yx"; //enable 2 axis scrollbars by default
				// $("#content-md").mCustomScrollbar({theme:"minimal-dark"});
				// $("#content-nd").mCustomScrollbar({theme:"minimal-dark"});
				$(".all-themes-switch a").click(function(e){
					e.preventDefault();
					var $this=$(this),
						rel=$this.attr("rel"),
						el=$(".content");
					switch(rel){
						case "toggle-content":
							el.toggleClass("expanded-content");
							break;
					}
				});
				
			});
		})(jQuery);
      
	  //重要通知 和 今日上线课程切换
	  $(".close_box .fl").click(function(){ 
	      var th = $(this);
	      var index = th.index(".close_box .fl");
		  if(th.hasClass('c_b_o') == false){ 
		      th.addClass('c_b_o');
			  th.siblings('.fl').removeClass('c_b_o');
			  $('.content').eq(index).show();
			  $('.content').eq(index).siblings('.content').hide();
		  }
	  });
	  
	  //浮窗关闭
	  
	   $(".close_box .fr").click(function(){ 
	       $(this).parents('.left_fc').hide();
	   });
	  
});	