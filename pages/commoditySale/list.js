//商品管理主页
$(document).ready(function() {
	var page = 1;
	var count = 0;
	var pageCount = 0;
	var rows = 8;
	var commodityid = 0;
	var api = "http://localhost:80";
	//列表显示函数
	function loadAndShow() {
		$.ajax({
			url: api + "/commodity/sale/status/list",
			type: "GET",
			dataType: "json",
			data: {
				status: 1,
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
						var tr = "<tr id='" + dm.id + "'><td>" + dm.name + "</td><td>" + dm.price +"</td><td>" + dm.shabby + "</td><td>" + dm.releaseDate +"</td><td>" +dm.introduce + "</td></tr>";
						$("table#commodity-table tbody").append(tr);
					});
					$("table#commodity-table tbody tr").on("click", function() {
						commodityid = $(this).attr("id");
						$("table#commodity-table tbody tr").css("background-color","#FFFFFF");
						$(this).css("background-color", "#DDCCDD");
					});
				} else if (resultDate.code == 443) {
					alert("未登录");
					location.href = "login.html";
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
			$("div#commodity-list-dialog").load("pages/commoditySale/commodityDetail.html", function() {
				$.ajax({
					url: api + "/commodity/sale/" + commodityid + "/detail",
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
							$.each(resultDate.data.words, function(index, dm) {
								var tr2 = "<label id='" + dm.id + "'>" +"用户id：" +dm.commodityId + " 时间：" + dm.wordsTime +" 留言：" + dm.words + "</label><br/>";
								$("div#detail-div div[id='words']").append(tr2);
							});
							$("div#detail-div lable[name='id']").text(resultDate.data.id);
							$("div#detail-div lable[name='name']").text(resultDate.data.name);
							$("div#detail-div lable[name='shabby']").text(resultDate.data.shabby);
							$("div#detail-div lable[name='price']").text(resultDate.data.price);
							$("div#detail-div lable[name='releaseDate']").text(resultDate.data.releaseDate);
							$("div#detail-div lable[name='shopper']").text(resultDate.data.shopper.nickName);
							$("div#detail-div lable[name='introduce']").text(resultDate.data.introduce);
							$("#commoditySale-img").attr("src","http://localhost:80/photo/get/" + commodityid);
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
});
