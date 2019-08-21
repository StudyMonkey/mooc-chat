$(function(){
	//var t = getRandomNum(1,36,5);
//	var s=str.split(""); 
//	var t=""; 
//	for (var i=0;i<7;i++){ 
//		t+=s[getRandomN(1,36)]; 
//	} 
	//alert(t);
	
		//hover头像菜单
    $(".lm_logBox").hover(function(){
    	   $("#mynavigation").css('display','block');    	  
    });
    
    $("#mynavigation").mouseleave(function(){
    	  $(this).css('display','none');  	
    });
	
});

var basePath = getBasePath();

var str="qwertyuiopasdfghjklmnbvcxz1234567890"; 
/**
* 生成随机字母和数字
*/
function getRandomNum(lbound, ubound,len) { 
	var s=str.split(""); 
	var t=""; 
	for (var i=0;i<len;i++){ 
		t += (Math.floor(Math.random() * (ubound - lbound)) + lbound); 
	}
	
	return t;
} 
 
function getRandomN(lbound, ubound) { 
	return (Math.floor(Math.random() * (ubound - lbound)) + lbound); 
} 

/**
 * 从COOKIE中取得信息
 */
function getCookie(cookie_name)
{

	var allcookies = document.cookie;

	var cookie_pos = allcookies.indexOf(cookie_name); //索引的长度  

	// 如果找到了索引，就代表cookie存在，反之，就说明不存在。  
	if (cookie_pos != -1)
	{
		// 把cookie_pos放在值的开始，只要给值加1即可。  

		cookie_pos += cookie_name.length + 1; //这里我自己试过，容易出问题，所以请大家参考的时候自己好好研究一下。。。  

		var cookie_end = allcookies.indexOf(";", cookie_pos);

		if (cookie_end == -1)

		{

			cookie_end = allcookies.length;

		}

		var value = unescape(allcookies.substring(cookie_pos, cookie_end)); //这里就可以得到你想要的cookie的值了。。。  

	}

	return value;

}

 function getBaseIPPort(){
    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8080
    var localhostPath = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/ems
    //var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    //获取项目的basePath   http://localhost:8080/ems/
    //var basePath=localhostPath+projectName+"/";
    return localhostPath;
}

 /**
  * Created by Administrator on 2015/10/31.
  * 
  * 实现类似jsp中<%=basePath%>的功能，获取项目根目录有助于url的填写
  * 
  * 使用方法，用类似引用jQuery的方法引入本插件
  * 
  * 定义一个全局的变量，然后的ready方法内部掉用本方法，获得basePath
  */
 function getBasePath(){
	    //获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
	    var curWwwPath = window.document.location.href;
	    //获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
	    var pathName = window.document.location.pathname;
	    var pos = curWwwPath.indexOf(pathName);
	    //获取主机地址，如： http://localhost:8080
	    var localhostPath = curWwwPath.substring(0, pos);
	    //获取带"/"的项目名，如：/ems
	    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	    //获取项目的basePath   http://localhost:8080/ems/
	    var basePath=localhostPath+projectName+"/";
	    return basePath;
}


 
/**
  * 注销
  */
function logout(){
	var moocServerUrl = $("#moocServer").val();
	layer.confirm("<font color='#666'>确定要注销登录吗？</font>", {
		  btn: ['确认','取消'] //按钮
		}, function(){
			$.ajax({
	        type:"post",
	        url:basePath+"wicket/AjaxJsonPage",
	        data:{"ajaxType":"logOut"},
	        dataType:'json',	
	        //async:false,
	        success:function (json) {
	        	
		        if(json.success) {
							window.location.href = moocServerUrl+"/userLogin";
					  } 

	        }

	    });
		}, function(){
		 
	});	
	
	
}

/**
  * 跳转MOOC首页
  */
function goMoocIndex(){
	var moocServerUrl = $("#moocServer").val();
	window.location.href = moocServerUrl;
}

/**
 * 带查询参数跳转搜索页面
 */
function serachInput(){
	
	var serachInput = $("#serachInput").val();
 	if(serachInput!=null&&serachInput!=""){
		var path = "../mooc/ResourceSearch?searchText="+serachInput;
	    window.location.href = path;
	}	
}

/**
 * 首页点击加载数据
 */
function updateLink(linkId, typeId){
	/*if(linkId == 1)
		$('#moreBtn').attr("href","../mooc/articlelist?classid=1&portalId=zjptScroll");
	if(linkId == 5)
		$('#moreBtn').attr("href","../mooc/articlelist?classid=5&portalId=zjptScroll");
	if(linkId == "headline")
		$('#moreBtn').attr("href","../mooc/articlelist?classid=headline&portalId=zjptScroll");*/
	
	if(linkId!=null && linkId!="")
		$('#moreBtn').attr("href","../mooc/articlelist?classid="+linkId+"&portalId=zjptScroll");
	
	var emptyHead = '<div id="newsdiv" class="gs"><div class="gs_i fl"><div class="banner extn" id="extn1"><div class="prev"></div><div class="next next"></div>'; 
		emptyHead += '<div id="newsImgs" class="b-img wl_bn">';
		emptyHead += '<span></span></div>';
		emptyHead += '<div class="b-list icon_y"></div></div></div>';
	
	$.ajax({
	    type:"post",
	    url:basePath+"/msg/loadIndexData",
	    data:{"ajaxType":"loadIndexData","linkId":linkId,"typeId":typeId,"showWikiNum":$('#showWikiNum').val()},
	    dataType:'json',	
	       
	    success:function (json) {
		   var data = ""; 
		   var imglst,newslst,head = "";
		   var flag = 0;
	       if(json.msg == "7"){
			   imglst = json.object;
			   newslst = json.obj;
			   if(imglst!=null){
				   $('#wikidiv').remove();
				   if($('#newsdiv').length > 0){
					  head = '<div class="gs_i fl"><div class="banner extn" id="extn1"><div class="prev"></div><div class="next next"></div>'; 
				   }else{
					  head = '<div id="newsdiv" class="gs"><div class="gs_i fl"><div class="banner extn" id="extn1"><div class="prev"></div><div class="next next"></div>'; 
					  flag = 1;
				   }
					  
				   head += '<div id="newsImgs" class="b-img wl_bn">';
				   for(var i=0; i<imglst.length; i++){
					   data+= '<span>';
					   if(imglst[i].islink == true && imglst[i].linktarget !=""){
						   data+='<a href="'+imglst[i].linktarget+'" target="_blank">';
					   }else if(imglst[i].islink == false){
						   data+= '<a href="/mooc/articleshow?classid='+imglst[i].classid+'&id='+imglst[i].id+'&portalId=zjptScroll" target="_blank">';
					   }
					   
					   data+= '<img src="'+imglst[i].defaultpicurl+'"/>';
					   data+= '<i title="'+imglst[i].title+'">'+imglst[i].title+'</i></a></span>';
				   }
				   
				   if($('#newsdiv').length > 0){
					  $('#newsdiv').html(head + data + '</div><div class="b-list icon_y"></div></div></div>'); 
				   }else{
					  $('#datasDiv').html(head + data + '</div><div class="b-list icon_y"></div></div></div>');  
				   } 
				   
				   append_span($('#extn1'));$('.extn').banner();
					   
			   }else{
				 
				   $('#datasDiv').html(emptyHead);
			   }
			   if(newslst!=null){
				   data = "";
				   for(var i=0; i<newslst.length; i++){
					   data+= '<p><span class="dics"></span>';
					   if(newslst[i].islink == true && newslst[i].linktarget !=""){
						   data+='<span class="cont_t"><a href="'+newslst[i].linktarget+'" target="_blank"><span title="'+newslst[i].title+'">'+newslst[i].title+'</span></a></span>';
					   }else if(newslst[i].islink == false){
						   data+='<span class="cont_t"><a href="/mooc/articleshow?classid='+newslst[i].classid+'&id='+newslst[i].id+'&portalId=zjptScroll" target="_blank"><span title="'+newslst[i].title+'">'+newslst[i].title+'</span></a></span>';
					   }
					   data+='<span class="cont_time">'+newslst[i].idforcopy+'</span></p>';
				   }
				   head = "";
				   head = '<div id="newsDatas" class="gs_t fr">'
				   if(flag == 0){
					  $('#newsdiv').append(head + data + '</div>');  
				   }else if(flag == 1){
					  $('#newsdiv').append(head + data + '</div></div>'); 
				   }
				    
			   }else{
				   head = "";
				   head = '<div id="newsDatas" class="gs_t fr"></div>';
				   $('#newsdiv').append(head + '</div></div>');
			   }
			   			   		   			   
		   }else if(json.msg == "2"){
			   newslst = json.obj;
			   if(newslst!=null){
				   data = "";
				   $('#newsdiv').html('');
				 
				   var heads = '<div id="wikidiv"><div id="wklst" class="gs_t fl w980">';
				   for(var i=0; i<newslst.length; i++){
					   data+= '<p><span class="dics"></span>';
					   if(newslst[i].islink == true && newslst[i].linktarget !=""){
						   data+='<span class="cont_t"><a href="'+newslst[i].linktarget+'" target="_blank" title="'+newslst[i].title+'"><span class="w830"><i>'+newslst[i].title+'</i></span></a></span>';
					   }else if(newslst[i].islink == false){
						   data+='<span class="cont_t"><a href="/mooc/articleshow?classid='+newslst[i].classid+'&id='+newslst[i].id+'&portalId=zjptScroll" target="_blank" title="'+newslst[i].title+'"><span class="w830">'+newslst[i].title+'</span></a></span>';
					   }
					   data+='<span class="cont_time" id="addTime">'+newslst[i].idforcopy+'</span></p>';
				   }
				   if($('#wikidiv').length > 0){
					  $('#wikidiv').show();
					  $('#wklst').html(data); 
				   }else{
					  data = heads + data + "</div></div>";
				      $('#newsdiv').html(data);
				   }
				   
			   }else{
				   head = "";
				   head = '<div id="newsdiv" class="gs"></div>';
				   var heads = '<div id="wikidiv"><div id="wklst" class="gs_t fl w980">';
				   $('#newsdiv').append(head + heads + '</div></div>');
			   }
		   } 	      
	    }

	});		
}