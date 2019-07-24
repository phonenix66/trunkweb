/**
 * 站点管理=》站点维护
 */
define("modules/system/lcpzxml_add", ["jquery", "underscore", "page/tools","jstree",  "bootstrap", "bootstrap-select4", "bootstrap-datepicker", "bootstrap-fileinput", "bootstrap-fileinput-locale-zh", "bootstrap-table-x-editable", "bootstrap-table-editable","jquery-json2xml","jquery-xml2json"], function($, _, tools) {

	var page = function() {};
	//当前页面需要的参数
	var thisObj = {};
	page = {
		getData: function() { //获取数据
			var lcdykeyName = $('#sel').val();
			var arr = new Array();
			var jsons = {};
			var $obj = $('#lcpz_example').find('.btn-lcpz-del');
			$obj.each(function(index, obj) {
				var _obj = eval('(' + $(obj).attr('data') + ')');
				var nodeId = _obj.nodeId;
				var nodeUses = _obj.nodeUses;
				var title = _obj.title;
				delete _obj.nodeId;
				delete _obj.nodeUses;
				delete _obj.title;
				delete _obj.id;
				_obj.lcdyKey = lcdykeyName;
				_obj.nodeId = nodeId;
				_obj.nodeUses = nodeUses;
				_obj.title = title;
				_obj['@id'] = thisObj.spCode;
				arr.push(_obj);
			})
			if(arr.length > 0) {
				jsons.actroles = arr;
			}
			return $.json2xml(jsons, {
				"rootTagName": "actrolestore"
			});
		},
		init: function(request) {
			var resourceUrl = `${tools.API_URL}/lcpz/sysLcpzxml`; //页面url地址
			var resourceUrl_sysDept= `${tools.API_URL}/orgnzation/sysDept`; //部门
			var resourceUrl_task = `${tools.API_URL}/act/task`; //流程
			
			var param = request.param;
			var $thisObj = null; //当前弹框的节点对象
			var jsons = [];

			/**
			 * 下拉框显示
			 */
			tools.loadSelect({
				url: `${resourceUrl_task}/findProcessDefinition`,
				selectId: "sel", // 下拉框id
				initText: "请选择", // 初始化第一排的显示
				initValue: "", // 初始化第一排的value
				textField: "name", // 显示的text
				valueField: "key", // 显示的value
				responseHandler: function(response) { //数据接收到之前回调
					return response;
				},
				change: function(data){
					$('#lcpz_example').bootstrapTable('removeAll');
					if(!data){
						return;
					}
					$.ajax({
						type: "post",
						url: `${resourceUrl_task}/findProcessNode/${data.key}`,
						async: true,
					}).then(function(res) {
						res = res.rows;
						var arr = new Array();
						res.forEach(function(_obj,_index){
							if(_obj.assignee){
								arr.push({
									id: tools.getUUID(),
									nodeId: _obj.id,
									nodeUses: '请填写',
									title: "("+_obj.name+") 请选择"
								});
							}
						})
						$('#lcpz_example').bootstrapTable('append', arr);
					}, function() {
						console.log("请求错误");
					});
				}
			})
			
			
			$('.box-primary').on('click','.nodeUses',function(){
				$thisObj = $(this);
				loadTree();
				layer.open({
					type: 1,
					title: "选择部门",
					area: ["40%", "90%"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					yes: function(index, layero) {
						layer.close(index);
					}
				});
			})
			
			//部门树
			function loadTree(){
				tools.loadTree({
					url: `${resourceUrl_sysDept}/findList`, //请求链接地址
					treeId: "js_tree", //id选择器名称
					plugins:["checkbox"],
					showAll: true, //是否展开所有的树节点
					id: "id", //数据的id名称
					parentId: "sdFid", //数据的父级id名称
					name: "sdName", //数据在树的显示字段
					shortName: "sdSort", //数据在树的排序字段
					responseHandler: function(response) { //数据接收到之前回调
						var data = response.rows;
						//当前点击对象
						for(var i in data){
							var _data = data[i];
							//当前点击对象
							if($thisObj){
								var nodeUsesArr = JSON.parse($thisObj.attr("data")).nodeUses.split(","); //部门id
								for(var y in nodeUsesArr){
									if(nodeUsesArr[y] == _data.id){ //选中
										_data.state = {
											selected: true
										};
									}
								}
							}
						}
						return data;
					},
					changed: function(obj, e){ //check选中事件
						setParamTable(obj,e);
					}
				})
			}
			
		
			/**
			 * 给table赋值
			 */
			function setParamTable(obj,e){
				if(e.node == undefined){
					return;
				}
				
				// 获取选中id
				var idsArray = e.selected;
				// 获取选中name
				var namesArray = new Array();
				var data = $('#js_tree').jstree(false).settings.core.data;
				for(var index in idsArray){
					var id = idsArray[index];
					for(var _index in data){
						var _data  = data[_index];
						if(id == _data.id){
							namesArray.push(_data.text);
							break;
						}
					}
				}
				var id = idsArray.join(','); //id 集合
				var sdName = namesArray.length >0 ? namesArray.join(',') : "请选择";//name集合
				//获取当前删除按钮 对象
				var $this = $thisObj.parents('tr').find('.btn-lcpz-del');
				
				//替换数据
				var data = JSON.parse($this.attr('data'));
				data.nodeUses = id;  //当做部门id
				data.title = sdName; //当做部门名称
				$this.attr('data',JSON.stringify(data));
				
				//更新当前行数据
				var index = $thisObj.parents('tr').attr('data-index')
				$('#lcpz_example').bootstrapTable('updateRow', {index: index, row: data});
			}
			

			function showTable() {
				$('#lcpz_example').bootstrapTable({
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded",
					cache: false,
					striped: true, //是否显示行间隔色
					sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
					showColumns: false,
					pagination: true,
					minimumCountColumns: 2,
					pageNumber: 1, //初始化加载第一页，默认第一页
					pageSize: 10, //每页的记录行数（*）
					pageList: [10, 15, 20, 25], //可供选择的每页的行数（*）
					uniqueId: "ID", //每一行的唯一标识，一般为主键列
					data: jsons,
					columns: [{
						field: 'id',
						title: '序号',
						visible: false
					}, {
						field: 'nodeId',
						title: '流程节点id'
					}, {
						field: 'title',
						title: '审批部门',
						formatter: function(value, row, index) {
							var rowObj = JSON.stringify(row);
							return `<a href="javascript:void(0);" class="btn-lcpz-del nodeUses" data='${rowObj}'>${value}</a>`;
						}
					}]
				});
			}

			if(param.add) { //新增
				//获取uuid
				thisObj = param.add;
				tools.setValueToInput({
					spCode: thisObj.spCode,
					spName: thisObj.spName
				});
				showTable();
			} else { //修改
				var id = param.id;
				$.ajax({
					type: "get",
					url: `${resourceUrl}/find/${id}`,
					async: false,
					success: function(data) {
						thisObj = data;
						tools.setValueToInput(data);
						jsons = $.xml2json(data.processXml).actroles

						if(jsons) {
							if(!(jsons instanceof Array)) {
								jsons = [jsons];
							}
							jsons.forEach(function(_obj, _index) {
								_obj.id = tools.getUUID();
							})
						} else {
							jsons = [];
						}
						showTable();
					}
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
					modularName: {
						validators: {
							notEmpty: {
								message: '模块名称不能为空'
							},
							stringLength: {
								min: 0,
								max: 50,
								message: '模块名称不能超过50位'
							}
						}
					},
					lcdykeyName: {
						validators: {
							notEmpty: {
								message: '流程不能为空'
							},
							remote: {
								message: '流程重复',
								url: `${resourceUrl}/validators`,
								data: {
									id: thisObj.id,
									spCode: thisObj.spCode,
									lcdykeyName: $("select [name='lcdykeyName']").val()
								}
							}
						}
					},
					processXml: {
						validators: {
							notEmpty: {
								message: '流程配置不能为空'
							}
						}
					}
				}
			});

		}

	}
	return page;
});