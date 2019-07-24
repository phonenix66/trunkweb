/**
 * 站点管理=》站点维护
 */
define("modules/system/project_define/jtpglr", ["jquery", "underscore", "page/tools", "jstree"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/jtpglr/intGslist`; //页面url地址
			var resourceUrl_ztwhfc = `${tools.API_URL}/ztwhfc/sysProject`; //风场 url地址
			var dsObj = {}; //保存第一个树节点对象

			var selObj = {};

			var currentNode = {};

			//选择风场
			$("#sel").on("change", function() {
				//更换初始化的option为optgroup只读状态
				var _option = $("#sel").children("option").eq(0);
				if(_option.val() == "") {
					var initText = _option.html();
					_option.remove();
					$("#sel").prepend("<optgroup selected label='" + initText + "'></optgroup>");
				}
				selObj.spCode = $(this).val();
				showTree();
				$("#example").bootstrapTable('refresh');
			});

			/**
			 * 下拉框显示
			 */
			tools.loadSelect({
				url: `${resourceUrl_ztwhfc}/data`,
				data: {
					pageSize: -1
				},
				selectId: "sel", // 下拉框id
				initText: "请选择风场", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
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
				//如果没有选风场
				if(JSON.stringify(selObj) == "{}") {
					layer.msg("请选择风场", {
						icon: 5
					});
					return;
				}
				var data = $("form").serializeObject();
				data.igFid = dsObj.id;
				$("#example").bootstrapTable('refresh', {
					query: data
				});
			});

			/**
			 * 加载菜单树
			 */
			function showTree() {

				tools.loadTree({
					url: `${resourceUrl}/data`, //请求链接地址
					data: {
						spCode: selObj.spCode || "",
						pageSize: -1
					},
					treeId: "chooseMenuTree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "igFid", //数据的父级id名称
					name: "igName", //数据在树的显示字段
					shortName: "igSort", //数据在树的排序字段
					showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.rows;
					},
					click: function(obj, e) { //树点击事件

						// 获取当前节点
						currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						$("#example").bootstrapTable('refresh', {
							query: {
								igFid: id
							}
						});
					},
					endCallback: function(data) { //每次树加载完后
						//保存第一个对象
						dsObj = data.length > 0 ? data[0].menu : {
							id: "-1"
						};
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
							pageSize: -1,
							igFid: dsObj.id
						}
					},
					responseHandler: function(res) {
						var data = res.rows;
						data.forEach(function(obj, index) {
							obj.parentName = tools.getTreeName(obj.igPathname, 2);
						})
						return data;
					},
					columns: [{
							field: "igCode",
							title: "概算编号"
						}, {
							field: "igName",
							title: "概算名称"
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
				//如果没有选风场
				if(JSON.stringify(selObj) == "{}") {
					layer.msg("请选择风场", {
						icon: 5
					});
					return;
				}

				tools.toDialog({
					name: "添加概算信息",
					url: "modules/system/project_define/jtpglr_add.html",
					param: {
						add: dsObj
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						if(dsObj.id !== undefined) { //有数据则赋值
							data.igFid = dsObj.id; //父id
							data.igPathid = dsObj.igPathid; //id path
							data.igPathname = dsObj.igPathname; //name path
						}
						add(data);
					}
				});
			});
			
			
			/**
			 * 导出excel
			 */
			$(".zdy-btn-excel").on("click", function() {
				//如果没有选风场
				if(JSON.stringify(selObj) == "{}") {
					layer.msg("请选择风场", {
						icon: 5
					});
					return;
				}
        
                var spCode = selObj.spCode;
				var url = `${resourceUrl}/export`;
				var datas = [
					 	{'spCode':spCode}
				    ]; 
				tools.outputExcel(datas,url);
			
			});
			
			
			/**
			 * 导出excel模板
			 */
			$(".zdy-btn-template").on("click", function() {
				//如果没有选风场
				var url = `${resourceUrl}/import/template`;
				var datas = []; 
				tools.outputExcel(datas,url);
			
			});
			
			

	        //初始化树形结构
			function findTree(key) {
				tools.loadTree({
					url: `${resourceUrl}/findRedis`,
					data:{key:key},
					treeId: "js_tree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "igFid", //数据的父级id名称
					name: "igName", //数据在树的显示字段
					shortName: "igCode", //数据在树的排序字段
					showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response;
					},
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						var sdName = currentNode.text;
				
					}
				})
			};
			
			function selectHandle(key) {
				layer.open({
					type: 1,
					title: "概算结构",
					area: ["500px", "700px"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					btn1: function(index, layero) {
						addAll(key);
						layer.close(index);
					},
					btn2: function(index, layero) {
						layer.close(index);
					}
				});
			}
			
			
			/**
			 * 导入excel
			 */
			$("#saveZipButton").on('click', function(){	
				if(JSON.stringify(selObj) == "{}") {
					layer.msg("请选择风场", {
						icon: 5
					});
					return;
				}
				
			var selstr = selObj.spCode;
				
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
			    formData.append("spCode",selstr);
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
                            findTree(responseStr.key);
                            selectHandle(responseStr.key);
			            }else{
			                layer.msg(responseStr.msg);
			            }
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
					name: "修改概算信息",
					url: "modules/system/project_define/jtpglr_add.html",
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
						$("#example").bootstrapTable('refresh', {
							query: {
								igFid: currentNode.id
							}
						});
					}, function() {
						console.log("请求错误");
					});
				});
			})

			function add(data) {
				data.spCode = selObj.spCode;
				$.ajax({
					type: "post",
					url: `${resourceUrl}/save`,
					data: data,
					async: true,
				}).then(function(data) {
					layer.closeAll();
					showTree();

					$("#example").bootstrapTable('refresh', {
						query: {
							igFid: currentNode.id
						}
					});
				}, function() {
					console.log("请求错误");
				});
			}
			
			
			function addAll(key) {
				var data = {key:key};
				$.ajax({
					type: "post",
					url: `${resourceUrl}/insetList`,
					data: data,
					async: true,
				}).then(function(data) {
					layer.closeAll();
					showTree();

					$("#example").bootstrapTable('refresh', {
						query: {
							igFid: currentNode.id
						}
					});
				}, function() {
					console.log("请求错误");
				});
			}

		}
	}
	return page;
});