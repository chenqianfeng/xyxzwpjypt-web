// JavaScript Document
function logonbyphone() {
	var parem = {
		"id": $("#id").val(),
		"password": $("#password").val()
	};
	ajaxRequestWithParams(api + "logon/phone", "GET", parem, function(result) {
		alert("已发送请求");
		if (result.code == 200) {
			//存储token
			localStorage.token = result.data;
			//跳转到首页
			location.href = "index.html";
		} else if (result.code == 444) {
			alert("电话或密码输入错误");
		}
	});
};

function ajaxForm(formId, type, url, success) {
	$("#" + formId).ajaxForm({
		url: url,
		type: type,
		dataType: "json",
		headers: {
			"token": localStorage.token
		},
		success: success,
		error: function(xhr) {
			alert("请求出错：" + xhr.status)
		}
	});
};
//ajax请求-无参
function ajaxRequest(url, type, success) {
	$.ajax({
		url: url,
		type: type,
		dataType: "json",
		headers: {
			"token": localStorage.token
		},
		success: success,
		error: function(xhr) {
			alert("请求出错：" + xhr.status)
		}
	});
};

//ajax请求-带参
function ajaxRequestWithParams(url, type, params, success) {
	$.ajax({
		url: url,
		type: type,
		data: params,
		dataType: "json",
		headers: {
			"token": localStorage.token
		},
		success: success,
		error: function(xhr) {
			alter("请求出错：" + xhr.status)
		},
	});
};