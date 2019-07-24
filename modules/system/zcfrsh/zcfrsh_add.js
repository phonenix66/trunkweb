/*工程质量*/
define("modules/system/zcfrsh/zcfrsh_add",
	["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker", "icheck", "bootstrapvalidator", "layer"], function($, _, tools) {
		var page = function () {};
		page = {
			init: function (request) {

				var param = request.param;
				$('.datepicker').datepicker();
				//上传附件
				if(param.show){
					var datas = param.edit;
					tools.setValueToInput(datas);
					//将所有自断改为不可编辑状态
					$('input').attr("disabled","disabled");
				}


				bsvalid();
				/**
				 * 表单校验
				 */
				function bsvalid() {
					$('form').bootstrapValidator({
						framework: 'bootstrap',
						feedbackIcons: {
							valid: 'glyphicon glyphicon-ok',
							invalid: 'glyphicon glyphicon-remove',
							validating: 'glyphicon glyphicon-refresh'
						},
						fields: {

							dwName: {
								validators: {
									notEmpty: {
										message: '名称不能为空'
									},
									stringLength: {
										min: 0,
										max: 20,
										message: '工作联系人姓名不能超过20位'
									}
								}
							},
							frAddress:{
								validators: {
									stringLength: {
										min: 0,
										max: 100,
										message: '地址不能超过100位'
									}
								}
							},
							frName: {
								validators: {
									notEmpty: {
										message: '工作联系人姓名不能为空'
									},
									stringLength: {
										min: 0,
										max: 20,
										message: '工作联系人姓名不能超过20位'
									}
								}
							},
							dwPhone: {
								validators: {
									notEmpty: {
										message: '单位联系电话不能为空'
									},
									stringLength: {
										min: 0,
										max: 12,
										message: '单位联系电话不能超过12位'
									}
								}
							},
							frPhone:{
								validators: {
									stringLength: {
										min: 0,
										max: 12,
										message: '工作联系人电话不能超过12位'
									}
								}
							},
							frDbPhone:{
								validators: {
									stringLength: {
										min: 0,
										max: 12,
										message: '联系电话不能超过12位'
									}
								}
							},
							jfName:{
								validators: {
									stringLength: {
										min: 0,
										max: 12,
										message: '姓名不能超过12位'
									}
								}
							},
							jfPhone:{
								validators: {
									stringLength: {
										min: 0,
										max: 12,
										message: '联系电话不能超过12位'
									}
								}
							},
							frDbName: {
								validators: {
									notEmpty: {
										message: '姓名不能为空'
									},
									stringLength: {
										min: 0,
										max: 12,
										message: '姓名不能超过12位'
									}
								}
							},
							loginName: {
								validators: {
									notEmpty: {
										message: '用户名不能为空'
									},
									stringLength: {
										min: 0,
										max: 12,
										message: '用户名不能超过12位'
									}
								}
							}
							// password: {
							// 	validators: {
							// 		notEmpty: {
							// 			message: '登陆密码不能为空'
							// 		},
							// 		stringLength: {
							// 			min: 0,
							// 			max: 12,
							// 			message: '登陆密码不能超过12位'
							// 		}
							// 	}
							// }
						}
					});
				}

			}



		}



		return page;
	});
