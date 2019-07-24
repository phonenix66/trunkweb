define("modules/system/log", ["jquery", "underscore", "page/tools","bootstrap-daterangepicker","bootstrap-datepicker","moment","timepicker"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			$('#example').DataTable({
				'paging': true,
				'lengthChange': false,
				'searching': false,
				'ordering': true,
				'info': true,
				'autoWidth': false
			});
			$(".zdy-btn-edit").on("click", function() {
				var id = $(this).attr("id");
				tools.toPage({
					name: "查看信息",
					href: "modules/system/log_add.html",
					param: {
						zdid: id
					},
					lastmenu: request
				});
			});
            //Date picker
            //Date range picker with time picker
            $('#reservationtime').daterangepicker({
				timePicker: true,
				timePickerIncrement: 30,
                locale: {
                    "format": "YYYY-MM-DD",
                    "separator": " ~ ",
                    "applyLabel": "确认",
                    "cancelLabel": "取消",
                    "fromLabel": "From",
                    "toLabel": "To",
                    "customRangeLabel": "Custom",
                    "weekLabel": "周",
                    "daysOfWeek": [
                        "日",
                        "一",
                        "二",
                        "三",
                        "四",
                        "五",
                        "六"
                    ],
                    "monthNames": [
                        "一月",
                        "二月",
                        "三月",
                        "四月",
                        "五月",
                        "六月",
                        "七月",
                        "八月",
                        "九月",
                        "十月",
                        "十一月",
                        "十二月"
                    ],
                    "firstDay": 1
                }
            }, function(start, end, label) {
                console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
            });

			$(".zdy-btn-qt").on("click", function() {
				var id = $(this).attr("id");
				var zt = $(this).attr("zt");
				if(zt == 0) {
					alert(id + "停止成功!");
				} else {
					alert(id + "启用成功!");
				}
			});

		}
	}

	return page;
});