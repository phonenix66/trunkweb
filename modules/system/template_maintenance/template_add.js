define("modules/system/template_maintenance/template_add", ["jquery", "underscore", "page/tools", "bootstrap-fileinput", "bootstrap-fileinput-locale-zh", "bootstrap-datepicker"], function($, _, tools) {
	var page = function() {};
	page = {
		init: function(request) {
			/**
			 * 模块类型下拉框
			 */
			tools.loadSelect({
				url: `${API_URL}/sys/dict/getDictValue`,
				data: {
					"dictTypeId": 49
				},
				selectId: "sftType", // 下拉框id
				textField: "label", // 显示的text
				valueField: "label", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			/**
			 * 模块分类下拉框
			 */
			tools.loadSelect({
				url: `${API_URL}/sys/dict/getDictValue`,
				data: {
					"dictTypeId": 50
				},
				selectId: "sftCategory", // 下拉框id

				textField: "label", // 显示的text
				valueField: "label", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			/**
			 * 表单校验
			 */
			//			$('form').bootstrapValidator({　　　　　　　　
			//				feedbackIcons: {　　　　　　　　
			//					valid: 'glyphicon glyphicon-ok',
			//					invalid: 'glyphicon glyphicon-remove',
			//					validating: 'glyphicon glyphicon-refresh'　　　　　　　　
			//				},
			//				fields: {
			//					emName: {
			//						validators: {
			//							notEmpty: {
			//								message: '工作内容不能为空'
			//							},
			//							stringLength: {
			//								min: 0,
			//								max: 50,
			//								message: '工作内容长度不能超过150位'
			//							}
			//						}
			//					},
			//					emMemo: {
			//						validators: {
			//							stringLength: {
			//								min: 0,
			//								max: 150,
			//								message: '备注长度不能超过150位'
			//							}
			//						}
			//					}
			//				}
			//			});
			var param = request.param;
			debugger

			if(param.id == "" || param.id == null) {
				//如果没传id表示新增模板
				var id = tools.getUUID();
				$("#id").val(id);
				param.id = id;
			} else {
				//如果传了id表示修改模板
				tools.setValueToInput(param.row);
			}

			//上传附件
			tools.initFileInput("input-id", param.id, "template_maintenance");
			//
			//			$('.datepicker').datepicker({
			//				autoclose: true,
			//				format: 'yyyy-mm-dd'
			//			});
		}
	}

	return page;
});