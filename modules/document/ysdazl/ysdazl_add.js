define("modules/document/ysdazl/ysdazl_add", ["jquery", "underscore", "page/tools","bootstrap","bootstrap-select4","bootstrap-datepicker", "bootstrap-fileinput", "bootstrap-fileinput-locale-zh"], function($, _, tools) {
	var page = function() {};
	page = {
		init: function(request) {
			var param = request.param;
			tools.setValueToInput(param);

			//上传附件
			var settings = {
				"fileTypeArr":[]
			}

			tools.initFileInput("input-id",param.id,"DM","F_YSDA_DOC",param.projectId,settings);

			$('.datepicker').datepicker({
				autoclose: true,
				format: 'yyyy-mm-dd'
			});

		}
	}

	return page;
});
