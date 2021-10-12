//商品管理主页
$(document).ready(function() {
	var page = 1;
	var count = 0;
	var pageCount = 0;
	var rows = 8;
	var commodityid = 0;
	var labelPage = 1;
	var api = "http://localhost:80"
	//列表显示函数
	function loadAndShow() {
		$.ajax({
			url: api + "/commodity/find/myFind",
			type: "GET",
			dataType: "json",
			headers: {
				"token": localStorage.token
			},
			success: function(resultDate) {
				if (resultDate.code == 200) {
					count = Number(resultDate.message);
					$("span#count").html(count);
					pageCount = Math.ceil(count / rows);
					$("span#page").html(page);
					$("span#pageCount").html(pageCount);
					$("table#commodity-table tbody").html("");
					$.each(resultDate.data, function(index, dm) {
						var tr = "<tr id='" + dm.id + "'><td>" + dm.name + "</td><td>" + dm.price +"</td><td>" + dm.rules + "</td><td>" + dm.releaseDate + "</td></tr>";
						$("table#commodity-table tbody").append(tr);
					});
					$("table#commodity-table tbody tr").on("click", function() {
						commodityid = $(this).attr("id");
						$("table#commodity-table tbody tr").css("background-color", "#FFFFFF");
						$(this).css("background-color", "#DDCCDD");
					});
				} else {
					alert("错误代码：" + resultDate.code);
				}
			},
			error: function(xhr) {
				alert("请求出错：" + xhr.status)
			}
		});
	}
	loadAndShow();
	//页面导航
	$("ul.pagination li a").on("click", function(event) {

		var action = $(this).html();
		if (action == "首页") {
			page = 1;
			loadAndShow();
		} else if (action == "上页") {
			if (page > 1)
				page = page - 1;
			loadAndShow();
		} else if (action == "下页") {
			if (page < pageCount)
				page = page + 1;
			loadAndShow();
		} else {
			page = pageCount;
			loadAndShow();
		}
	});
	//查看详情
	$("a#commodityViewLink").on("click", function() {
		if (commodityid == 0) {
			alert("请点击条目选择要查看的商品");
		} else {
			$("div#commodity-detail-dialog").load("pages/commodityFind/commodityDetail.html", function() {
				$.ajax({
					url: api + "/commodity/find/" + commodityid + "/detail",
					type: "GET",
					dataType: "json",
					headers: {
						"token": localStorage.token
					},
					success: function(resultDate) {
						if (resultDate.code == 200) {
							$.each(resultDate.data.label, function(index, dm) {
								var tr1 = "<label id='" + dm.id +"'>&nbsp;&nbsp;" +dm.kind +"&nbsp;&nbsp;</label>";
								$("div#detail-div span[id='commoditysale-label-span']").append(tr1);
							});
							$("div#detail-div lable[name='id']").text(resultDate.data.id);
							$("div#detail-div lable[name='name']").text(resultDate.data.name);
							$("div#detail-div lable[name='rules']").text(resultDate.data.rules);
							$("div#detail-div lable[name='price']").text(resultDate.data.price);
							$("div#detail-div lable[name='releaseDate']").text(resultDate.data.releaseDate);
							$("div#detail-div lable[name='shopper']").text(resultDate.data.shopper.nickName);
						} else if (resultDate.code == 443) {
							alert("未登录");
							location.href = "login.html";
						} else
							alert("查看失败");
	
					},
					error: function(xhr) {
						alert("请求出错：" + xhr.status);
					}
				});
			});
		}
	});
	//删除该物品
	$("a#commodity-myfind-delete").on("click", function() {
			if (commodityid == 0) {
				alert("请点击条目选择要删除的商品");
			} else {
				$.ajax({
					url: api + "/commodity/sale/" + commodityid + "/delete",
					type: "GET",
					dataType: "json",
					headers: {
						"token": localStorage.token
					},
					success: function(resultDate) {
						if (resultDate.code == 200) {
							alert("删除成功");
							loadAndShow();
						} else if(resultDate.code == 443){
							alert("未登录");
							location.href = "login.html";
						}else
							alert("删除失败");
					},
					error: function(xhr) {
						alert("请求出错：" + xhr.status);
					}
				});
			}
		});
	//修改物品信息
	$("a#commodity-myfind-update").on("click",function(){
		if(commodityid==0){
			alert("请选择要修改的物品");
		}else{
			$("div#commodity-update-dialog").html("");
			$("div#commodity-detail-dialog").html("");
			$("div#commodity-update-dialog").load("pages/commodityFind/commodityUpdate.html",function(){
				// 设置表单提交地址
				$("form#commodityUpdateForm").attr("action",api+"/commodity/find/update");
				function labelShow() {
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
								$("span#update-sale-label-span").html("");
								$.each(resultDate.data, function(index, dm) {
									var tr = "<input type='checkbox' name='checkedLabel' value='" + dm.id + "'>" + dm.kind + "</input> &nbsp;&nbsp;";
									$("span#update-sale-label-span").append(tr);
								});
							} else if (resultDate.code == 443) {
								alert("未登录");
								location.href = "login.html";
							} else {
								alert("没有其他标签！");
								labelPage = 1;
							}
						},
						error: function(xhr) {
							alert("标签列表显示请求出错：" + xhr.status);
						}
					});
				};
				labelShow();
				$("button#update-nextPageLabel").on("click", function() {
					labelPage = labelPage + 1;
					labelShow();
				});
				$("#cancle-button-update").on("click", function() {
					$("div#commodity-update-dialog").html("");
				});
				// 回显
				$.ajax({
					url: api + "/commodity/find/" + commodityid + "/detail",
					type: "GET",
					dataType: "json",
					headers: {
						"token": localStorage.token
					},
					success: function(resultDate) {
						if (resultDate.code == 200) {
							$("input#exampleInputName-update").attr("placeholder",resultDate.data.name);
							$("input#exampleInputPrice-update").attr("placeholder",resultDate.data.price);
							$("input#exampleInputRules-update").attr("placeholder",resultDate.data.rules);
						} else
							alert("回显失败");
					},
					error: function(xhr) {
						alert("回显请求出错：" + xhr.status);
					}
				});		
				// 提交处理
				$("#update-submit").on("click",function(e){
					e.preventDefault();
					alert("提交更新");
					var checked=document.getElementsByName("checkedLabel");
					var check_val = new Array();
					for(var i=0,j=0;i<checked.length;i++){
						if(checked[i].checked){
							check_val[j]=parseInt(checked[i].value);
							j=j+1;
						}
					}
					var formData = new FormData();
					var photo = $('#exampleInputPhoto-update')[0].files[0];
					var name = $("#exampleInputName-update").val();
					var price = $("#exampleInputPrice-update").val();
					var shabby = $("#exampleInputShabby-update").val();
					var introduce = $("#exampleInputIntroduce-update").val();
					formData.append("id",commodityid);
					formData.append("file",photo);
					formData.append("name",name);
					formData.append("price",price);
					formData.append("shabby",shabby);
					formData.append("introduce",introduce);
					$.ajax({
						url: api + "/commodity/sale/update",
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
								url: api + "/label/commodity/update",
								type: "GET",
								dataType: "json",
								data: {
									cId: commodityid,
									lId: check_val
								},
								headers: {
									"token": localStorage.token
								},
								success: function(resultDate) {
									console.info("标签修改成功");
								},
								error: function(xhr) {
									alert("标签修改失败");
								}
							});
							alert("修改商品成功");
						},
						error: function(xhr) {
							alert("修改商品失败"+xhr.status);
						}
					});
				});
				
				// 取消处理
				$("button#cancle-button-update").on("click",function(){
					$("div#commodity-update-dialog").html("");
				});
			});
		}
	});
});
