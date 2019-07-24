define("modules/system/ass_manage_question/question_manage",
	["jquery", "underscore", "page/tools", "bootstrap-table-zh-CN", "modules/projectinfo/utils","jstree"],
	function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			$(".panel-heading").click(function () {
				$(this).next(".panel-body").slideToggle(150)
			})



			/*主键
创建时间
排序
问题组说明文字(考核指标)
分值
问卷类型 1总体问卷 2项目问卷
问卷年份
*/
			buildSampleTable($("#group"),{},
				[{
					title: "全选",
					checkbox: true,
					visible: true
					},
					{
						title: '排序',
						field: '',
						sortable: true,
						formatter: function (value, row, index) {
							return index + 1;
						}
					},
					{
						field: "phaseName", title: "考核指标"
					},
					{
						field: "phaseName",sortable: true, title: "分值"
					},
					{
						field: "phaseName",sortable: true, title: "问卷类型"
					},
				],300

			);
			/*主键
创建时间
排序
问题组 关联分组表
考核要点
要点分值
评分标准
评分三级节点（项目问卷才有）
评分标准分值
关联附件、依据（形式待定：建议为html页面链接路径,一个关联写一个页面，弹窗显示）
*/
			buildSampleTable($("#question"),{},
				[{
					title: "全选",
					checkbox: true,
					visible: true
					},
					{
						title: '排序',
						field: '',
						sortable: true,
						formatter: function (value, row, index) {
							return index + 1;
						}
					},
					{
						field: "phaseName", sortable: true,title: "考核指标"
					},
					{
						field: "phaseName",title: "考核要点"
					},
					{
						field: "phaseName",sortable: true, title: "要点分值"
					},
					{
						field: "phaseName", title: "评分标准"
					},
					{
						field: "phaseName", title: "评分三级节点"
					},
					{
						field: "phaseName",sortable: true, title: "评分标准分值"
					},
					{
						field: "phaseName", title: "关联依据"
					},
				]

			);
		}
	}
	return page;
});
