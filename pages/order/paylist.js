//商品管理主页
$(document).ready(function() {
	var page = 1;
	var count = 0;
	var pageCount = 0;
	var rows = 8;
	var orderid = 0;
	var api = "http://localhost:80"
	//列表显示函数
	function loadAndShow() {
		$.ajax({
			url: api + "/order/shopper/list/1",
			type: "GET",
			dataType: "json",
			data: {
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
					$("table#order-table tbody").html("");
					$.each(resultDate.data, function(index, dm) {
						var tr = "<tr id='" + dm.id + "'><td>" + dm.id + "</td><td>" + dm.createTime + "</td><td>" + dm.payMoney +"</td><td>" + dm.commoditySale.name + "</td><td>" + dm.shopper.nickName +"</td></tr>";
						$("table#order-table tbody").append(tr);
					});
					$("table#order-table tbody tr").on("click", function() {
						orderid = $(this).attr("id");
						$("table#order-table tbody tr").css("background-color","#FFFFFF");
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
	$("a#orderViewLink").on("click", function() {
		if (orderid == 0) {
			alert("请点击条目选择要查看的商品");
		} else {
			$("div#order-pay-dialog").load("pages/order/orderDetail.html", function() {
				$.ajax({
					url: api + "/order/get/" + orderid ,
					type: "GET",
					dataType: "json",
					headers: {
						"token": localStorage.token
					},
					success: function(resultDate) {
						if (resultDate.code == 200) {
							var status;
							switch(resultDate.data.status){
								case 1: status = "代付款";break;
								case 2: status = "已取消";break;
								case 3: status = "待收货";break;
								case 4: status = "待评价";break;
								case 5: status = "已完成";
							}
							$("div#detail-div lable[name='status']").text(status);
							$("div#detail-div lable[name='id']").text(resultDate.data.id);
							$("div#detail-div lable[name='createTime']").text(resultDate.data.createTime);
							$("div#detail-div lable[name='payMoney']").text(resultDate.data.payMoney);
							$("div#detail-div lable[name='shopperName']").text(resultDate.data.shopper.name);
							$("div#detail-div lable[name='shopperPhone']").text(resultDate.data.shopper.phone);
							$("div#detail-div lable[name='shopperEmail']").text(resultDate.data.shopper.email);
							$("div#detail-div lable[name='saleId']").text(resultDate.data.commoditySale.id);
							$("div#detail-div lable[name='saleName']").text(resultDate.data.commoditySale.name);
							$("div#detail-div lable[name='saleShabby']").text(resultDate.data.commoditySale.shabby);
							$("div#detail-div lable[name='saleIntroduce']").text(resultDate.data.commoditySale.introduce);
							$("div#detail-div lable[name='saleReleaseDate']").text(resultDate.data.commoditySale.releaseDate);
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
				function buyClick(){
					var orderid = $("#detail-order-id").html();
					$.ajax({
						url: "http://localhost:80/order/pay",
						type: "GET",
						dataType: "json",
						data: {id: orderid},
						headers: {
							"token": localStorage.token
						},
						success: function(resultDate) {
							if (resultDate.code == 200) {
								document.write(resultDate.data);
							}else if (resultDate.code == 443){
								alert("未登录");
								window.location.href = "login.html";
							} else {
								alert("错误代码：" + resultDate.code);
							}
						},
						error: function(xhr) {
							alert("列表显示函数请求出错：" + xhr.status);
						}
					});
				};
				$("#pay-button").on("click",buyClick);
			});
		}
	});
});
