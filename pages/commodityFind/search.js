//商品管理主页
$(document).ready(function() {
	var page = 1;
	var count = 0;
	var pageCount = 0;
	var rows = 8;
	var commodityid = 0;
	var api = "http://localhost:80";
	//商品列表显示函数
	
	function loadAndShow() {
		$("#search-data-list").attr("style","");
		$.ajax({
			url: api + "/commodity/find/condition",
			type: "GET",
			dataType: "json",
			data: {
				name: $("#searchInputkey").val(),
				status: 1,
				minPrice:$("#searchInputmin").val(),
				maxPrice:$("#searchInputmax").val(),
				page: page,
				row: rows
			},
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
						var tr = "<tr id='" + dm.id + "'><td>" + dm.name + "</td><td>" + dm
							.price +
							"</td><td>" + dm.rules + "</td><td>" + dm.releaseDate +
							"</td></tr>";
						$("table#commodity-table tbody").append(tr);
					});
					$("table#commodity-table tbody tr").on("click", function() {
						commodityid = $(this).attr("id");
						$("table#commodity-table tbody tr").css("background-color",
							"#FFFFFF");
						$(this).css("background-color", "#DDCCDD");
					});
				}else if (resultDate.code == 443){
							alert("未登录");
							location.href = "login.html";
				} else {
					alert("错误代码：" + resultDate.code);
				}
			},
			error: function(xhr) {
				alert("列表显示函数请求出错：" + xhr.status)
			}
		});
	};
	//查找按钮点击
	$("button#searchSaleInputSubmit").on("click", function() {
		if(($("#searchInputkey").val()==null||$("#searchInputkey").val()=="")
			&&($("#searchInputmax").val()==null||$("#searchInputmax").val()=="")
			&&($("#searchInputmin").val()==null||$("#searchInputmin").val()==""))
			alert("至少输入一个条件！");
		else
			loadAndShow();
	});
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
	//查看商品详情
	$("a#commodityViewLink").on("click", function() {
		if (commodityid == 0) {
			alert("请点击条目选择要查看的商品");
		} else {
			$("div#commodity-search-dialog").load("pages/commodityFind/commodityDetail.html", function() {
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
								var tr1 = "<label id='" + dm.id +
									"'>&nbsp;&nbsp;" +
									dm.kind +
									"&nbsp;&nbsp;</label>";
								$("div#detail-div span[id='commoditysale-label-span']")
									.append(tr1);
							});
							$("div#detail-div lable[name='id']").text(resultDate.data.id);
							$("div#detail-div lable[name='name']").text(resultDate.data.name);
							$("div#detail-div lable[name='rules']").text(resultDate.data.rules);
							$("div#detail-div lable[name='price']").text(resultDate.data.price);
							$("div#detail-div lable[name='releaseDate']").text(resultDate.data.releaseDate);
							$("div#detail-div lable[name='shopper']").text(resultDate.data.shopper.nickName);
						}else if (resultDate.code == 443){
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
});
