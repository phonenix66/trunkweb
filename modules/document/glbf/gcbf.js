/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/document/glbf/gcbf", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker","bootstrap-table-editable"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			//隐藏选择项目下拉框
			$('#projectNav').hide();
			var loginName = tools.getLoginName();
			var showNum;
			var city = sessionStorage.getItem("selected");
			var cityEntity = JSON.parse(city);


			$('#elyMang').bootstrapTable({
				url: tools.API_URL+"/dw/zlgl/getZlgl",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				// pagination: true, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				pageList: [50, 100],
				sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function (params) { //请求服务器发送的参数
					var searchParam = {dictTypeId:'101'};
					searchParam.sessionid = sessionStorage.getItem("sessionid")
					searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
					searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
					searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
					return searchParam;
				},
				// sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				responseHandler:function(res){
					return res.rows;
				}, columns: [
					{
						checkbox: true
					},
					{
						title: '序号',
						field: '',
						formatter: function (value, row, index) {
							return index+1;
						}
					},
					{
						field: "label",
						title: "文件名称",
						editable: false
					},
					{
						field: "file",
						title: "附件",
						formatter: function (value, row, index){
							var fileList = [];
							var v = "";
							row.sysAffixList;
							$.extend(fileList, row.sysAffixList);
							fileList.forEach(function(_this,index,arr){
								v += `<a href = "${tools.FILE_API_URL}/tools/file/download/${_this.id}">${_this.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;<br/>`;
							})
							return v;
						}
					},
					{
						field: "9",
						title: "操作",
						formatter: function (value, row, index){
							var v = "";
							row = JSON.stringify(row);
							v += `<div class='btn-group'><button type='button' class='btn btn-info startWorking-edit' data='${row}'>修改</button>`
							return v
						}
					}
				]
			});

			//条件查询
			$("#query").on("click",function(){
				var label = $("#label").val();
				var query = {"label":label};
				$('#elyMang').bootstrapTable('refresh',{query: query});
			});

			//修改方法
			$("#elyMangDiv").on("click",".startWorking-edit",function(){
				var row = $(this).attr("data");
				row = eval("("+row+")");

				tools.toDialog({
					name: "修改管理办法资料",
					url: "modules/document/glbf/glbf_add.html",
					btn: ['关闭'],
					param : row,
					success: function(obj, index) {

					},
					yes: function(obj, index, data) {
						layer.close(index);
						var label = $("#label").val();
						var query = {"label":label};
						$('#elyMang').bootstrapTable('refresh',{query: query});
					}
				});
			});

		}
	};

	return page;
});
