$(document).ready(function() {
	$("#modify-my-information").on("click",function(){
		$("#show_iframe").load("pages/shopper/modify.html");
	});
	$("#update-my").on("click",function(){
		var parem = {
			"name": $("#modify_name input").val(),
			"gender": $("#modify_gender input").val(),
			"age": $("#modify_age input").val(),
			"email": $("#modify_email input").val(),
			"nickName": $("#modify_nickName input").val(),
			"phone": $("#modify_phone input").val(),
			"address": $("#modify_address input").val()
		};
		$.ajax({
			url: "http://localhost:80/shopper/update",
			type: "POST",
			dataType: "json",
			data: parem,
			headers: {
				"token": localStorage.token
			},
			success: function(resultDate) {
				if (resultDate.code == 200) {
					alert("更新个人资料成功");
					$("#show_iframe").load("pages/shopper/main.html");
				} else if (resultDate.code == 443) {
					alert("未登录");
					location.href = "login.html";
				} else {
					alert("错误代码：" + resultDate.code);
				}
			},
			error: function(xhr) {
				alert("请求出错：" + xhr.status);
			}
		});
	});
})