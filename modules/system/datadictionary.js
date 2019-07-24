define("modules/system/datadictionary", ["jquery", "underscore", "page/tools", "jstree"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/datadictionary/sysDict`; //页面url地址
			var dsObj = {}; //保存第一个树节点对象
			showTree();
			/**
			 * 查询
			 */
			$("#query").on("click", function() {
				var data = $("form").serializeObject();
				data.id = dsObj.id;
				$("#example").bootstrapTable('refresh', {
					query: data
				});
			});

			/**
			 * 数据字典分类对应的名称
			 * @param {Object} num
			 */
			function getTypeName(num) {
				switch(num) {
					case "01":
						return "施工机械"
					case "02":
						return "预警等级"
					case "03":
						return "分类"
					case "04":
						return "项目属性"
					case "05":
						return "采购方式"
					case "06":
						return "承包商"
					case "07":
						return "供应商"
					case "08":
						return "服务商"
					case "09":
						return "建设单位"
				}
			}
			
			
			/**
			 * 导出excel
			 */
			$(".zdy-btn-excel").on("click", function() {
				var  sdType = dsObj.sdType;
				//如果没有选风场
				var url = `${resourceUrl}/export`;
				var datas = [
					 	{'sdType':sdType}
				    ]; 
				tools.outputExcel(datas,url);
			
			});
			
			
			/**
			 * 导入excel
			 */
			$("#saveZipButton").on('click', function(){	
				debugger
				var sdType = dsObj.sdType;
				if(sdType == null) {
					layer.msg("请选择项目分类", {
						icon: 5
					});
					return;
				}
				
				
			  var spCode = tools.getSpCode();
			  var formData = new FormData();
			    var name = $("#articleImageFile").val();
			    var file = $("#articleImageFile")[0].files[0];
			    if(file == null) {
					layer.msg("请选择文件", {
						icon: 5
					});
					return;
				}
	
			    formData.append("file",file);
			    formData.append("name",name);//这个地方可以传递多个参数
			    formData.append("sdType",sdType);
			    $.ajax({
			        url :  `${resourceUrl}/inputExcel`,
			        type : 'POST',
			        async : false,
			        data : formData,
			        // 告诉jQuery不要去处理发送的数据
			        processData : false,
			        // 告诉jQuery不要去设置Content-Type请求头
			        contentType : false,
			        beforeSend:function(){
			            console.log("正在进行，请稍候");
			        },
			        success : function(responseStr) {
			            if(responseStr.success){
                           showTree();
					       $("#example").bootstrapTable('refresh');
			            }else{
			                layer.msg(responseStr.msg);
			            }
			        }
			    });
		});

			/**
			 * 加载菜单树
			 */
			function showTree() {

				tools.loadTree({
					url: `${resourceUrl}/tree`, //请求链接地址
					treeId: "chooseMenuTree", //id选择器名称
					transformation: false,	//不需要前端转换
					showAll: true, //是否展开所有的树节点
					responseHandler: function(data) { //数据接收到之前回调
						data.forEach(function(obj, index) {
							obj.name = getTypeName(obj.sdType);
						})
						var treeArr = new Array();
						_.each(data, function(item1) {
							treeArr.push({
								"id": item1.sdType,
								"parent": "#",
								"text": item1.name,
								"menu": item1
							});
							_.each(item1.list, function(item2) {
								treeArr.push({
									"id": item2.id,
									"parent": item1.sdType,
									"text": item2.sdLabel,
									"menu": item1
								});
							})
						})
						return treeArr;
					},
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						$("#example").bootstrapTable('refresh');
					},
					endCallback: function(data) { //每次树加载完后
						//保存第一个对象
						dsObj = data.length > 0 && (JSON.stringify(dsObj) == "{}") ? data[0].menu : dsObj;
						showTable();
					}
				})
			}
			/**
			 * table显示
			 */
			function showTable() {
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
						return {
							sdType: dsObj.sdType,
						    pageSize:-1
						}
					},
					responseHandler: function(res) {
						var data = res.rows;
						return data;
					},
					columns: [{
							field: "sdLabel",
							title: "项目名称"
						},
						{
							field: "sdValue",
							title: "项目值"
						},
						{
							field: "createDate",
							title: "创建时间",
							formatter: function(value, row, index) {
								return new Date(value).format("yyyy-MM-dd");
							}
						},
						{
							field: "5",
							title: "操作",
							formatter: function(value, row, index) {
								row = JSON.stringify(row);
								var v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-edit' data='${row}'>修改</button>
					        	&nbsp;&nbsp;</div>
					        	<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${row}'>删除</button>
					        	</div>`
								return v;
							}
						}
					]
				});
			}

			/**
			 * 添加
			 */
			$(".zdy-btn-add").on("click", function() {
				tools.toDialog({
					name: "添加数据字典信息",
					url: "modules/system/datadictionary_add.html",
					param: {
						add: dsObj
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
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
					name: "修改数据字典信息",
					url: "modules/system/datadictionary_add.html",
					param: {
						edit: data
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						data.id = id;
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
					btn: ['是', '否'] //按钮
				}, function() {
					$.ajax({
						type: "get",
						url: `${resourceUrl}/delete/${id}`,
						async: true,
					}).then(function(data) {
						layer.closeAll();
						showTree();
						$("#example").bootstrapTable('refresh');
					}, function() {
						console.log("请求错误");
					});
				});
			})

			function add(data) {
				$.ajax({
					type: "post",
					url: `${resourceUrl}/save`,
					data: data,
					async: true,
				}).then(function(data) {
					layer.closeAll();
					showTree();
					$("#example").bootstrapTable('refresh');
				}, function() {
					console.log("请求错误");
				});
			}

		}

	}
	return page;
});