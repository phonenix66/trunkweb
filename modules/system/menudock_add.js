/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/menudock_add", ["jquery", "underscore", "page/tools", "jstree","bootstrap-datepicker","icheck","bootstrapvalidator", "layer"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
		    bsvalid();
			
			findTree();//初始化弹窗的数据
			var menu = $('.treeview-menu');
			var param = request.param;
			if (param.add) { //新增
				var tId = param.add.tId;
				var tName = param.add.tName;
				$('#officeName').val(tName);
				$('#officeId').val(tId);
			} else { //修改
			   $('#mId').val(param.edit.id);//id
			   $('#name').val(param.edit.name);//菜单名称  name
			   $('#officeId').val(param.edit.parentId);//父菜单名称 parentId pathId pathName
			   $('#pathId').val(param.edit.pathId);
			   $('#officeName').val(param.edit.pathName);
			   $('#sort').val(param.edit.sort);
			   //资源名称 
			   //资源描述
			   $('#href').val(param.edit.url);//资源路径 href
			   $('#permission').val(param.edit.permission);//权限标识 permission
			   $('#img').val(param.edit.img);
			   var menuType = param.edit.menuType;
			   if(menuType!='0'){
			   	  menuType = 1;
			   }
			   $("input[name='menuType'][value="+menuType+"]").attr("checked",true);//类型
			   
			}
			menu.sortable();
//			$('#example').DataTable({
//				'paging': true,
//				'lengthChange': false,
//				'searching': false,
//				'ordering': true,
//				'info': true,
//				'autoWidth': false
//			});
	       
            //Date picker
            $('#datepicker1').datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });
            $('#datepicker2').datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });
            $('input[type="checkbox"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green'
            })
			$(".box-title").html(request.name);
			
			

			$(".zdy-btn-save").on("click", function() {
				//保存数据
				
				tools.toPage(request.lastmenu);
			});

			$(".zdy-btn-back").on("click", function() {
				tools.toPage(request.lastmenu);
			});

			$('#chooseMenuTree').jstree({
				'core': {
					'data': tools.getMenuList()
				},
				"checkbox": {
					"keep_selected_style": false
				},
				"plugins": ["checkbox"]
			});
			
			//点击父菜单名称，弹窗
			$('.officeName').on('click', function () {
				popupMenu();
			});
			
				//初始化树形结构
			function findTree(){
                var param = {menuType : "-1"};
				tools.loadTree({
					url: `${tools.API_URL}/ewindsys/ewindMenu/findList`, //请求链接地址
					data: param,
					treeId: "js_tree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "parentId", //数据的父级id名称
					name: "name", //数据在树的显示字段
//					shortName: "sdSort", //数据在树的排序字段
					showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.menuList;
					},
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						var sdName = currentNode.text;
						
						console.log(currentNode);
						var pathId = currentNode.original.menu.pathId;
						//将parents数组组合成字符串，逗号隔开
						pathId += id;
						console.log(pathId);
						
 					    $('#officeId').val(id);
					    $('#officeName').val(sdName);
					    $('#pathId').val(pathId);
					}
				})
			};
			

            //弹出选择父目录
            function popupMenu(){
            		layer.open({
					type: 1,
					title: "选择公司",
					area: ["300px", "420px"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					btn1: function (index, layero) {
//						self.assginVal(type, tree);
//						$('#js_tree').jstree("destroy");
						layer.close(index);
					},
					btn2: function (index, layero) {
//						$('#officeId').val('');
//					    $('#officeName').val('');
						layer.close(index);
					}
				});
            }
            
            function bsvalid() {
            	$('form').bootstrapValidator({
					framework: 'bootstrap',
					icon: {
						valid: 'glyphicon glyphicon-ok',
						invalid: 'glyphicon glyphicon-remove',
						validating: 'glyphicon glyphicon-refresh'
					},
				    fields: {
				    	"name": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						"ihCode": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						"spName": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
//						"url": {
//							validators: {
//								notEmpty: {
//									message: '这是必填字段'
//								}
//							}
//						},
						"officeName": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						}
				    }
					
				})
            }

		}
	}

	return page;
});