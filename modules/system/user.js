define("modules/system/user", ["jquery", "underscore", "page/tools",
	"bootstrap-datepicker", "serializeJSON", "bootstrap-treeview", "jstree"
], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {

			var resourceUrl = `${tools.API_URL}/ewindsys/ewindUser`; //页面url地址
			findTree();
			/**
			 * 查询
			 */
			$("#query").on("click", function() {
				var data = $("searchForm").serializeObject();

				data.pageNo = 1;
				data.pageSize = 10;
				$("#table").bootstrapTable('refresh');
			})

			$("#reset").on("click", function() {
				//				$('#officeId').val('');
				$('#officeId').val("");
				var data = $('form').serializeObject();
				data.pageNo = 1;
				data.pageSize = 10;
				$("#table").bootstrapTable('refresh');
			});

			$.getJSON(`${tools.API_URL}/orgnzation/sysDept/findList`, function(data) {

				$('#bs_tree').treeview({
					data: data,
					levels: 5,
					onNodeSelected: function(event, treeNode) {
						var id = treeNode.id == '0' ? '' : treeNode.id;
						if(treeNode.level == 1) {
							$("#deptId").val(id);
							//							$("#companyName").val(treeNode.text);
							//							$("#officeId").val("");
							//							$("#officeName").val("");
						} else {
							$("#companyId").val("");
							$("#companyName").val("");
							$("#officeId").val(id);
							$("#officeName").val(treeNode.text);
						}
						$('#table').bootstrapTable('refresh');
					}
				});
			});

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

					var searchParam = $("#searchForm").serializeJSON();
					searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
					searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
					searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
					return searchParam;
				},
				columns: [{
						field: "loginName",
						title: "账号"
					},
					{
						field: "name",
						title: "姓名"
					},
					{
						field: "deptName",
						title: "组织机构/单位"
					},
					// {
					// 	field: "dutyName",
					// 	title: "职务"
					// },
					{
						field: "mobile",
						title: "手机"
					},
					{
						field: "3",
						title: "操作",
						formatter: function(value, row, index) {
							row = JSON.stringify(row);
							var v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-edit' data='${row}'>修改</button>
					        	&nbsp;&nbsp;</div>
					        	<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${row}'>删除</button>
					        	</div>&nbsp;&nbsp;</div>
					        	<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-reset'  data='${row}'>重置密码</button>
					        	</div>`
							return v;
						}
					}
				]
			});

			/**
			 * 修改用户信息
			 */
			$('.row-body').on('click', '.zdy-btn-edit', function() {

				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				tools.toDialog({
					name: "修改用户信息",
					url: "modules/system/user_add.html",
					param: {
						edit: data
					},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {

						saveData(data);
						$('#table').bootstrapTable('refresh');
						layer.close(index);
						//add(data);
					}
				});
			});

			/**
			 * 删除用户信息
			 */
			$('.row-body').on('click', '.zdy-btn-delete', function() {

				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				var data = {
					"ids": id
				};
				//删除数据
				layer.confirm(
					"您确认要删除吗？", {
						title: '信息'
					},
					function(index, layero) {
						$.ajax({
							url: `${tools.API_URL}/ewindsys/ewindUser/deleteAllByLogic`,
							type: 'get',
							data: data,
							contentType: "application/json;charset=UTF-8",
							success: function(data) {
								if(data.success == true) {
									layer.msg("删除成功");
								} else {
									layer.msg("删除失败");
								}
								//刷新数据
								$('#table').bootstrapTable('refresh');
							}
						});
					});
			});

			/**
			 * 重置用户密码
			 */
			$('.row-body').on('click', '.zdy-btn-reset', function() {
				var res = eval('(' + $(this).attr("data") + ')');
				var data = {
					"id": res.id,
					"loginName": res.loginName
				};
				//删除数据
				layer.confirm(
					"您确认要重置该用户的密码吗？", {
						title: '信息'
					},
					function(index, layero) {
						$.ajax({
							url: `${tools.API_URL}/ewindsys/ewindUser/resetPassword`,
							type: 'get',
							data: data,
							contentType: "application/json;charset=UTF-8",
							success: function(data) {
								layer.msg(data.msg);
							}
						});
					});
			});

			var self = this;
			$(".user-btn-add").on("click", function() {
				addNewUser();
			});
			$('.companyName,.search-c').on('click', function() {
				var type = 1;
				selectHandle(type);
			});
			$('.officeName,.search-o').on('click', function() {
				var type = 2;
				selectHandle(type);
			});

			//初始化树形结构
			function findTree() {
				tools.loadTree({
					url: `${tools.API_URL}/orgnzation/sysDept/findList`, //请求链接地址
					data:{type:1},
					treeId: "js_tree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "sdFid", //数据的父级id名称
					name: "sdName", //数据在树的显示字段
					shortName: "sdSort", //数据在树的排序字段
					showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.rows;
					},
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						var sdName = currentNode.text;
						$('#officeId').val(id);
						$('#officeName').val(sdName);
					}
				})
			}

			function saveData(data) {
				$.ajax({
					url: `${resourceUrl}/save`,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function(res) {
						layer.msg(res.msg);
						$('#table').bootstrapTable('refresh');
					},
					error: function(err) {

					}
				})
			}

			function addNewUser() {
				tools.toDialog({
					name: "添加用户信息",
					url: "modules/system/user_add.html",
					param: {
						add: true
					},
					skin: "layerui-layer",
					shade: 0.3,
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						saveData(data);
						layer.close(index);
						$('#table').bootstrapTable('refresh');

					}
				});
			}

			function selectHandle(type) {
				//				var self = this;
				//
				//				var tree = $("#js_tree").jstree({
				//					'core': {
				//						"multiple": true,
				//						"animation": 0,
				//						"themes": {
				//							"icons": true,
				//							"stripes": false
				//						},
				//						'data': {
				//							"url": `${tools.API_URL}/sys/office/treeData?type=${type}&&extId=&isAll=&module=&t=` + new Date().getTime(),
				//							"dataType": "json"
				//						}
				//					},
				//					'plugins': ['types', "search", 'wholerow'],
				//					"types": {
				//						'default': {
				//							'icon': 'fa fa-file-text-o'
				//						},
				//						'1': {
				//							'icon': 'fa fa-home'
				//						},
				//						'2': {
				//							'icon': 'fa fa-umbrella'
				//						},
				//						'3': {
				//							'icon': 'fa fa-group'
				//						},
				//						'4': {
				//							'icon': 'fa fa-eur'
				//						},
				//						'btn': {
				//							'icon': 'fa fa-square'
				//						}
				//					}
				//				}).jstree();
				layer.open({
					type: 1,
					title: "选择公司",
					area: ["300px", "420px"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					btn1: function(index, layero) {
						//						self.assginVal(type, tree);
						//						$('#js_tree').jstree("destroy");
						layer.close(index);
					},
					btn2: function(index, layero) {
						//						$('#officeId').val('');
						//					    $('#officeName').val('');
						layer.close(index);
					}
				});
			}

			function assginVal(type, tree) {
				var ids = [],
					names = [],
					nodes = [];
				nodes = tree.get_selected(true);
				for(var i = 0; i < nodes.length; i++) {
					ids.push(nodes[i].id);
					names.push(nodes[i].text);
					break;
				}
				if(type === 1) {
					$('.companyName').val(names.join(''));
					$('#companyId').val(ids.join(''));
					$('.companyName').focus();
				} else {
					$('.officeName').val(names.join(''));
					$('#officeId').val(ids.join(''));
					$('.officeName').focus();
				}
			}

		}

	}

	return page;
});
