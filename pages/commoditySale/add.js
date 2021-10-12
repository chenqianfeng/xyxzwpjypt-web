$(document).ready(function() {
	var labelPage=1;
	var rows = 8;
	var api = "http://localhost:80"
	function labelShow(){
		$.ajax({
			url: api + "/label/list/get",
			type: "GET",
			dataType: "json",
			data: {
				page: labelPage,
				row: 8
			},
			headers: {
				"token": localStorage.token
			},
			success: function(resultDate) {
				if (resultDate.code == 200) {
					$("span#add-sale-label-span").html("");
					$.each(resultDate.data, function(index, dm) {
						var tr = "<input type='checkbox' name='checkedLabel' value='" + dm.id + "'>"  +dm.kind + "</input>&nbsp;&nbsp;";
						$("span#add-sale-label-span").append(tr);
					});
				}else if (resultDate.code ==  443){
							alert("未登录");
							location.href = "login.html";
				}else {
					alert("没有其他标签！");
					labelPage=1;
				}
			},
			error: function(xhr) {
				alert("标签列表显示请求出错：" + xhr.status)
			}
		});
	};
	$("button#add-nextPageLabel").on("click", function() {
		labelPage = labelPage+1;
		labelShow();
	});
	labelShow();
	$("#add-submit").on("click",function(e){
		e.preventDefault();
		var checked=document.getElementsByName("checkedLabel");
		var check_val = new Array();
		for(var i=0,j=0;i<checked.length;i++){
			if(checked[i].checked){
				check_val[j]=parseInt(checked[i].value);
				j=j+1;
			}
		}
		var formData = new FormData();
		var photo = $('#exampleInputPhoto-add')[0].files[0];
		var name = $("#exampleInputName-add").val();
		var price = $("#exampleInputPrice-add").val();
		var shabby = $("#exampleInputShabby-add").val();
		var introduce = $("#exampleInputIntroduce-add").val();
		formData.append("file",photo);
		formData.append("name",name);
		formData.append("price",price);
		formData.append("shabby",shabby);
		formData.append("introduce",introduce);
		$.ajax({
			url: api + "/commodity/sale/add",
			type: "POST",
			dataType: "json",
			async: false,
			data: formData,
			processData : false, // 使数据不做处理
			contentType : false, // 不要设置Content-Type请求头
			headers: {
				"token": localStorage.token
			},
			success: function(resultDate) {
				alert(Number(resultDate.message));
				alert(check_val);
				$.ajax({
					url: api + "/label/commodity/add",
					type: "GET",
					dataType: "json",
					data: {
						cId: Number(resultDate.message),
						lId: check_val
					},
					headers: {
						"token": localStorage.token
					},
					success: function(resultDate) {
						console.info("标签绑定成功");
					},
					error: function(xhr) {
						alert("标签绑定失败");
					}
				});
				alert("增加商品成功");
			},
			error: function(xhr) {
				
			}
		});
		
	});
});