/**
 * 站点管理=》站点维护
 */
define("modules/security/aqglrygl/aqgl_aqglrrgl_add", ["jquery", "underscore", "page/tools","bootstrap","Handsontable","bootstrap-table", "bootstrap-table-x-editable","bootstrap-select4","bootstrap-datepicker",'serializeJSON', 'jstree', 'layer',"bootstrap-fileinput","bootstrap-fileinput-locale-zh"], function ($, _, tools, Handsontable) {

	var page = function() {};
	var roleResourceUrl = `${tools.API_URL}/aqgl/saveManage`;
	page = {
		init: function(request) {
		    $('body').on("click", '.deleteFile', function () { //删除附件
		    	var th = $(this);
				var fId = $(this).attr("data-id");
				layer.confirm("确定要删除此附件？", {
					    title: '删除'
				     }, function (index) {
                         	$.ajax({
					            url: tools.FILE_API_URL + '/tools/affix/delete/'+fId,
					            type: 'post',
					            async: false,
					            dataType: "json",

					            success: function (data) {
						            //刷新数据  $("#test1").parent();
			                        th.parent().remove();
								    layer.close(index);
					            },
					            error: function (returndata) {
					                layer.msg('操作失败');
					            }
					       });

				      })

			});
			$('input[name="smFirstDate"]').datepicker({
                format: 'yyyy-mm-dd',
				language: 'zh-CN'
            });
            $('input[name="smDate"]').datepicker({
                format: 'yyyy-mm-dd',
				language: 'zh-CN'
            });
            $('input[name="smEndDate"]').datepicker({
               format: 'yyyy-mm-dd',
				language: 'zh-CN'
            });
            findTree();
		    var param = request.param;

			if(param.add) { //新增
				var id = tools.getUUID();
				$('#id').val(id);
				tools.initFileInput("uploadDoc1",id, 1);
			} else { //修改

				var data = findSpecialFacility(param.edit.id);
				if(!data) return;
                var files = data.sysAffix;

                if(files != null){
				   if (!files.length) return;

					files.forEach(function (item) {

						$('.file').append(`<li><a href="${FILE_API_URL}/tools/affix/download/${item.id}" data-id="${item.id}">${item.saName}</a><span class="fa fa-times-circle-o deleteFile" data-id="${item.id}"></span></li>`)
					});

				}
				tools.initFileInput("uploadDoc1",param.edit.id, 1);
				tools.setValueToInput(param.edit);

				$('#username').val(param.edit.smName);
				if(param.edit.show){
                	$('input').attr('disabled','disabled');
                	$('textarea').attr('disabled','disabled');
                	$('select').attr('disabled','disabled');
//              	console.log(param.edit.id);
//			        var data = {processKey:"qygllist",businessId:param.edit.id};
//					tools.processTemplate(data);
                }
			}

			var self = this;
			//bsvalid();
			$('.companyName,.search-c').on('click', function() {
				selectHandle();
			})
			$('.userName,.search-o').on('click', function() {
				selectHandle();
			});

				function findDuty() {
				$.ajax({
					type: "get",
					url: `${roleResourceUrl}/form`,
					data: param,
					async: true,
				}).then(function(data) {

					for(var i = 0; i < data.rows.length; i++) {
						var html = '<option value="' + data.rows[i].id + ',' + data.rows[i].label + '">' + data.rows[i].label + '</option>';
						$('select[name="dutyId"]').append(html);
					}
					$('select[name="dutyId"]').val(param.edit.dutyId + ',' + param.edit.dutyName);

				}, function() {
					console.log("请求错误");
				});
			}

				//初始化树形结构
			function findTree() {
				tools.loadTree({

					url: `${tools.API_URL}/aqgl/saveManage/findUserTree`, //请求链接地址
					treeId: "js_tree", //id选择器名称
					id: "id", //数据的id名称
					parentId: "sdFid", //数据的父级id名称
					name: "sdName", //数据在树的显示字段
					shortName: "sdSort", //数据在树的排序字段
					showAll: true, //是否展开所有的树节点
					responseHandler: function(response) { //数据接收到之前回调
						return response.rows;
					},
					click: function(obj, e) { //树点击事件
						// 获取当前节点
						var currentNode = e.node;
						dsObj = currentNode.original.menu;
						var id = currentNode.id;
						var sdName = currentNode.text;
						$('#userId').val(id);
						$('#username').val(sdName).change();


						var userId = $('#userId').val();
						var reqUrl = tools.API_URL + "/aqgl/saveManage/findName?userId="+userId;
						  $.ajax({
					        url: reqUrl,
					        async: false,
					        success: function (data) {

					        	var html = 'data';
					        	$('#smWork').val(data.smWork);
					        	$('#smDepartment').val(data.smDepartment).change();
					        	$('#smTel').val(data.smTel);
					        }
					});

					}
				});
			}

			function assginVal(type, tree) {
				var ids = [],
					names = [],
					nodes = [];
				nodes = tree.get_selected(true);
				for(var i = 0; i < nodes.length; i++) {
					ids.push(nodes[i].id);
					names.push(nodes[i].text);
					break;
				}
				if(type === 1) {
					$('.companyName').val(names.join(''));
					$('#companyId').val(ids.join(''));
					$('.companyName').focus();
					//$('form').data("bootstrapValidator").validateField('company.name');
				} else {
					$('.officeName').val(names.join(''));
					$('#officeId').val(ids.join(''));
					$('.officeName').focus();
					//$('form').data("bootstrapValidator").validateField('office.name');

				}
			}

			function selectHandle() {
				layer.open({
					type: 1,
					title: "选择用户",
					area: ["300px", "420px"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					btn1: function(index, layero) {
						layer.close(index);
					},
					btn2: function(index, layero) {
						layer.close(index);
					}
				});
			}

			function findSpecialFacility(id){
//	        	debugger
				//修改，查看查询数据
					var da = null;
					$.ajax({
			            url: tools.API_URL+'/aqgl/saveManage/find/'+id,
			            type: 'post',
			            async: false,
			            dataType: "json",
		                contentType: "application/json",
			            success: function (data) {
			                	da = data;
			            },
			            error: function (returndata) {
			                layer.msg('操作失败');
			            }
			      });
			       return da;

			}

//			$('#username').change(function(){
//				debugger
//				var smName = $('#smName').val();
//				var reqUrl = tools.API_URL + "/aqgl/saveManage/findName?smName="+smName;
//				  $.ajax({
//			        url: reqUrl,
//			        async: false,
//			        success: function (data) {
//			        	var html = 'data';
//			        	$('#smWork').val(data.dutyName);
//			        	$('#smDepartment').val(data.dutyId);
//			        }
//			})
//		});

			$('form').bootstrapValidator({
					framework: 'bootstrap',
					icon: {
						valid: 'glyphicon glyphicon-ok',
						invalid: 'glyphicon glyphicon-remove',
						validating: 'glyphicon glyphicon-refresh'
					},
					fields: {
						username: {
							trigger:"change",
							validators: {
								notEmpty: {
									message: '这是必填字段'

								},
								stringLength: {
									min: 0,
									max: 5,
									message: '长度不能超过5位'

								}
							}
						},
						smSex: {
							validators: {
								stringLength: {
									min: 0,
									max: 1,
									message: '长度不能超过1位'
								}
							}
						},

						smEducation: {
								validators: {
									notEmpty: {
										message: '这是必填字段'
									}
								}
							},
						smIdCard: {
							validators: {

								stringLength: {
									min: 0,
									max: 18,
									message: '长度不能超过18位'
								}
							}
						},
						smCompany: {
							validators: {
								stringLength: {
									min: 0,
									max: 20,
									message: '长度不能超过20位'
								}
							}
						},
						smDepartment: {
							trigger:'change',
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 20,
									message: '长度不能超过20位'
								}
							}
						},
						smWork: {
							validators: {

								stringLength: {
									min: 0,
									max: 20,
									message: '长度不能超过20位'
								}
							}
						},
						smQualification: {
							validators: {

								stringLength: {
									min: 0,
									max: 20,
									message: '长度不能超过20位'
								}
						}
						},
						smOffice: {
							validators: {

								stringLength: {
									min: 0,
									max: 20,
									message: '长度不能超过20位'
								}
							}
						},
						smFirstDate: {
							trigger:'change',
							validators: {
							}
						},

						smDate: {
							trigger:'change',
							validators: {

							}
						},

						smBookNumber: {
							validators: {

								stringLength: {
									min: 0,
									max: 25,
									message: '长度不能超过25位'
								}
							}
						},
						smEndDate: {
							trigger:'change',
							validators: {

							}
						},
						smCase: {
							validators: {

								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
							}
						},
						smRemark: {
							validators: {

								stringLength: {
									min: 0,
									max: 100,
									message: '长度不能超过100位'
								}
							}
						},
						smTel: {
							validators: {

								stringLength: {
									min: 0,
									max: 100,
									message: '长度不能超过100位'
								}
							}
						}
					}
				})
		}
	}
	return page;
});
