/**
/**
 * 站点管理=》站点维护
 */
define("modules/security/aqglrygl/aqgl_aqglrrgl", ["jquery", "underscore", "page/tools",
	"bootstrap-datepicker", "serializeJSON", "bootstrap-treeview", "jstree"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/aqgl/saveManage`; //页面url地址
			var loginName = tools.getLoginName();

		    /**
			 * 查询
			 */
			$("#btn_search").on("click", function () {

				var smName = $('#smName').val();
				var smEducation =$('#smEducation').val();
				var smDepartment =$('#smDepartment').val();
				var status =$('#status').val();

				$("#table").bootstrapTable('refresh',{
					query:{
						smName:smName,
						smEducation:smEducation,
						smDepartment:smDepartment,
						status:status
				  }
				});
			});

			   $("#reset").on("click", function () {

				$("#table").bootstrapTable('refresh');
			});

				/*
			 * 导出
			 */
			$("#btn_output").on("click", function() {
				var data =  [
				    {'qyStatus':'in(2,3)'},
				    {'loginName':loginName},
				    {'smName':$('input[name="smName"]').val()},
				    {'smEducation':$('input[name="smEducation"]').val()},
				    {'smDepartment':$('input[name="smDepartment"]').val()},
				    {'status':$('input[name="status"]').val()}
				 ];  //模拟后台需要接收的参数
				 var url =`${resourceUrl}/export`;
				 tools.outputExcel(data,url);
			});


			function getTypeName(num){
				switch(num){
					case "0" : return "博士"
					case "1" : return "硕士"
					case "2" : return "本科"
					case "3" : return "大专"
					case "4" : return "高中"
					case "5" : return "初中"
					case "6" : return "小学"

				}
			}

				function getTypeStates(num,row){
				if(num == '1'){
					 return "草稿"
				}else if(num == '2'){
					if(row.taskDefKey != null && row.taskDefKey !=''){
						return "审核中"
					}else{
						return "审核通过"
					}
				}else{
					return "退回"
				}
			}


			/**
			 * table显示
			 */
			$('#table').bootstrapTable({
				// url: `${resourceUrl}/data`,
				url: "modules/security/aqglrygl/aqglzz.json",
				method: "get",
				toolbar: '', //工具按钮用哪个容器
				striped: true, //是否显示行间隔色
				pageSize: 10,
				pageNumber: 1,
				cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
				pagination: true, //是否显示分页（*）
				sortable: false, //是否启用排序
				sortOrder: "asc", //排序方式
				uniqueId: "id",
				sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
				queryParams: function () { //请求服务器发送的参数
					var data = {};
					return data;
				},
				responseHandler: function(res) {
					var data = res.rows;
					return data;
				},
				columns: [{
					    title: '序号',
					    field: '',
					    formatter: function (value, row, index) {
					        return index+1;
					    }
					},
					{
						field: "smName",
						title: "姓名"
					},
					{
						field: "smEducation",
						title: "文化程度",
						formatter: function(value, row, index) {
							return getTypeName(value);
						}
					},
					{
						field: "smCompany",
						title: "所在单位"
					},
					{
						field: "smDepartment",
						title: "所在部门/厂队"
					},
					{
						field: "smWork",
						title: "职务/岗位"
						},
					{
						field: "smQualification",
						title: "资格类型"
						},
					{
						field: "smOffice",
						title: "发证机关"
						},
					{
						field: "smDate",
						title: "有效期"
						},
					{
						field: "status",
						title: "状态",
						formatter: function(value, row, index) {
							return getTypeStates(value,row);
						}
						},
					{
						field:"status",
						title:"操作",
						width:200,
		    		formatter: function (value, row, index) {
		    			row.processObj={
						id: row.id,
						procDefKey: "aqglrrgl",
						procInsId:row.procInsId,
						table:"scy_safe_manage",
						startActCallback: `function(data){
							$("#table").bootstrapTable("refresh");
						}`
					}
		    			var rows = JSON.stringify(row);
							var v = '';
							 if(value =="1"){
							 	var loginName = tools.getLoginName();//获得用户登陆名

							 	if(loginName == row.createBy.id){
							 		v = `<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-edit' data='${rows}'>编辑 </button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info btn-startAct' data='${rows}'>提交</button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${rows}'>删除</button>
						        	</div>`
							 	}else{
							 		 v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
								        &nbsp;&nbsp;</div>`
							 	}

							}else if(value == "2"){
								var loginName = tools.getLoginName();//获得用户登陆名
								//1，审核中
								if(row.taskDefKey != null && row.taskDefKey !=''){
									if(row.processName == loginName){
										//审核参数
										v = ` 
										<div class='btn-group'>
							        	<button type='button' class='btn btn-info btn-complete' data='${rows}'>审核</button>
							        	&nbsp;&nbsp;</div>`
									}else{
										 v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
								        &nbsp;&nbsp;</div>`
									}
								}else{
									v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
								        &nbsp;&nbsp;</div>`
								}
								//2，审核成功
							}else if(value == "3"){
								var loginName = tools.getLoginName();//获得用户登陆名
								if(row.createBy.id != loginName){
									v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
								        &nbsp;&nbsp;</div>`
								}else{
									v = `<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-edit' data='${rows}'>编辑 </button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info btn-startAct' data='${rows}'>提交</button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${rows}'>删除</button>
						        	</div>`

								}
							}else if(value == "4"){
								v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
								        &nbsp;&nbsp;</div>`
							}


							return v;
						}
					}
				]
			});


			/**
			 * 修改特种作业人员
			 */
			$('.row-body').on('click', '.zdy-btn-edit', function () {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				tools.toDialog({
					name: "修改安全管理人员",
					url: "modules/security/aqglrygl/aqgl_aqglrrgl_add.html",
					param: {
						edit: data
					},
					btn: ['保存', '关闭'],
					  yes: function(obj, index, data) {

						editData(data);
						$('#table').bootstrapTable('refresh');
						layer.close(index);
						//add(data);
					}
				});
			});

			/**
			 * 查看材料进场信息
			 */
			$('.row-body').on('click', '.zdy-btn-show', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				data.show = true;
				tools.toDialog({
					name: "查看特种作业人员信息",
					url: "modules/security/aqglrygl/aqgl_aqglrrgl_audit.html",
					param: {
						edit: data
					},
					btn: ['关闭'],
					yes: function(obj, index, data) {
						layer.closeAll();
					}
				});
			})

						/**
			 * 审核材料进场信息
			 */
			$('.row-body').on('click', '.btn-complete', function() {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				var procInsId = data.procInsId;
				data.show = true;
				tools.toDialog({
					type:2,
					name: "审核取样管理信息",
					url: "modules/security/aqglrygl/aqgl_aqglrrgl_audit.html",
					param: {
						edit: data
					},
					btn: ['提交','驳回','关闭'],
					success: function(obj, index) {

					},
					yes: function(obj, index, data, page) {


					var userObtain = {
							lcdyKey: "aqglrrgl",
							spCode:  spProject.spCode,
							procInsId: procInsId,
							condition: null
						};
						tools.toDialogProcessUser(userObtain, function(_obj, _index, _data){
								var thisData = {
									"procInsId": procInsId,
									"flag": 1,
									"comment": data.comment
								}
								if(_data){ //是否还有下级审批
									thisData.assignee = _data.loginName
								}
								$.ajax({
									type: "post",
									url: API_URL + "/act/task/complete",
									data: thisData,
									dataType: "json",
									success: function(data){
							        	//刷新数据
							        	$('#table').bootstrapTable('refresh');
							        	layer.closeAll();
							        }
								});
						});


					},
				    btn2:function(index, obj) {
				    		var _obj = $(obj).find('iframe').contents().find('body');
						var datas = $(_obj).find('form').serializeObject(); // 返回参数''
						var data = {
							"procInsId": procInsId,
							"flag": 0,
							"comment": datas.comment,
							"businessId": id,
							"table": "scy_safe_manage"
						}
						$.ajax({
							type: "post",
							url: API_URL + "/act/task/complete",
							data: data,
							dataType: "json",
							success: function(data){
					        	//刷新数据
					        	$('#table').bootstrapTable('refresh');
					        }
						});
					}

				});
			})

			/**
			 * 删除用户信息
			 */
			$('.row-body').on('click', '.zdy-btn-delete', function () {
				var data = eval('(' + $(this).attr("data") + ')');
				var id = data.id;
				var data = {"ids":id};
				//删除数据
			    layer.confirm(
			    	"您确认要删除吗？",
			    	{title:'提示'},
			    	function(index, layero){
		 		  		$.ajax({
					        url: `${tools.API_URL}/aqgl/saveManage/deleteAll`,
					        type: 'get',
					        data: data,
					        contentType: "application/json;charset=UTF-8",
					        success: function(data){
					        	if(data.success == true){
					        		layer.msg("删除成功");
					        	}else{
					        		layer.msg("删除失败");
					        	}
					        	//刷新数据
					        	$('#table').bootstrapTable('refresh');
					        }
					    });
				  	});
			});

			var self = this;
			$(".user-btn-add").on("click", function () {
				addNewUser();
			});
			$('.companyName,.search-c').on('click', function () {
				var type = 1;
				selectHandle(type);
			})
			$('.officeName,.search-o').on('click', function () {
				var type = 2;
				selectHandle(type);
			});

			function saveData(data) {
				$.ajax({
					url: `${resourceUrl}/save`,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function (res) {
						console.log(res);
						if(res.success){
							layer.msg(res.msg);
						}
					},
					error: function (err) {

					}
				})
		    }

			function editData(data) {
				$.ajax({
					url: `${resourceUrl}/edit`,
					data: data,
					type: 'post',
					dataType: 'json',
					success: function (res) {
						console.log(res);
						if(res.success){
							layer.msg(res.msg);
						}
					},
					error: function (err) {

					}
				})
		    }

				function saveCheck(data) {
				$.ajax({
					url: `${resourceUrl}/check`,
					type: 'post',
					asasync: false,
					data: data,
					dataType: 'json',
					contentType: "application/json",
					success: function (res) {
						if(res.success){
							layer.msg(res.msg);
							layer.closeAll();
//						$('#table').bootstrapTable('refresh');
						}
					},
					error: function (err) {

					}
				})
		    }

				function addNewUser() {
				tools.toDialog({
					name: "添加安全管理人员",
					url: "modules/security/aqglrygl/aqgl_aqglrrgl_add.html",
					param: {
						add: true
					},
					skin: "layerui-layer",
					shade: 0.3,
					btn: ['保存', '关闭'],
					yes: function (obj, index, data) {
						saveData(data);
						$('#table').bootstrapTable('refresh');
						layer.close(index);

					}
//					success: function(data){
//					        	if(data.success == true){
//					        		layer.msg("删除成功");
//					        	}else{
//					        		layer.msg("删除失败");
//					        	}
				});
		   }


		}
	}
	return page;
});
