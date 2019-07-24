/**
 * 
 */
define("template/process_people", ["jquery", "underscore", "page/tools", "bootstrap", "bootstrap-select4","bootstrap-datepicker", "icheck"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var param = request.param;
			var spProject = tools.getSpData();
			
			var  resourceUrl = `${tools.API_URL}/act/task`;
			
			$('input[name=nodeId]').val(param.actRole.nodeId);
			
			/**
			 * 下拉框显示
			 */
			tools.loadSelect({
				selectId: "sel", // 下拉框id
				initText: "请选择", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
				textField: "name", // 显示的text
				valueField: "loginName", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return param.ewindUsers;
				}
			});

			//如果只有一条用户数据，则默认选中
            if(param.ewindUsers!= null && param.ewindUsers.length == 1){
				$('select[name="loginName"]').val(param.ewindUsers[0].loginName);
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
					loginName: {
						validators: {
							notEmpty: {
								message: '下级审批人不能为空'
							}
						}
					}
				}
			});
			
			
		}
	}
	return page;
});