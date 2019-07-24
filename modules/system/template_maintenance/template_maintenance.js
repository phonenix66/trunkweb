/**
 * 系统管理=》模板维护
 */
define("modules/system/template_maintenance/template_maintenance", ["jquery", "underscore", "page/tools", "bootstrap-table", "layer", "chart", "bootstrap-fileinput", "bootstrap-fileinput-locale-zh", "fileinput-theme", "serializeJSON", "autocomplete", "select2", "bootstrapvalidator"], function($, _, tools, chart) {

	var resourceUrl = `${tools.API_URL}/ewindsys/sysFileTemplate`;

	var dictUrl = `${tools.API_URL}/sys/dict`;

	var page = function() {};
	page = {

		init: function(request) {

			/**
			 * 模块类型下拉框
			 */
			tools.loadSelect({
				url: `${API_URL}/sys/dict/getDictValue`,
				data: {
					"dictTypeId": 49
				},
				selectId: "sftType", // 下拉框id
				initText: "全部", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
				textField: "label", // 显示的text
				valueField: "label", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			/**
			 * 模块分类下拉框
			 */
			tools.loadSelect({
				url: `${API_URL}/sys/dict/getDictValue`,
				data: {
					"dictTypeId": 50
				},
				selectId: "sftCategory", // 下拉框id
				initText: "全部", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
				textField: "label", // 显示的text
				valueField: "label", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response.rows;
				}
			})

			//			tools.initFileInput("input-id", '1', 02);

			var self = this;
			self.renderTable();

			/**
			 * 查询
			 */
			$("#btn_search").on("click", function() {
				debugger
				var data = $("#searchForm").serializeObject();
				data.pageNo = 1;
				data.pageSize = 10;
				$("#tablelist").bootstrapTable('refresh');
			})

			/**
			 * 新增模板
			 */
			$("#btn_add").on("click", function() {

				tools.toDialog({
					name: "新增模板",
					url: "modules/system/template_maintenance/template_add.html",
					btn: ['保存', '关闭'],
					param: {
						"id": ""
					},
					success: function(obj, index) {

					},
					yes: function(obj, index, data) {
						debugger

						var opt = {
							"sftId": data.id,
							"sftType": data.sftType,
							"sftCategory": data.sftCategory,
							"sftName": data.sftName
						}
						//						if(!self.validSelected()) {
						//							return false;
						//						}
						//						self.addTemplate(options);

						$.ajax({
							url: `${resourceUrl}/save`,
							type: "POST",
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify(opt),
							success: function(res) {

								layer.close(index);
								$('#tablelist').bootstrapTable('refresh');

								if(res.success) {

									//self.applyHandle(res.body.payment);
								}
							},
							error: function() {
								alert('新增出错');
							}
						})
					}
				});

			});

			/**
			 * 模板修改
			 */
			$('#tablelist').on('click', '.btn-edit', function() {

				var row = eval('(' + $(this).attr("data") + ')');
				debugger
				tools.toDialog({
					name: "新增模板",
					url: "modules/system/template_maintenance/template_add.html",
					btn: ['保存', '关闭'],
					param: {
						"id": row.id,
						"row": row
					},
					success: function(obj, index) {

					},
					yes: function(obj, index, data) {
						debugger

						var opt = {
							//要特别注意与新增的区别
							"id": data.id,
							"sftType": data.sftType,
							"sftCategory": data.sftCategory,
							"sftName": data.sftName
						}
						//						if(!self.validSelected()) {
						//							return false;
						//						}
						//						self.addTemplate(options);

						$.ajax({
							url: `${resourceUrl}/save`,
							type: "POST",
							dataType: 'json',
							contentType: 'application/json',
							data: JSON.stringify(opt),
							success: function(res) {

								layer.close(index);
								$('#tablelist').bootstrapTable('refresh');

								if(res.success) {

									//self.applyHandle(res.body.payment);
								}
							},
							error: function() {
								alert('修改出错');
							}
						})
					}
				});

				//				self.eidtTemplate(row.id);

			});

			/**
			 * 模板删除
			 */
			$('#tablelist').on('click', '.btn-del', function() {
				var row = eval("(" + $(this).attr("data") + ")");

				layer.confirm("确定要删除此模板？", {
					title: '删除'
				}, function(index) {

					self.delTemplate(row.id);
				})

			});

		},

		/**
		 * 模板修改
		 */
		editTemplate: function(id) {
			var self = this;

			$.ajax({
				type: "POST",
				data: {
					id: id
				},
				url: `${resourceUrl}/getById`,
				success: function(res) {

					self.applyHandle(res);

				},
				error: function() {

				}
			})
		},

		/**
		 * 模板删除
		 */
		delTemplate: function(id) {
			var self = this;

			$.ajax({
				url: `${resourceUrl}/delete`,
				type: "POST",
				async: false,
				data: {
					id: id
				},

				success: function(res) {
					layer.msg('删除成功');
					$("#tablelist").bootstrapTable("refresh");

				},
				error: function() {
					layer.msg('操作失败');
				}
			})
		},

		//		validSelected: function() {
		//			var htval = $('#template_name').val();
		//			var htStage = $('#select_type').val();
		//			if(htval && htStage) {
		//				return true;
		//			} else if(!htval && htStage) {
		//				layer.msg('请选择合同名称和编号');
		//				return false;
		//			} else if(htval && !htStage) {
		//				layer.msg('请选择合同结算阶段');
		//				return false;
		//			} else {
		//				layer.msg('请选择合同名称和编号');
		//				return false;
		//			}
		//		},

		applyHandle: function(data) {

			var self = this;
			debugger
			//var id = data.id;
			var tempUrl = 'modules/system/template_maintenance/template.html';

			var param = {
				data: data,
				url: tempUrl,
				title: '模板修改',
				eleId: 'tempHtml',
				initialPreview: [],
				initialPreviewConfig: []
			}
			if(data.sysAffixList && data.sysAffixList.length) {
				data.sysAffixList.forEach(function(item) {
					param.initialPreview.push(`${tools.FILE_API_URL}/tools/affix/download/${item.id}`);
					var obj = {
						caption: item.saName,
						size: 0,
						url: `${tools.FILE_API_URL}/tools/affix/delete/${item.id}`,
						downloadUrl: `${tools.FILE_API_URL}/tools/affix/download/${item.id}`,
						type: "image",
						key: item.id
					}
					param.initialPreviewConfig.push(obj);
				})
			}

			//			self.renderDialog(param);
		},

		renderDialog: function(param) {
			var self = this;
			debugger
			var $html = tools.template(self.getTemplateString(param.url), {
				data: param.data
			});

			$('#' + param.eleId).html($html);
			var options = {
				type: 1,
				title: param.title,
				content: $('#' + param.eleId),
				shade: 0.3,
				area: ['80%', '85%'],
				success: function(index, layero) {

					self.upload(param);
				},
				btn: ["确定"],

				yes: function(index, layero) {
					layer.close(index);
				},
				cancel: function(index, layero) {

				}
			}
			layer.open(options);
		},

		/**
		 * 获取表单
		 */
		renderTable: function() {
			var self = this;
			var columns = [{
				title: '标段',
				field: '',
				formatter: function(value, row, index) {
					return index + 1;
				}
			}, {
				field: 'sftType',
				title: '模板类型',
				align: 'center'
			}, {
				field: 'sftCategory',
				title: '模板分类',
				align: 'center'
			}, {
				field: 'sftName',
				title: '模板名称',
				align: 'center'
			}, {
				field: 'file',
				title: '附件',
				formatter: function(value, row, index) {
					var fileList = [];
					var v = "";
					row.sysAffixList;
					$.extend(fileList, row.sysAffixList);
					fileList.forEach(function(_this, index, arr) {
						v += `<a href = "${tools.FILE_API_URL}/tools/affix/download/${_this.id}">${_this.saName}</a>&nbsp;&nbsp;&nbsp;&nbsp;`;
					});
					return v;
				}
			}, {
				field: 'operate',
				title: '操作',
				align: 'center',
				formatter: self.operate
			}];

			$("#tablelist").bootstrapTable({

				url: `${resourceUrl}/data`,
				queryParams: function(params) {
					var searchParam = $("#searchForm").serializeJSON();

					searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
					searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
					searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
					return searchParam;
				},
				cache: false, //禁用 AJAX 数据缓存。
				striped: true, //隔行变色效果。
				silent: true,
				height: '300px', //表格的高度。
				pagination: true, //在表格底部显示分页条。
				sidePagination: 'server',
				search: false,
				toolbarAlign: 'left',
				strictSearch: false,
				showColumns: false,
				showRefresh: false,
				showToggle: false,
				clickToSelect: true,
				minimumCountColumns: 2,
				pageNumber: 1,
				pageSize: 10,

				pageList: [10, 25, 50, 100],
				paginationPreText: '上一页',
				paginationNextText: '下一页',
				paginationFirstText: 'First',
				paginationLastText: 'Last',
				columns: columns
			})
		},

		operate: function(value, row, index) {

			var rowObj = JSON.stringify(row);

			var v = '';

			//修改		
			var edit = `<div class='btn-group'>
					<button type='button' class='btn btn-info btn-edit' data='${rowObj}'>修改</button>
					&nbsp;&nbsp;</div>`;

			var del = `<div class='btn-group'>
					<button type='button' class='btn btn-info btn-del' data='${rowObj}'>删除</button>
					&nbsp;&nbsp;</div>`;

			v = edit + del;
			return v;

		},

		getTemplateString: function(url) {
			return $.ajax({
				url: url,
				async: false
			}).responseText;
		},

		/**
		 * 上传附件
		 * @param {Object} param
		 */
		upload: function(param) {
			param.ele = 'input-upload';
			var opts = {
				theme: "explorer",
				language: 'zh',
				uploadUrl: `${tools.FILE_API_URL}/tools/affix/upload`,
				//allowedFileExtensions: ['jpg', 'png', 'gif', 'txt', 'doc', 'xlsx'],
				previewFileIcon: '<i class="fa fa-file"></i>',
				overwriteInitial: false,
				initialPreviewAsData: true,
				initialPreview: param.initialPreview,
				uploadExtraData: {
					"fid": param.data.payId,
					"moduleCode": "02"
				},
				initialPreviewConfig: param.initialPreviewConfig,
				preferIconicPreview: true,
				enctype: 'multipart/form-data',
				previewFileIconSettings: { // configure your icon file extensions
					'doc': '<i class="fa fa-file-word-o text-primary"></i>',
					'xls': '<i class="fa fa-file-excel-o text-success"></i>',
					'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
					'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
					'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
					'htm': '<i class="fa fa-file-code-o text-info"></i>',
					'txt': '<i class="fa fa-file-text-o text-info"></i>',
					'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
					'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
					// note for these file types below no extension determination logic 
					// has been configured (the keys itself will be used as extensions)
					'jpg': '<i class="fa fa-file-photo-o text-danger"></i>',
					'gif': '<i class="fa fa-file-photo-o text-muted"></i>',
					'png': '<i class="fa fa-file-photo-o text-primary"></i>'
				},
				previewFileExtSettings: { // configure the logic for determining icon file extensions
					'doc': function(ext) {
						return ext.match(/(doc|docx)$/i);
					},
					'xls': function(ext) {
						return ext.match(/(xls|xlsx)$/i);
					},
					'ppt': function(ext) {
						return ext.match(/(ppt|pptx)$/i);
					},
					'zip': function(ext) {
						return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
					},
					'htm': function(ext) {
						return ext.match(/(htm|html)$/i);
					},
					'txt': function(ext) {
						return ext.match(/(txt|ini|csv|java|php|js|css)$/i);
					},
					'mov': function(ext) {
						return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
					},
					'mp3': function(ext) {
						return ext.match(/(mp3|wav)$/i);
					}
				},
				initialPreviewDownloadUrl: 'https://picsum.photos/1920/1080?image={key}'
			}
			//草稿编辑隐藏
			var disableObj = {
				fileActionSettings: {
					showRemove: false
				},
				deleteUrl: '',
				deleteExtraData: {},
				dropZoneEnabled: false,
				showClose: false,
				showRemove: false,
				showCaption: false,
				showBrowse: false,
				showUploadedThumbs: false,
				showUpload: false
			}
			if(!param.data.payStatus) {
				$.extend(opts, disableObj);
			}
			console.log(opts);
			$('#' + param.ele).fileinput(opts).on("filepreupload", function(event, data, previewId, index) {
				console.log("文件上传中", data);
			}).on("fileuploaded", function(event, data, previewId, index) {
				//返回文件信息，文件名称，文件 id
				console.log("文件上传完成", data, previewId);
			}).on("fileerror", function(event, data, msg) {
				console.log("上传出现问题", data);
			}).on('filesuccessremove', function(event, key) {
				//删除方式ajax 文件id
				console.log('Key = ' + key);
			});
		},

		close: function() {
			layer.close(this.index);
			this.renderTable();
		},

		validateForm: function() {
			$('form').bootstrapValidator({
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					"payActually": {
						validators: {
							notEmpty: {
								message: '付款金额不能为空'
							},
							regexp: {
								regexp: /^-?([1-9]\d*.\d*|0.\d*[1-9]\d*)$/,
								message: '费用只能是数字'
							}

						}
					}
				}
			});
		}
	}
	return page;
});