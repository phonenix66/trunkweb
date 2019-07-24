define("modules/system/orgnazation", ["jquery", "underscore", "page/tools", "jstree"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/orgnzation/sysDept`; //页面url地址
			var dsObj = {}; //保存第一个树节点对象
			showTree();
			/**
			 * 查询
			 */
			$("#query").on("click",function(){
				dsObj.sdName = $("input[name='sdName']").val();
				$("#example").bootstrapTable('refresh', {
					query: {sdFid:dsObj.id,sdName:dsObj.sdName}
				});
			});

			/**
			 * 加载菜单树
			 */
			function showTree() {
				tools.loadTree({
					url: `${resourceUrl}/findList`, //请求链接地址
					data: {
						type: '1'
					},

					treeId: "chooseMenuTree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "sdFid", //数据的父级id名称
					name: "sdName", //数据在树的显示字段
					shortName: "sdSort", //数据在树的排序字段
					// showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.rows;
					},
					level: 1,
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						$("#example").bootstrapTable('refresh',
							{
								query: {
									sdFid: id
								}
							}
						);
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
					method:"get",
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
							pageSize:-1,
							sdFid: dsObj.id
						}
					},
					responseHandler: function(res) {
						var data = res.rows;
						if(data.length > 0){
							data.forEach(function(obj, index) {
								obj.parentName = tools.getTreeName(obj.sdPathname,2);
							})
						}
						return data;
					},
					columns: [{
							field: "sdName",
							title: "单位名称"
						},
						// 联系人 联系电话
						{
							field: "sdContacts",
							title: "联系人"
						},
						{
							field: "sdPhone",
							title: "联系电话"
						},
						{
							field: "jlType",
							title: "是否是监管单位",
							formatter: function(value, row, index) {
								if(value == '0'){
									return '否';
								}else if(value == '1'){
									return '是';
								}else{
									return '未知';
								}
							}
						},
						// {
						// 	field: "sdShortname",
						// 	title: "机构简称"
						// },
						// {
						// 	field: "parentName",
						// 	title: "上级机构名称"
						// },
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
					name: "添加组织机构信息",
					url: "modules/system/orgnzation_add.html",
					param: {add:dsObj},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						if(dsObj.id !== undefined){ //有数据则赋值
							data.type= '1',
							data.sdFid = dsObj.id; //父id
							data.sdPathid = dsObj.sdPathid; //id path
							data.sdPathname = dsObj.sdPathname; //name path
						}
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
					name: "修改组织机构信息",
					url: "modules/system/orgnzation_add.html",
					param: {edit:data},
					btn: ['保存', '关闭'],
					yes: function(obj, index, data) {
						data.id =  id;
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
				$.ajax({
					type: "get",
					url: `${resourceUrl}/data`,
					data: {
						sdFid: id
					},
					async: true,
					success: function(res) {
						if(res.rows.length > 0) {
							layer.msg("有子节点不可删除")
							return ;
						}
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
							}
						);

					}
				})


			})

			function add(data) {
				$.ajax({
					type: "post",
					url: `${resourceUrl}/save`,
					data: data,
					async: true
				}).then(function(data) {
					if(data.success){
						layer.closeAll();
						showTree();
						$("#example").bootstrapTable('refresh');
					}else{
						layer.msg(data.msg)
					}
				}, function() {
					console.log("请求错误");
				});
			}

		}

	}
	return page;
});
