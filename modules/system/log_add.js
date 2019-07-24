/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/log_add", ["jquery", "underscore", "page/tools", "jstree","bootstrap-datepicker","icheck"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			console.log(request.name);

			$('#example').DataTable({
				'paging': true,
				'lengthChange': false,
				'searching': false,
				'ordering': true,
				'info': true,
				'autoWidth': false
			});
            //Date picker
            $('#datepicker1').datepicker({
                autoclose: true,
                format: 'yyyy/mm/dd'
            });

			$(".zdy-btn-save").on("click", function() {
				tools.toPage(request.lastmenu);
			});




		}
	}

	return page;
});