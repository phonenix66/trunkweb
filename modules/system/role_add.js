/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/role_add", ["jquery", "underscore", "page/tools", "jstree","bootstrap-datepicker","icheck","bootstrapvalidator", "layer"], function($, _, tools) {

	var page = function() {};
	page = {
		init: function(request) {
		    bsvalid();
			//初始化单位
			findTree();
			var menu = $('.treeview-menu');
			
			var eId = null;
			var treedata;

             var param = request.param;
             if (param.add) {
             	//添加
             }else if(param.edit){//修改
             	//查询改角色的菜单信息
             	
             	//给表单赋值
             	$('#id').val(param.edit.id);
             	$('#name').val(param.edit.name);//角色名称
             	$('#roleType').val(param.edit.roleType);//权限类型
             	$('#deptId').val(param.edit.deptId);//部门
             	setSdName(param.edit.deptId);//设置部门名称
             	
             	eId = param.edit.id;

//           	$("input[name='useable'][value="+param.edit.useable+"]").attr("checked",true);//状态
             	//备注
//           	var muns = munByRole(param.edit.id);
//           	if(muns.length>0){
//           	   //将数据id获取出来
//           	   var ids = '';
//           	   for(var i = 0;i<muns.length;i++){
//           	       var id = muns[i].id;
////           	   	   jQuery("#"+ id).jstree("check_node",jQuery(this));
//                     var idobj = $('#'+id);
//                     var idonh = $('#000');
//                     var id1class = idobj.attr('class');
//                     var id2class = idonh.attr('class');
//                     $('#'+id).find("a").addClass(" jstree-clicked");
//           	   	   ids+=muns[i].id+",";
//           	   }
////           	   #('#'+id)
////           	   $("#").addClass(" jstree-clicked");
//           	  
//           	   console.log("-----");
//           	   console.log(ids);
//           	} 
             	//给树赋值，初始化改角色的选中的菜单
             	
             }
             
            // var test=searchInit(projList);
            var proList = function(list) {
                var data = [];
                _.each(list, function(item1) {
                	if(item1.parentId == 0){
                		item1.parentId = "#";
                	}
                    data.push({
                        "id": item1.id,
                        "parent": item1.parentId,
                        "text": item1.name,
                        "menu": item1,
                         "state": item1.state
                    });

               });
                return data;
            };
            
            var getPList = function() {
            	var ttys = munList();
            	if(eId!=null){
            		var muns = munByRole(param.edit.id);
            	}
            	var data = proList(treedata);
            	return data;
            };
            
            //获得数据
            function munList(){
            	var nums = '';
            	 $.ajax({
					url: `${tools.API_URL}/ewindsys/ewindMenu/findList`,
					async: false,
					type: 'get',
					contentType: "application/json;charset=UTF-8",
					success: function(data){
					    if(data.menuList.length > 0){
					    	nums = data.menuList;
					    }
					}
				 });	
				 treedata = nums;
				 return nums;
            }
            
            	//初始化树形结构
			function findTree(){
				tools.loadTree({
					url: `${tools.API_URL}/orgnzation/sysDept/findList`, //请求链接地址
					async: false,
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
					    $('#deptId').val(id);
					    $('#deptName').val(sdName);
					}
				})
			};
			
            
            //获得角色对应的菜单数据
            function munByRole(roleId){
            	 var nums = '';
            	 var data = {"roleId":roleId};
            	 $.ajax({
					url: `${tools.API_URL}/ewindsys/ewindMenu/findMenuByRole`,
					async: false,
					data :  data,
					type: 'get',
					contentType: "application/json;charset=UTF-8",
					success: function(data){
					for(var i = 0; i<treedata.length;i++){
							treedata[i].state = {
								opened: true,
								selected: false
							}
						for(var j = 0;j<data.length;j++){
							
							if (treedata[i].id == data[j].id) {

									treedata[i].state = {
									selected: true								
								}
							}
							
						}			
					}
					    if(data.length > 0){
					    	nums = data;
					    }
					}
				 });	
				 return nums;
            }
            
            /**
             * 部门树的弹窗
             * @param {Object} type
             */
           function selectHandle(type) {
				layer.open({
					type: 1,
					title: "选择公司",
					area: ["300px", "420px"],
					content: $('#js_tree'),
					btn: ["确定", "取消"],
					btn1: function (index, layero) {
						layer.close(index);
					},
					btn2: function (index, layero) {
						layer.close(index);
					}
				});
			}
           
           	//查询出部门信息
			function setSdName(deptId){
				  $.ajax({
					url: `${tools.API_URL}/orgnzation/sysDept/find/`+deptId,
					async: false,
					type: 'get',
					contentType: "application/json;charset=UTF-8",
					success: function(data){
//						console.log(data);
						$('#deptName').val(data.sdName);//部门名称
					}
				 });	
			}
			
			//点击菜单树，更新菜单和角色关联的数据
			$('#chooseMenuTree').on('changed.jstree',function(e,data){
				 var ids="";
				 var unids="";
		         var nodes=$("#chooseMenuTree").jstree("get_checked"); //使用get_checked方法 
		         $.each(nodes, function(i, n) {
		            ids += n+",";
		         }); 
		         var unde = $('#chooseMenuTree').jstree().get_undetermined();
		         $.each(unde, function(i, n) {
		            unids += n+",";
		         }); 
		         $('#munIds').val(ids);
		         $('#unMunIds').val(unids);
			});
           
           /**
            * 点击进去选择部门树
            */
           $('.deptName,.search-o').on('click', function () {
				var type = 2;
				selectHandle(type);
			});
			
			
		
			            
            /**
             * 提交
             */
            var contacttree  = $('#chooseMenuTree').jstree({
                'core': {
                    'data': getPList()
                },
                "check_callback":true,
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins" : [
                    "contextmenu", "dnd", "search",
                     "types", "wholerow","checkbox"
                ]
            }).on('loaded.jstree', function(e, data){
//          	setTimeout(yourFunction,2000);
             });
             
          
             
            
             
			menu.sortable();
//			$('#example').DataTable({
//				'paging': true,
//				'lengthChange': false,
//				'searching': false,
//				'ordering': true,
//				'info': true,
//				'autoWidth': false
//			});
            //Date picker
            $('#datepicker1').datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });
            $('#datepicker2').datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });
            $('input[type="checkbox"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green'
            })
			$(".box-title").html(request.name);

			$(".zdy-btn-save").on("click", function() {
				alert("保存成功！");
				tools.toPage(request.lastmenu);
			});

			$(".zdy-btn-back").on("click", function() {
				tools.toPage(request.lastmenu);
			});
			
			$(".zdy-btn-mun").on("click", function() {
				var muns = munByRole(param.edit.id);
             	if(muns.length>0){
             	   //将数据id获取出来
             	   var ids = '';
             	   for(var i = 0;i<muns.length;i++){
                       $('#'+muns[i].id+'_anchor').click();
             	   	   ids+=muns[i].id+",";
             	   }

             	} 
				
			});
			
			function bsvalid() {
            	$('form').bootstrapValidator({
					framework: 'bootstrap',
					icon: {
						valid: 'glyphicon glyphicon-ok',
						invalid: 'glyphicon glyphicon-remove',
						validating: 'glyphicon glyphicon-refresh'
					},
				    fields: {
				    	"name": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						},
						"deptName": {
							validators: {
								notEmpty: {
									message: '这是必填字段'
								}
							}
						}
				    }
					
				})
            }
			
		}
	
	}

	return page;
});

