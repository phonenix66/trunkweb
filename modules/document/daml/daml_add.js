/**
 * 缓存详情
 */
define("modules/document/daml/daml_add", ["jquery", "underscore", "page/tools","bootstrap-datepicker"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {

			if(request.param.add){
                $('#fId').val("0");
                $('#fName').val(request.param.add.projectName);
			}else{
				var row = request.param;
				tools.setValueToInput(row);
				//将创建单位改为不可编辑状态
				$('select[name="fName"]').attr("disabled",true);
			}


			$('form').bootstrapValidator({
				framework: 'bootstrap',
				icon: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					wzName: {
						validators: {
							notEmpty: {
								message: '这是必填字段'
							},
							stringLength: {
								min: 0,
								max: 200,
								message: '长度不能超过200位'

							}
						}
					}
				}
			})


		}
	}

	return page;
});
