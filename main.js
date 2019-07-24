//加载配置信息
require(["web.config"], function () {
	require(["jquery"], function ($) {
		//初始化页面
		require(["admin-lte", "page/tools"], function (a, b) {
			// b.toPage({href:"modules/evaluation/overall2.html"})
			require(['components/header/view', "api", "apiConfig"], function (NavView) {
				var navView = new NavView();
			});

			/* tools.initMenu({
				url: `${resourceUrl}/findMenuList`, //请求链接地址
			}); */
			$.widget.bridge('uibutton', $.ui.button);
			$('body').layout('fix');
			var $layout = $('body').data('lte.layout');
			$('body').addClass("fixed");
			$layout.fixSidebar();
			if ($('body').hasClass('fixed')) {
				$layout.activate();
			}
		});
	});
});