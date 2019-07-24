/**
 * 站点管理=》站点维护
 */
define("modules/system/lcpzxml", ["jquery", "underscore", "page/tools","chart"], function($, _, tools , chart) {

	var page = function() {};
	page = {
		init: function(request) {
		   	
		   	var resourceUrl = `${tools.API_URL}/lcpz/sysLcpzxml`; //页面url地址
			var resourceUrl_ztwhfc = `${tools.API_URL}/ztwhfc/sysProject`; //风场 url地址
			
			
			void function(){
				$('#id-1').hide(); //隐藏设置模板页面
				$('.zdy-btn-generate').parent('div').show()
				$('.nav-tabs li').on('click',function(){
					$('.nav-tabs').find('li').removeClass();
					$(this).addClass('active');
					$('#id-0,#id-1').hide();
					$('#id-'+$(this).index()).show();
					$("#project").bootstrapTable('refresh');
					$("#example").bootstrapTable('refresh');
					
				})
				
				$('#sel').change(function(){
					$('input[name=modularName]').val('');
					var data = $("form").serializeObject();
					$("#example").bootstrapTable('refresh', {
						query: data
					});
				})
				
			}();
			
			/**
			 * 下拉框显示
			 */
			tools.loadSelect({
				url: `${resourceUrl_ztwhfc}/data`,
				data:{pageSize:-1},
				selectId: "sel", // 下拉框id
				textField: "spName", // 显示的text
				valueField: "spCode", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			});
			
			
				
			/**
			 * 查询
			 */
			$("#query").on("click", function() {
				var data = $("form").serializeObject();
				$("#example").bootstrapTable('refresh', {
					query: data
				});
			});
			
			/**
			 * 查询
			 */
			$("#query02").on("click", function() {
				var data = $("form").serializeObject();
				$("#project").bootstrapTable('refresh', {
					query: data
				});
			});
			
			
			
			/**
			 * 流程 table显示
			 */
			$('#project').bootstrapTable({
				url: `${resourceUrl}/findLcpzXmlProject`,
				method: "get",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function() { //请求服务器发送的参数
					return {}
				},
				columns: [
					{
						field: "spCode",
						title: "风场编号"
					},
					{
						field: "spName",
						title: "风场名称"
					},
					{
						field: "slStatus",
						title: "状态",
						formatter: function(value, row, index) {
							return value ? value=='0' ? "普通":"模板":"无";
						}
					},
					{
						field: "3",
						title: "操作",
						formatter: function(value, row, index) {
							var rowObj = JSON.stringify(row);
							var v  = ``;
							if(row.slStatus){
								v  = `<div class='btn-group'>
						        		<button type='button' class='btn btn-info zdy-btn-Template' data='${rowObj}'>设为模板</button>
						        		&nbsp;&nbsp;</div>`;
							}
							return v;
						}
					}
				]
			});
			
		

			/**
			 * 流程 table显示
			 */
			$('#example').bootstrapTable({
				url: `${resourceUrl}/data`,
				method: "get",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function() { //请求服务器发送的参数
					return {pageSize:-1,spCode: $('#sel').val()}
				},
				responseHandler: function(res) {
					var data = res.rows;
					if(data.length == 0){
						$('.zdy-btn-generate').parent('div').show();//隐藏生成按钮
					}
					return data;
				},
				columns: [
					{
						field: "spName",
						title: "风场名称"
					},
					{
						field: "lcdykeyName",
						title: "流程key名称"
					},
					{
						field: "modularName",
						title: "模块名称"
					},
					
					{
						field: "3",
						title: "操作",
						formatter: function(value, row, index) {					
							$('.zdy-btn-generate').parent('div').hide();//隐藏生成按钮
							
							var rowObj = JSON.stringify(row);
							var v = ``;
					        //修改		
					        var up = `<div class='btn-group'>
						        		<button type='button' class='btn btn-info zdy-btn-edit' data='${rowObj}'>修改</button>
						        		&nbsp;&nbsp;</div>`;
						    //删除
						    var del =`<div class='btn-group'>
					        			<button type='button' class='btn btn-info zdy-btn-delete'  data='${rowObj}'>删除</button>
					        			</div>`;

					        v = up + del;
							return v;
						}
					}
				]
			});
			
			//设为模板事件
			$('.row-body').on('click', '.zdy-btn-Template', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				$.ajax({
					type: "post",
					url: `${resourceUrl}/setTemplate`,
					data: data,
					async: true,
				}).then(function(data) {
					layer.closeAll();
					$("#project").bootstrapTable('refresh');
				}, function() {
					console.log("请求错误");
				});
				
			})
			
			//生成数据
			$('.zdy-btn-generate').on("click", function() {
				layer.load(1, {shade: 0.2}); 
				$.ajax({
					type: "post",
					url: `${resourceUrl}/saveTemplate`,
					data: {spCode:$('#sel').val(),spName:$("#sel").find("option:selected").text()},
					async: true,
				}).then(function(data) {
					layer.closeAll();
					$("#example").bootstrapTable('refresh');
				}, function() {
					layer.closeAll();
					console.log("请求错误");
				});
				
			})

			/**
			 * 添加
			 */
			$(".zdy-btn-add").on("click", function() {
				var data = $("form").serializeObject();
				data.spName = $("#sel").find("option:selected").text();
				tools.toDialog({
					name: "添加配置信息",
					url: "modules/system/lcpzxml_add.html",
					area: ['80%', '90%'],
					param: {
						add:data
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data,page) {
						//var xmlText = data.processXml;
						var xmlText = page.getData();
						xmlText = xmlText.replace(/[\r\n]/g,"");
						xmlText = xmlText.replace(/[\t\f]/g,"");
						data.processXml = xmlText;
						add(data);
					}
				});
			});

			/**
			 * 修改
			 */
			$('.row-body').on('click', '.zdy-btn-edit', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				tools.toDialog({
					name: "修改配置信息",
					url: "modules/system/lcpzxml_add.html",
					area: ['80%', '90%'],
					param: data,
					btn: ['保存', '关闭'],
					yes: function(obj, index, data,page) {
						data.id = id;
						//var xmlText = data.processXml;
						var xmlText = page.getData();
						xmlText = xmlText.replace(/[\r\n]/g,"");
						xmlText = xmlText.replace(/[\t\f]/g,"");
						data.processXml = xmlText;
						add(data);
					}
				});
			})

			/**
			 * 删除
			 */
			$('.row-body').on('click', '.zdy-btn-delete', function() {
				var data = eval('(' + $(this).attr('data') + ')');
				var id = data.id;
				layer.confirm('是否删除？', {
					title:"提示",
					btn: ['是', '否'] //按钮
				}, function() {
					$.ajax({
						type: "get",
						url: `${resourceUrl}/delete/${id}`,
						async: true,
					}).then(function(data) {
						layer.closeAll();
						$("#example").bootstrapTable('refresh');
					}, function() {
						console.log("删除请求错误");
					});
				});
			})
			
	
			function add(data) {
				$.ajax({
					type: "post",
					url: `${resourceUrl}/save`,
					contentType: "application/json",
					data: JSON.stringify(data) ,
					async: true,
				}).then(function(data) {
					layer.closeAll();
					$("#example").bootstrapTable('refresh');
				}, function() {
					console.log("请求错误");
				});
			}
          
        
       }     
	}
	return page;
});