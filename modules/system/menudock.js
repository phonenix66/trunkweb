define("modules/system/menudock", ["jquery", "underscore", "page/tools",
	"serializeJSON", "jstree"
], function($, _, tools) {

	var page = function() {};
	page = {

		init: function(request) {

			var resourceUrl = `${tools.API_URL}/ewindsys/ewindMenu`; //页面url地址

			//显示树
			showTree();

			//查询条件
			var dsObj = {};

			/**
			 * 查询
			 */
			$("#query").on("click", function() {
				var data = $("#searchForm").serializeObject();
				data.pageNo = 1;
				data.pageSize = 10;
				$("#table").bootstrapTable('refresh');
			})

			/**
			 * table显示
			 */
			$('#table').bootstrapTable({
				url: `${resourceUrl}/data`,
				method: "get",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				dataType: "json",
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function(params) { //请求服务器发送的参数
					//					return {
					//						parentId: '1'
					//					}
					var searchParam = $("#searchForm").serializeJSON();


					searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
					searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
					searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
					return searchParam;
				},
				columns: [{
						field: "name",
						title: "姓名"
					},
					{
						field: "url",
						title: "路径"
					},

					{
						field: "menuType",
						title: "类型",
						formatter: function(value, row, index) {
							if(row.menuType == 0) {
								return "按钮";
							} else {
								return "菜单";
							}
						}
					},
					{
						field: "permission",
						title: "权限标识"
					},
					{
						field: "3",
						title: "操作",
						formatter: function(value, row, index) {
							rowDate = JSON.stringify(row);
							var v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-edit' data='${rowDate}'>修改</button>
					        	&nbsp;&nbsp;</div>`;
					        var d = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-del'  data='${rowDate}'>删除</button>
					        	</div>`;
					        if(row.children == 'false'){
								return v+d;
							}else{
								return v;
							}

						}
					}
				]
			});

			function showTree() {
				//查询出菜单树的数据
				tools.loadTree({
					url: `${tools.API_URL}/ewindsys/ewindMenu/findList`, //请求链接地址
					//					async: false,
					treeId: "chooseMenuTree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "parentId", //数据的父级id名称
					name: "name", //数据在树的显示字段
					//					shortName: "sdSort", //数据在树的排序字段
					level:1,
					showAll: false, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.menuList;
					},
					click: function(obj, e) { //树点击事件

						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						var name = currentNode.text;
						$('#tId').val(id);
						$('#tName').val(name);

						$("#table").bootstrapTable('refresh', {
							query: {
								parentId: id,
								menuType: 2
							}
						});

					}
				});
				//          	console.log(tty);
				//              return proList(tty);
			};

			//debugger;
			//			$('#chooseMenuTree').jstree({
			//				'core': {
			//					'data': getPList()
			//				},
			//				"check_callback": true,
			//				"checkbox": {
			//					"keep_selected_style": false
			//				},
			//				"plugins": [
			//					"contextmenu", "dnd", "search",
			//					"state", "types", "wholerow"
			//				]
			//			});

			//          $('#example').DataTable({
			//              'paging': true,
			//              'lengthChange': false,
			//              'searching': false,
			//              'ordering': true,
			//              'info': true,
			//              'autoWidth': false
			//          });

			$(".zdy-btn-add").on("click", function() {
				var id = $(this).attr("id");
				addNewMenu();
				//              tools.toPage({
				//                  name: "添加菜单信息",
				//                  href: "modules/system/menudock_add.html",
				//                  lastmenu: request
				//              });
			});

			/**
			 * 修改菜单信息
			 */
			$('.row-body').on('click', '.zdy-btn-edit', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				tools.toDialog({
					name: "修改菜单信息",
					url: "modules/system/menudock_add.html",
					param: {
						edit: data
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						//						data.id = id;
						saveData(data);
						// $('#table').bootstrapTable('refresh');

						// $('#tId').val(id);
						// $('#tName').val(name);
                        var id = $('#tId').val();
						$("#table").bootstrapTable('refresh', {
							query: {
								parentId: id,
								menuType: 2
							}
						});

						layer.close(index);
						//add(data);
					}
				});
			});

			function addNewMenu() {
				var tId = $('#tId').val();
				var tName = $('#tName').val();
				var data = {
					'tId': tId,
					'tName': tName
				}
				tools.toDialog({
					name: "添加菜单信息",
					url: "modules/system/menudock_add.html",
					param: {
						add: data
					},
					skin: "layerui-layer",
					shade: 0.3,
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						saveData(data);
						showTree();
						// $('#table').bootstrapTable('refresh');
						var id = $('#tId').val();
						$("#table").bootstrapTable('refresh', {
							query: {
								parentId: id,
								menuType: 2
							}
						});
						layer.close(index);
					},
				});
			};

			//保存
			function saveData(data) {
				$.ajax({
					url: `${tools.API_URL}/ewindsys/ewindMenu/save`,
					async: false,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function(res) {
						layer.msg("保存成功");
					},
					error: function(err) {

					}
				})
			}

			$('.row-body').on('click', '.zdy-btn-del', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				var data = {
					"ids": id
				};
				console.log(data);
				//删除数据
				layer.confirm("您确认要删除吗？", function(index, layero) {
					$.ajax({
						url: `${tools.API_URL}/ewindsys/ewindMenu/deleteAll`,
						type: 'get',
						data: data,
						contentType: "application/json;charset=UTF-8",
						success: function(data) {
							if(data.success == true) {
								layer.msg("删除成功");
								showTree();
							} else {
								layer.msg("删除失败");
							}
							//刷新数据
							// $('#table').bootstrapTable('refresh');
							var id = $('#tId').val();
							$("#table").bootstrapTable('refresh', {
								query: {
									parentId: id,
									menuType: 2
								}
							});
						}
					});
				});
			});

		}

	}
	return page;
});
