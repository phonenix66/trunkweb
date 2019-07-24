/**
 * 站点管理=》站点维护
 */
define("modules/security/aqglrygl/aqgl_aqglrrgl_audit", ["jquery", "underscore", "page/tools","bootstrap","Handsontable","bootstrap-table", "bootstrap-table-x-editable","bootstrap-select4","bootstrap-datepicker",'serializeJSON', 'jstree', 'layer',"bootstrap-fileinput","bootstrap-fileinput-locale-zh"], function ($, _, tools, Handsontable) {

	var page = function() {};
	var roleResourceUrl = `${tools.API_URL}/aqgl/saveManage`;
	page = {
		init: function(request) {

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

		    var param = request.param;

		    if(request.param) {
					//			var data = self.findHtgl(request.param.id);
					mainData = param.edit;

					tools.processTemplate({
						processKey: "aqglrrgl",
						businessId: mainData.id,
						procInstId: mainData.procInsId
					});
				}

			if(param.add) { //新增
				var id = tools.getUUID();
				tools.initFileInput("uploadDoc1",id, 1);
			} else { //修改
				var data = findSpecialFacility(param.edit.id);
				if(data.sysAffix!=null){
                	//如果有数据，将数据显示在页面上
                	$('.upload-file').empty();
                	for(var i= 0;i<data.sysAffix.length;i++){
                		var fileStr =`<a href="`+tools.FILE_API_URL+`/tools/affix/download/`+data.sysAffix[i].id +`" data-id="`+data.sysAffix[i].id +`">`+data.sysAffix[i].saName+`</a>`;
                	    $('.file').append(fileStr);
                	}

                }
				tools.initFileInput("uploadDoc1",param.edit.id, 1);
				tools.setValueToInput(data);
				$('#username').val(param.edit.smName);
			}

			var self = this;
			//bsvalid();
			$('.companyName,.search-c').on('click', function() {
				var type = 1;
				selectHandle(type);
			})
			$('.officeName,.search-o').on('click', function() {
				var type = 2;
				selectHandle(type);
			});
//
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
				//				console.log(`${resourceUrl}/findList`);
				tools.loadTree({
					//					url: `${resourceUrl}/findList`, //请求链接地址
					url: `${tools.API_URL}/orgnzation/sysDept/findList`, //请求链接地址
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
						$('#officeId').val(id);
						$('#officeName').val(sdName);
					}
				})
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

			$('form').bootstrapValidator({
					framework: 'bootstrap',
					icon: {
						valid: 'glyphicon glyphicon-ok',
						invalid: 'glyphicon glyphicon-remove',
						validating: 'glyphicon glyphicon-refresh'
					},
					fields: {
						smName: {
							validators: {
//								notEmpty: {
//									message: '这是必填字段'
//
//								},
								stringLength: {
									min: 0,
									max: 5,
									message: '长度不能超过5位'

								}
							}
						},
						smSex: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
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
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 13,
									message: '长度不能超过13位'
								}
							}
						},
						smCompany: {
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
						smDepartment: {
							validators: {
//								notEmpty: {
//									message: '这是必填字段'
//								},
								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
							}
						},
						smWork: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
							}
						},
						smQualification: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
						}
						},
						smOffice: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
							}
						},
						smFirstDate: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						smDate: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						smBookNumber: {
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
						smEndDate: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						smCase: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 10,
									message: '长度不能超过10位'
								}
							}
						},
						smRemark: {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								},
								stringLength: {
									min: 0,
									max: 50,
									message: '长度不能超过50位'
								}
							}
						}
					}
				})
		}
	}
	return page;
});
