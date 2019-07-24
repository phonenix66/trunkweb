/**
 * 缓存详情
 */
define("modules/document/daml/affix_add", ["jquery", "underscore", "page/tools","bootstrap-datepicker"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var uuId = request.param.id;
			var projectId = request.param.projectId;
			// initFileInput("input-id", uuId, 1);

         //上传附件
			var settings = {
				"fileTypeArr":[]
			}

			tools.initFileInput("input-id",uuId,"DM","F_DAML",projectId,settings);

		}
	}

	return page;
});
