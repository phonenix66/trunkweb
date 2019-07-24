/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/datadictionary_add", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker", "icheck","layer"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/datadictionary/sysDict`; //页面url地址
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
					sdType: {
						validators: {
							notEmpty: {
								message: '项目分类不能为空'
							}
						}
					},
					sdLabel: {
						validators: {
							notEmpty: {
								message: '项目名称不能为空'
							}
						}
					},
					sdValue: {
						validators: {
							notEmpty: {
								message: '项目值不能为空'
							},
							stringLength: {
								min: 0,
								max: 10,
								message: '项目值长度不能超过10位'
							}
						}
					},
					ihdCommunication: {
						validators: {
							stringLength: {
								min: 0,
								max: 40,
								message: '通信方式长度不能超过40位'
							}
						}
					},
					ihdBank: {
						validators: {
							stringLength: {
								min: 0,
								max: 25,
								message: '开户银行长度不能超过25位'
							}
						}
					},
					ihdBankNumber: {
						validators: {
							stringLength: {
								min: 0,
								max: 40,
								message: '银行账号长度不能超过40位'
							}
						}
					},
					ihdTaxNumber: {
						validators: {
							stringLength: {
								min: 0,
								max: 20,
								message: '税号长度不能超过20位'
							}
						}
					},
					runDepartment: {
						validators: {
							stringLength: {
								min: 0,
								max: 20,
								message: '经办部门长度不能超过20位'
							}
						}
					},
					runPeople: {
						validators: {
							stringLength: {
								min: 0,
								max: 20,
								message: '经办人长度不能超过20位'
							}
						}
					},
					ihdPhons: {
						validators: {
							stringLength: {
								min: 0,
								max: 20,
								message: '联系电话长度不能超过20位'
							}
						}
					},
					ihdFax: {
						validators: {
							stringLength: {
								min: 0,
								max: 20,
								message: '传真长度不能超过20位'
							}
						}
					}
				}
			});
			
			
			if(param.add) { //新增
			} else { //修改
				var id = param.edit.id;
				$.ajax({
					type: "get",
					url: `${resourceUrl}/find/${id}`,
					async: true,
				}).then(function(data) {
					tools.setValueToInput(data);
				}, function() {
					console.log("请求错误");
				});
			}

		}
	}

	return page;
});