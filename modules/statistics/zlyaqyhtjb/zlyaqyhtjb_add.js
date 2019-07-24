define("modules/statistics/zlyaqyhtjb/zlyaqyhtjb_add", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker"], function($, _, tools) {
	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/sa/saHiddenDanger`;
			var param = request.param;//传参信息
			var uuid = '';

			$('.datepicker').datepicker({
				autoclose: true,
				dateFormat: 'yy-mm-dd'
			});

			if(param.add){//新增
				$('input[name="pjId"]').val(param.projectId);
				$('input[name="pjName"]').val(param.projectName);
				// projectName:projectName

			}else { //修改
				uuid = param.id;
				var data = param.data;
				tools.setValueToInput(data);

			}

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
					hdCode: {
						validators: {
							notEmpty: {
								message: '不能为空'
							},
							stringLength: {
									max: 20,
									message:'输入字数超限制'
							},
							remote: {
								message: '隐患编号重复',
								url: `${resourceUrl}/validators`,
								data: {
									id:$("input[name='id']").val(),
									hdCode: $("input [name='hdCode']").val()
								}
							}
						}
					},
					hdPersionLiable:{
						validators: {
							stringLength: {
								max: 15,
								message:'输入字数超限制'
							}
						}
					},
					salesCompany:{
						validators: {
							stringLength: {
								max: 15,
								message:'输入字数超限制'
							}
						}
					},
					pjName: {
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					inspectionDate: {
						trigger:'change',
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					reviewDate:{
						trigger:'change',
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					hdContent:{
						validators: {
							stringLength: {
								max: 400,
								message:'输入字数超限制'
							}
						}
					},
					hdType: {
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					zgRequirment:{
						validators: {
							stringLength: {
								max: 400,
								message:'输入字数超限制'
							}
						}
					},
					zgSituation:{
						validators: {
							stringLength: {
								max: 400,
								message:'输入字数超限制'
							}
						}
					},
					salesDate:{
						trigger:'change',
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					inputBy:{
						validators: {
							stringLength: {
								max: 15,
								message:'输入字数超限制'
							}
						}
					},
					remarks:{
						validators: {
							stringLength: {
								max: 15,
								message:'输入字数超限制'
							}
						}
					}
				}
			});

		}
	}

	return page;
});
