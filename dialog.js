//加载配置信息
require(["web.config"], function () {
	require(["jquery"], function ($) {
		//初始化页面
		require(["underscore", "page/tools", "admin-lte", "bootstrapvalidator", "bootstrap-fileinput", "bootstrap-fileinput-locale-zh","bootstrap-select"], function (_, tools) {

			$(function () {
				//console.log(window.menu);
				var moduleName = function (url) {
					return url.substring(0, url.lastIndexOf("."));
				};
				var initModule = function (moduleName, menu) {
					require([moduleName], function (mpage) {
						if (mpage && mpage.init) {
							mpage.init(menu);
							menu.page = mpage;
						}
					});
				};
				var mname = moduleName(menu.url);
				$.get(menu.url, function (data) {
					var html = [];
					html.push(data);
					html.push('<script src="' + mname + '.js" type="text/javascript" charset="utf-8"></script>');
					$("#xtdialogwindow").html(html.join(""));
					initModule(mname, menu);
				});

			});
		});
	});
});