/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/user_add", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker", "icheck", "bootstrapvalidator", "layer"], function($, _, tools) {

	var page = function() {};

	var resourceUrl = `${tools.API_URL}`; //页面url地址

	page = {
		init: function(request) {

			var param = request.param;
			findTree();

			findDuty();

			findRole();

			if(param.add) { //新增
				//               findRole();
			} else { //修改
				var deptId = param.edit.deptId; //部门id
				//查询出部门信息，获得部门名称

				//			    findRole();
				//赋值给表单
				$('#uId').val(param.edit.id); //id
				$('#officeId').val(param.edit.deptId); //部门id
				setSdName(deptId); //设置部门名称
				$('#roleId').val(param.edit.roleId); //角色

				$('#name').val(param.edit.name); //姓名
				$('#no').val(param.edit.no); //工号
				$('#loginName').val(param.edit.loginName); //登录名
//				$('#newPassword').val(param.edit.password); //密码
				$('#email').val(param.edit.email); //邮箱
//				$('#confirmNewPassword').val(param.edit.password); //确认密码
				$('#phone').val(param.edit.phone); //电话
				$('#mobile').val(param.edit.mobile); //手机
				$('#loginFlag').val(1); //是否允许登陆
				$('#remarks').text(param.edit.remarks); //备注

				$('#dutyId').val(param.edit.dutyId); //职务

				$.ajax({
					url: `${tools.API_URL}/ewindsys/swUserRole/findRoles`,
					async: false,
					data:{userId:param.edit.id},
					type: 'get',
					success: function(data) {
						// $('#dept_3').selectpicker('val', data.split(',')).trigger("change");
						$('#roleId').val(data);

					}
				});
				/* $.ajax({
					type: "get",
					url: `${resourceUrl}/find/${id}`,
					async: true,
				}).then(function (data) {
					tools.setValueToInput(data);
				}, function () {
					console.log("请求错误");
				}); */
			}
			$('input[name="roleIdList"]').iCheck({
				labelHover: false,
				cursor: true,
				checkboxClass: 'icheckbox_square-blue',
				radioClass: 'iradio_square-blue',
				increaseArea: '20%'
			});
			var self = this;
			bsvalid();
			$('.companyName,.search-c').on('click', function() {
				var type = 1;
				selectHandle(type);
			})
			$('.officeName,.search-o').on('click', function() {
				var type = 2;
				selectHandle(type);

			});

			//初始化树形结构
			function findTree() {
				//				console.log(`${resourceUrl}/findList`);
				tools.loadTree({
					//					url: `${resourceUrl}/findList`, //请求链接地址
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
						$('#officeName').val(sdName).change();

					}
				})
			}

			function findDuty() {

			//职务类型
//			tools.loadSelect({
//				url: `${API_URL}/sys/dict/getDictValue`,
//				data: {
//					"dictTypeId": 33
//				},
//				selectId: "dutyId", // 下拉框id
//				initText: "--请选择--", // 初始化第一排的显示
//				initValue: "", // 初始化第一排的value
//				textField: "label", // 显示的text
//				valueField: "label", // 显示的value
//				responseHandler: function(response) { //数据接收到之前回调
//					return response.rows;
//				}
//			})


			tools.getDictValue(33,"dutyId");

			}

			$('#dept_3').change(function() {
				var data = $(this).val();
				var dataStr = '';
				if(data.length > 0) {
					dataStr = data.join();
				} else {
					dataStr = data;
				}
				$('#roleId').val(dataStr);
			});


			//初始化角色
			function findRole(){
			      $.ajax({
						url: `${tools.API_URL}/ewindsys/ewindRole/data`,
						async: false,
						type: 'get',
						contentType: "application/json;charset=UTF-8",
						success: function(data){
							if(data.rows.length > 0){
								 for(var i = 0;i<data.rows.length;i++){
								     var option1 = '<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>';
								     $('#roleId').append(option1);
								 }
								// $('#dept_3').selectpicker('refresh');
								// $('#dept_3').selectpicker('render');
							}
						}
				  });
			}

			//查询出部门信息
			function setSdName(deptId) {
				$.ajax({
					url: `${tools.API_URL}/orgnzation/sysDept/find/` + deptId,
					async: false,
					type: 'get',
					contentType: "application/json;charset=UTF-8",
					success: function(data) {
						//						console.log(data);
						$('#officeName').val(data.sdName); //部门名称
					}
				});
			}

			$('#companyDelButton').on('click', function() {
				$('.companyName').val('');
				$('#companyId').val('');
			});
			$('#officeDelButton').on('click', function() {
				$('.officeName').val('');
				$('#officeId').val('');
			});

			function selectHandle(type) {
				//				var self = this;
				//
				//				var tree = $("#jstree").jstree({
				//					'core': {
				//						"multiple": true,
				//						"animation": 0,
				//						"themes": {
				//							"icons": true,
				//							"stripes": false
				//						},
				//						'data': {
				//							//"url": `${resourceUrl}/sys/office/treeData?type=${type}&&extId=&isAll=&module=&t=` + new Date().getTime(),
				//							"url": `${resourceUrl}/orgnzation/sysDept/findList,
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
					$('form').data("bootstrapValidator").validateField('company.name');
				} else {
					$('.officeName').val(names.join(''));
					$('#officeId').val(ids.join(''));
					$('.officeName').focus();
					$('form').data("bootstrapValidator").validateField('office.name');

				}
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
						"deptId": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						"roleId": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						"office.name":{
							trigger:"change",
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
				       },
						name: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						no: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						loginName: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								remote: {
									message: '登陆名称重复',
									url: `${tools.API_URL}/ewindsys/ewindUser/loginNameValidators`,
									data: {
										id:$("input[name='id']").val(),
										loginName: $("input [name='loginName']").val()
									}
								}
							}
						},
						mobile:{
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								remote: {
									message: '登陆名称重复',
									url: `${tools.API_URL}/ewindsys/ewindUser/mobileValidators`,
									data: {
										id:$("input[name='id']").val(),
										mobile: $("input [name='mobile']").val()
									}
								}
							}
						},
						password: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						confirmNewPassword: {
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
