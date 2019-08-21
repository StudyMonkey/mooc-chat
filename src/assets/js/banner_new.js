// JavaScript Document
$(document).ready(function(e){
	var timer = '';  // 控制下面setTimeout的全局变量
	append_span($('#first_dt'));
	//append_span($('#extn2'))
	$("#first_dt").banner();
	$("#serset_dt").banner();
//   $(".fl_box").banner_new();
	$(".banner").banner_top();

	$('.n_my_img').click(function(){
		alert(123);
	})

	$('.n_my_img').hover(function(){
		$(".n_sj").toggleClass("none");
		$(".n_x_list").toggleClass("none");
	});	
	  
 var open_show = {	  
	  //新头部搜索框的展开
	  srch_show : function(){	  
		   $(".n_s").click(function(){   
		       $(".n-input").css('display','block');
			   $(".n-input").css('border','1px solid #f39800');
	           $(".n-input").animate({width:'700px'},500);	
		   });
		   $(".n_close").click(function(){
			   $(this).parent('.n_x_num_s').hide();  
		   });
         $("body").click(function (e) {
             if($(".n-input").css("display") == "block"){
             	  if (!$(e.target).closest(".n-input").length 
				      && !$(e.target).closest(".n_s").length 
					  && !$(e.target).closest(".gs_i").length 
					  && !$(e.target).closest(".next").length 
					  && !$(e.target).closest(".banner_right").length 
					  && !$(e.target).closest(".juz li").length
					  && !$(e.target).closest(".d_l_box li").length) {
                    $(".n-input").animate({width:"0px"},1000);
			        setTimeout(function(){
						 $(".n-input").css('border','none');
				         $(".n-input").css('display','none');
						 
			        },1000);
                 }
             }
         });			
		
		$(".hasList a").mouseenter(function(){
			 $(this).parent().children('p').removeClass('none');   
	    });
		$(".hasList").mouseleave(function(){
			 $(this).children('p').addClass('none');  
		});	  
	  
	  },
	  
	  //职业动态HOVER效果
	  hover : function(){ 
	     $(".fr_box li").hover(function(){ 
		      var th = $(this);
		      if(th.hasClass("h40")){
				  th.addClass('h90');
				  th.removeClass('h40');
				  th.children('.fn_hover_show').addClass('none');
				  th.children('.fn_show').removeClass('none');
				  
				  th.siblings('li').addClass('h40');
				  th.siblings('li').removeClass('h90');
				  th.siblings('li').children('.fn_show').addClass('none');
				  th.siblings('li').children('.fn_hover_show').removeClass('none');
			  }
		 
		 })
	  
	  
	  }
}	  
open_show.srch_show();	  
open_show.hover();  

  $(".zd_box_top .fl").click(function(){ 
       var index = $(this).index('.zd_box_top .fl');
	   $(".dt_box").eq(index).show();
	   $(".dt_box").eq(index).siblings('.dt_box').hide();
  });
	  
	 
});



function append_span(obj){
var img_len =obj.find('.imgul li').length;
	
	for(var i=0;i<img_len; i++){ 
	
		obj.find('.d_l_box').append('<li></li>' )
	}
}




;(function ($) {
	function play() {
		var self = this
		self.bannerCfg = {}	//提供一个 bannerCfg 的命名空间
		
		self.find('.d_l_box li').eq(0).addClass("color_g");

		self.bannerCfg.index = 0;
		self.find('.d_l_box li').on('click', function () {
			self.bannerCfg.index = $(this).index();
			self.find('.imgul li').eq($(this).index()).show().siblings('li').hide();
			$(this).addClass("color_g").siblings('li').removeClass("color_g"); //底下LI标签变色
		});
		
	
		//轮播部分
		self.find(".prev").on("click", function () {
			var length = self.find('.imgul li').length - 1;
			
			self.bannerCfg.index = self.bannerCfg.index == 0 ? length : (self.bannerCfg.index - 1);
			
			self.find('.d_l_box li').eq(self.bannerCfg.index).trigger("click");
		});
		self.find(".next").on("click", function () {
			var length = $(this).parent('.fl_box').find('.imgul li').length - 1;
			
			self.bannerCfg.index = self.bannerCfg.index == length ? 0 : (self.bannerCfg.index + 1);
			
			self.find('.d_l_box li').eq(self.bannerCfg.index).trigger("click");

			//console.log(self, ' ---- ', self.bannerCfg.index)
		});
		
		//时间控制轮播
		function playBanner(){
			self.bannerCfg.myTimer = setInterval(function () {
				//console.log("1");
				self.find('.next').trigger('click');
			}, 2000);
		};
		playBanner();

		//鼠标停放
		self.find('.imgul li').hover(function () {
			clearInterval(self.bannerCfg.myTimer);
		}, function (){
			playBanner();
		});
	};

	$.fn.extend({
		banner: function(){
				if (this.length > 0) {	// 需要判断当前选择器是否指向多个节点
					for (var i = 0; i < this.length; i++) {
						play.apply($(this[i]))	// 执行的时候要指定play方法的上下文
					}
					
				}
		}
	})

})(jQuery);





;(function($){
	  	function player(){
		 var index=0;
		 var ulstart = '<ul class="juz">',
		     ulcontent = '',
		     ulend = '</ul>';
	     var numpic =  $('#slides li').length;
		 var len=33*numpic;	
	 	 function ADDLI(){
		//var lilicount = numpic + 1;
			for(var i = 0; i < numpic; i++){
				ulcontent += '<li>' + '<a href="#">' +  " " + '</a>' + '</li>';
		    }
		//  $('#slides').after(ulstart + ulcontent + ulend);	
		  $('.banner').append(ulstart + ulcontent + ulend);
		  $('.juz').css({'width':len,'marginLeft':-(len/2)});
		  $('.juz li').eq(0).addClass('color_g');
	    }
		//图片小于一张时$(".juz")隐藏
		   if( $('#slides li').length>1){
			   ADDLI(); 
		   } 				
			$('#slides li').eq(0).show().siblings('li').hide();
			$('.juz li').on('click',function(){
				 var  index=$(this).index();
				 $('#slides li').eq($(this).index()).show().siblings('li').hide();
				 $(this).addClass("color_g").siblings('li').removeClass("color_g");//底下LI标签变色
			});
					  
			//轮播部分
			$(".banner_left").on("click",function(){
				  var  length = $(this).parents('.banner').find('#slides li').length-1;
				  index = index ==0 ? length :(index-1);
				  // $(".demo li").eq(index).trigger("click");
				  $(this).parents('.banner').find('.juz li').eq(index).trigger("click");
			});
			$(".banner_right").on("click",function(){
				  var length = $(this).parents('.banner').find('#slides li').length-1;
				  index = index ==length ? 0 :(index+1);
				  //$(".demo li").eq(index).trigger("click");
				  $(this).parents('.banner').find('.juz li').eq(index).trigger("click");
			});
			//时间控制轮播
			 function playBanners(){ 
				var timer =  setInterval(function(){
					$('.banner_right').trigger('click');	
					},4000);
			 };
			playBanners();	
				   
			//鼠标停放
			$('#slides li').hover(function(){
				clearInterval(timer);
			 },function(){ 
			    playBanners();	
			 });
			  $('.juz li').mouseenter(function(){
				   $(this).addClass('color_g').siblings('li').removeClass('color_g');
				   $('#slides li').eq($(this).index()).css({'display':'block','z-index':'3'}).siblings('#slides li').css('display','none');
				   clearInterval(timer);
             });	
			
    };
   
	$.fn.banner_top=function(){player();}
	
})(jQuery);

