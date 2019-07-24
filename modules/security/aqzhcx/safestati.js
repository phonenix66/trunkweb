/**
 * 站点管理=》站点维护
 */
define("modules/security/aqzhcx/safestati", ["jquery", "underscore", "page/tools","echarts"], function($, _, tools,echarts) {
	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/aqgl/securityProblemHandle/`; //页面url地址
			var loginName = tools.getLoginName();

			/*
			 * 更多跳转
			 */
			$("#gomenu").on('click',function(){
				tools.toPage({
					href:'modules/security/aqyhgl/safetrouble.html',
					name:'sdfa'
				});
			});
			/*
			 * 控制整体高度
			 */
			$('.panel.panel-default').height($(window).height()-230);
			$('.panel.panel-default').css('overflow','auto');

			/*
			 * 刷新当前面时间
			 */
			setInterval(getTime,1000);
			function getTime(){
				$("#gettime").html(new Date().format('yyyy年MM月dd日 hh时mm分ss秒')); //将值赋给div
			}

			/*
			 * 加载三个小圆圈
			 */
         //获取json
			// $.get(`${tools.API_URL}/aqgl/securityProblemHandle/statisticsOfProblem`,{}).done(function(res){
			$.getJSON('modules/security/aqzhcx/statisticsOfProblem.json', function(res){
					var obj = res.body.sumOfProblemMap;
					for(var item in obj){
						$('#'+item).text(obj[item]);
					}
			});




			/*
			 * 左侧列表
			 */
			//查询json
			// $.get(`${tools.API_URL}/aqgl/saveManage/findList`,{status:4}).done(function(res){
			$.getJSON('modules/security/aqzhcx/manage.json', function(res){
				var data = res.body.scySafeManageList;
				for(var item in data){
					var html = `<li class="media">
				    <div class="media-left">
				      <a href="#">
				      	<img height="100" src="images/user-img.png" alt="..." class="img-rounded media-object">
				      </a>
				    </div>
				    <div class="media-body">
				      <p class="media-heading overtext">姓名：${data[item].smName ? data[item].smName:''}</p>
				      <p class="media-heading overtext">职务：${data[item].smWork ? data[item].smWork:''}</p>
				      <p class="media-heading overtext">是否在岗：${data[item].smCase ? (data[item].smCase == 0 ? '是':'否') : ''}</p>
				      <p class="media-heading overtext">电话：${data[item].smTel ? data[item].smTel:''}</p>
				    </div>
				  </li>`;
					$("#left-list").append(html);
				}
			});

			/*
			 * 右侧安全消息动态
			 */
			// $.post(`${resourceUrl}/data`,{loginName:loginName}).done(function(res){
			$.getJSON('modules/security/aqzhcx/aqxx.json', function(res){
				var rows = res.rows;

				for (let item in rows){
					var html = `<a data="${rows[item].id}" class="media show-right list-group-item">
					    <div class="media-top">
							<middle>提交人:${rows[item].sphProblemDescription}</middle><br />
							<small>${rows[item].sphProblemDescription}</small>
					    </div>
					    <div id="${rows[item].id}" class="media-body">
					    </div>
					  </a>`;
					  $("#right-list").append(html);
					  if(rows[item].sysAffixList){
						var arr = rows[item].sysAffixList;
						for(var i=0;i<arr.length;i++){
						 $.get(`${resourceUrl}/imagePreview`,{id:arr[i].id}).done(function(res){
						 	var imghtml = `<div class="col-sm-6" style="padding:0;">
								     		 <img class="img-rounded media-object" width="100%" height="60" src="${resourceUrl}/imagePreview?id=${arr[i].id}"/>
								   			</div>`;
						    console.log(imghtml);
						 	$("#"+rows[item].id).append(imghtml);
						 });
						}
					 }

				}
			});

			/*
			 * 右侧列表点击查看详情
			 */
			$(document).on('click', '.show-right', function() {
//				var data = eval('(' + $(this).attr("data") + ')');
				var data = {};
				data.show = true;
				data.id = $(this).attr('data');
				tools.toDialog({
					name: "查看安全隐患管理",
					url: "modules/aqgl/aqyhfx/safetrouble_add.html",
					area:['80%', '90%'],
					param: data,
					btn: ['关闭'],
					yes: function(obj, index) {
						layer.closeAll();
					}
				});
			})

	        /*
	         * 图形加载
	         */
	        function loadEcharts(xarr,yarr1,yarr2){
	        	var myChart = echarts.init(document.getElementById('main'));
	        option = {
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    legend: {
			        data:['上期隐患','本期隐患']
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            data :xarr,
			            axisLabel : {
			                show:true,
			                interval: 0,
		                	    rotate: 45
		                 // margin: 8
		               }
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value'
			        }
			    ],
			    series : [
			        {
			            name:'上期隐患',
			            type:'bar',
			            data:yarr1
			        },
			        {
			            name:'本期隐患',
			            type:'bar',
			            stack: '广告',
			            data:yarr2
			        }
			    ]
			};
	        myChart.setOption(option);
	        }

			/*
			 * 表格加载
			 */
			$('#example').bootstrapTable({
				// url: `${tools.API_URL}/aqgl/securityProblemHandle/sumOfProblem`,
				url: "modules/security/aqzhcx/sumOfProblem.json",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: false, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				showFooter: true,
//				sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function() { //请求服务器发送的参数
					var data = {};
					return data;
				},
				responseHandler: function(res) {
					var arr = res.body.sumOfProblemList;
		        		var xarr = [];
		        		var yarr1 = [];
		        		var yarr2 = [];
		        		for(var i in arr){
		        			xarr.push(arr[i].SPHPROBLEMTYPE);
		        			yarr1.push(arr[i].cntOfLastWeek);
		        			yarr2.push(arr[i].cntOfThisWeek);
		        		}
		        		loadEcharts(xarr,yarr1,yarr2);
					return res.body.sumOfProblemList;
				},
				columns: [{
 						//field: 'Number',//可不加
 						title: '序号',//标题  可不加
 						formatter: function (value, row, index) {
 							return index+1;
 					}
 					},
					{
						field: "SPHPROBLEMTYPE",
						title: "隐患项目",
						footerFormatter: function (value) {
							return '合计';
						}
					},
					{
						field: "cntOfLastWeek",
						title: "上期隐患",
						footerFormatter: function (value) {
							var count = 0;
							for (var i in value) {
								count += value[i].cntOfLastWeek;
							}
							if(count == 0){
								return '0';
							}else{
							return count;
							}

						}
					},
					{
						field: "cntOfThisWeek",
						title: "本期隐患",
						footerFormatter: function (value) {
							var count = 0;
							for (var i in value) {
								count += value[i].cntOfThisWeek;
							}
							if(count == 0){
								return '0';
							}else{
							return count;
							}
						}
					},
					{
						field: "tendency",
						title: "对比",
						align:'center',
						formatter:function(value,row,index){
							if(value =='上升'){
								return '<span style="color:#d9534f;" class="glyphicon glyphicon-arrow-up"></span>';
							}else if(value == '下降'){
								return '<span style="color:#5cb85c;" class="glyphicon glyphicon-arrow-down"></span>';
							}else{
								return '--'
							}
						}
					}
				]
			});

		}
	}
	return page;
});
