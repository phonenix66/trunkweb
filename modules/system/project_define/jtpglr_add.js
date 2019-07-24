/**
 * 站点管理=》站点维护=》站点维护
 */

define("modules/system/project_define/jtpglr_add", ["jquery", "underscore", "page/tools", "jstree"], function($, _, tools) {
	var page = function() {};
	page = {
		
		init: function(request) {
		
			var resourceUrl = `${tools.API_URL}/jtpglr/intGslist`; //页面url地址
			var resourceUrl_ztwhfc = `${tools.API_URL}/ztwhfc/sysProject`; //风场 url地址
			var param = request.param;
			var igFid = "";
			var id = null;
			
			
			/**
			 * 单位下拉框
			 */
			tools.loadSelect({
				url: `${API_URL}/sys/dict/getDictValue`,
				data: {
					"dictTypeId": 46
				},
				selectId: "igUnit", // 下拉框id
				//				initText: "立方米", // 初始化第一排的显示
				//				initValue: "立方米", // 初始化第一排的value
				textField: "label", // 显示的text
				valueField: "label", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			//			$(document).on('input keyup keypress', '.approval-input', function() {
			//				//				var val = $(this).val();
			//				//				var data = self.smallToBig(val);
			//
			//				var price = $('input[name = "igApprovalPrice"]').val();
			//				var num = $('input[name = "igApprovalNum"]').val();
			//				var sum = (price * num / 10000).toFixed(2);
			//
			//				$('input[name="igApprovalSum"]').val(sum);
			//
			//			});
			//
			//			$(document).on('input keyup keypress', '.invest-input', function() {
			//
			//				var price = $('input[name = "igInvestPrice"]').val();
			//				var num = $('input[name = "igInvestNum"]').val();
			//				var sum = (price * num / 10000).toFixed(2);
			//
			//				$('input[name="igInvestSum"]').val(sum);
			//
			//			});
			//
			//			$(document).on('input keyup keypress', '.execute-input', function() {
			//
			//				var price = $('input[name = "igExecutePrice"]').val();
			//				var num = $('input[name = "igExecuteNum"]').val();
			//				var sum = (price * num / 10000).toFixed(2);
			//
			//				$('input[name="igExecuteSum"]').val(sum);
			//
			//			});

			/**
			 * 下拉框显示
			 */
			tools.loadSelect({
				url: `${resourceUrl_ztwhfc}/data`,
				selectId: "sel", // 下拉框id
				initText: "请选择风场", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
				textField: "spName", // 显示的text
				valueField: "spCode", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			if(param.add != undefined) { //新增
				igFid = param.add.id;
				var name = tools.getTreeName(param.add.igPathname, 1);
				tools.setValueToInput({
//					igFname: name,
					spCode: param.add.spCode,
					spName: param.add.spName
				});
			} else { //修改
				igFid = param.edit.igFid;
				id = param.edit.id;
		
				$.ajax({
					type: "get",
					url: `${resourceUrl}/find/${id}`,
					async: true,
				}).then(function(data) {
//					data.igFname = tools.getTreeName(data.igPathname, 2);
					data.igName = param.edit.igName;
					tools.setValueToInput(data);
				}, function() {
					console.log("请求错误");
				});
			}

			/**
			 * 表单校验
			 */
			$('form').bootstrapValidator({　　　　　　　　
				feedbackIcons: {　　　　　　　　
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'　　　　　　　　
				},
				fields: {
					spCode: {
						validators: {
							notEmpty: {
								message: '风场不能为空'
							}
						}
					},
					igCode: {
						validators: {
							notEmpty: {
								message: '概算编号不能为空'
							},
							stringLength: {
								min: 0,
								max: 50,
								message: '概算编号长度不能超过50位'
							},
							remote: {
								message: '概算编号重复',
								url: `${resourceUrl}/validators`,
								data: {
									id: id,
									igFid: igFid,
									igCode: $("input [name='igCode']").val()
								}
							}
						}
					},
					igName: {
						validators: {
							notEmpty: {
								message: '概算名称不能为空'
							},
							stringLength: {
								min: 0,
								max: 100,
								message: '概算名称长度不能超过100位'
							}
						}
					},
					igJtSb: {
						validators: {
							digits: {
								message: '购置费只能是数字'
							}
						}
					},
					igLayer: {
						validators: {
							notEmpty: {
								message: '层级不能为空'
							},
							stringLength: {
								min: 0,
								max: 1,
								message: '层级长度不能超过1位'
							},
							digits: {
								message: '层级只能是数字'
							}
						}
					}

				}
			});

		}
	}

	return page;
});