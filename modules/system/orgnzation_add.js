/**
 * 站点管理=》站点维护=》站点维护
 */

define("modules/system/orgnzation_add", ["jquery", "underscore", "page/tools", "jstree"], function($, _, tools) {
	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/orgnzation/sysDept`; //页面url地址
			var roleResourceUrl = `${tools.API_URL}/ewindsys/ewindRole/data`;
			var param = request.param;

			/**
			 * 表单校验
			 */
			$('form').bootstrapValidator({　　　　　　　　
				feedbackIcons: {　　　　　　　　
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'　　　　　　　　
				},
				fields: {
					sdName: {
						validators: {
							notEmpty: {
								message: '机构名称不能为空'
							},
							stringLength: {
								max: 50,
								message:'输入字数超限制'
							}
						}
					},

					sdContacts: {
						validators: {
							// notEmpty: {
							// 	message: '联系人不能为空'
							// },
							stringLength: {
								max: 20,
								message:'输入字数超限制'
							}
						}
					},
					sdPhone: {
						validators: {
							// notEmpty: {
							// 	message: '联系电话不能为空'
							// },
							stringLength: {
								max: 12,
								message:'输入字数超限制'
							}
						}
					},

					sdAddress: {
						validators: {
							stringLength: {
								max: 20,
								message:'输入字数超限制'
							}
						}
					},

					frName: {
						validators: {
							stringLength: {
								max: 50,
								message:'输入字数超限制'
							}
						}
					},

					frPhone: {
						validators: {
							stringLength: {
								max: 12,
								message:'输入字数超限制'
							}
						}
					},

					// jlType:{
					// 	validators: {
					// 		notEmpty: {
					// 			message: '机构名称不能为空'
					// 		}
					// 	}
					// },

					sdSort: {
						validators: {
							notEmpty: {
								message: '排序号不能为空'
							},
							digits: {
								message: '排序号只能是数字'
							}
						}
					}

					// roleId: {
					// 	validators: {
					// 		notEmpty: {
					// 			message: '角色不能为空'
					// 		}
					// 	}
					// },
				}
			});
			findRole();

			function findRole() {
				$.ajax({
					type: "get",
					url: `${roleResourceUrl}`,
					async: true,
				}).then(function(data) {

					for(var i = 0; i < data.rows.length; i++) {
						var html = '<option value="' + data.rows[i].id + '">' + data.rows[i].name + '</option>';
						$('select[name="roleId"]').append(html);
					}
//					$('select[name="roleId"]').val(param.edit.roleName);

				}, function() {
					console.log("请求错误");
				});
			}

			if(param.add != undefined) { //新增
				$("input[type='radio'][name='jlType'][value='"+param.add.jlType+"']").attr("checked",true);
/*				var name = tools.getTreeName(param.add.sdPathname, 1);
				$("input[name=sdFname]").val(name)*/
			} else { //修改

				var id = param.edit.id;
				$.ajax({
					type: "get",
					url: `${resourceUrl}/find/${id}`,
					async: true
				}).then(function(data) {
/*					data.sdFname = tools.getTreeName(data.sdPathname, 2);
					$("input[name=sdFname]").val(data.sdFname)*/
					tools.setValueToInput(data);
					$("input[type='radio'][name='jlType'][value='"+data.jlType+"']").attr("checked",true);
					// jlType
				}, function() {
					console.log("请求错误");
				});
			}

		}
	}

	return page;
});
