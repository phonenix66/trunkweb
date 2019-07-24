define("modules/system/roles", ["jquery", "underscore", "page/tools","layer",
        "bootstrap-datepicker", "modules/projectinfo/utils"
    ],
    function($, _, tools,layer) {

        var page = function() {};
        page = {
            init: function(request) {
                var resourceUrl = `${tools.API_URL}/ewindsys/ewindRole`; //页面url地址
                var $table = $('#table');
                /**
                 * 查询
                 */
                $("#query").on("click", function() {
                    // debugger
                    var data = $("form").serializeObject();
                    $("#table").bootstrapTable('refresh', {
                        query: data
                    });
                    // var name = $('#name').val();
                    // var useable = $('#useable').val();
                    // debugger
                    // $("#table").bootstrapTable('refresh', {
                    //     query: {
                    //         name: name,
                    //         useable: useable
                    //     }
                    // });
                });
                /**
                 * table显示
                 */
                // $('#example').bootstrapTable({
                $table.bootstrapTable({
                    url: `${resourceUrl}/data`,
                    contentType: "application/x-www-form-urlencoded",

                    method: "post",
                    clickToSelect: true,
                    // toolbar: '', //工具按钮用哪个容器
                    striped: true, //是否显示行间隔色
                    pageSize: 10,
                    pageNumber: 1,
                    pageList: [5, 10, 25, 50, 100],
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, //是否显示分页（*）
                    sortable: false, //是否启用排序
                    sortOrder: "asc", //排序方式
                    uniqueId: "id",
                    sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                    queryParams: function() { //请求服务器发送的参数
                        return {}
                        // var temp = {
                        //     rows: params.limit, //页面大小
                        //     page: (params.offset / params.limit) + 1, //页码
                        //     sort: params.sort, //排序列名
                        //     sortOrder: params.order //排位命令（desc，asc）
                        // };
                        // console.log(params);
                        // console.log(temp);
                        // return temp;
                    },
                    responseHandler: function(res) {
                        var data = res.rows;
                        return data;
                    },
                    columns: [{
                            title: "全选",
                            checkbox: true,
                            visible: true
                        },
                        {
                            field: "name",
                            title: "角色名称"
                        },
                        {
                            field: "roleType",
                            title: "权限类型"
                        },
                        {
                            field: "useable",
                            title: "状态",
                            formatter: function(value, row, index) {
                                return value == "1" ? "启用" : "停用";
                            }
                        }
                        // {
                        //     field: "3",
                        //     title: "操作",
                        //     formatter: function(value, row, index) {
                        //         row = JSON.stringify(row);
                        //         var v = `<div class='btn-group'>
                        // <button type='button' class='btn btn-info zdy-btn-edit' data='${row}'>修改</button>
                        // &nbsp;&nbsp;</div>
                        // <div class='btn-group'>
                        // <button type='button' class='btn btn-info zdy-btn-delete'  data='${row}'>删除</button>
                        // </div>`
                        //         return v;
                        //     }
                        // }
                    ],
                    onLoadSuccess: function() {},
                    onLoadError: function() {
                        console.log("数据加载失败！");
                    },
                    onClickRow: function(row) {
                        //console.log(row);
                    },
                    onSort: function(name, order) {
                        console.log(name)
                        console.log(order)
                    }
                });


                /**
                 * 添加
                 */
                $("#btn_add").on("click", function() {
                    tools.toDialog({
                        name: "添加角色信息",
                        url: "modules/system/role_add.html",
                        param: { add: true },
                        btn: ['保存', '关闭'],
                        yes: function(obj, index, data) {
                            console.log(data);
                            console.log("data");

                            saveData(data);
                            $('#table').bootstrapTable('refresh');
                            layer.close(index);
                        }
                    });
                });
                /*删除*/
                // $("#btn_delete").on("click", function() {
                //     var obj = tableHasChoose($table)
                //     if (!obj) return;
                //     obj.forEach(function(_this, index, _obj) {
                //         $table.bootstrapTable("removeByUniqueId", _this.id);
                //     })
                // });

                /**
                 * 删除
                 */
                $("#btn_delete").on("click", function() {

                    var obj = tableHasChoose($table)
                        // var data = eval('(' + $(this).attr("data") + ')');
                    var ids = "";
                    if (obj != null && obj.length > 0) {
                        for (var i = 0; i < obj.length; i++) {
                            if (i == obj.length - 1) {
                                ids += obj[i].id;
                            } else {
                                ids += obj[i].id + ",";
                            }

                        }

                    }
                    // debugger;
                    var data = { "ids": ids };
                    layer.confirm("您确认要删除吗？", function(index, layero) {
                        $.ajax({
                            url: `${tools.API_URL}/ewindsys/ewindRole/deleteAll`,
                            type: 'get',
                            async: false,
                            data: data,
                            contentType: "application/json;charset=UTF-8",
                            success: function(data) {
                                if (data.success == true) {
                                    layer.msg("删除成功");
                                } else {
                                    layer.msg("删除失败");
                                }
                                //刷新数据
                                $('#table').bootstrapTable('refresh');
                            }
                        });
                    });
                });



                /**
                 * 修改
                 */
                $("#btn_edit").on("click", function() {
                    var obj = tableHasChoose($table)
                    if (obj != null) {
                        if (obj.length == 1) {
                            tools.toDialog({
                                name: "修改角色信息",
                                url: "modules/system/role_add.html",
                                param: { edit: obj[0] },
                                btn: ['保存', '关闭'],
                                yes: function(obj, index, data) {
                                    saveData(data);
                                }
                            });
                        } else if (obj.length > 1) {
                            layer.msg("只能选一个");
                        } else {
                            layer.msg("请选择");
                        }
                    } else {
                        layer.msg("请选择");
                    }
                    // var data = eval('(' + $(this).attr("data") + ')');
                    // var id = obj.id;

                })


                function saveData(data) {
                    $.ajax({
                        url: `${tools.API_URL}/ewindsys/ewindRole/save`,
                        data: data,
                        type: 'post',
                        async: false,
                        success: function(data) {
                             debugger;
                             if(data.success == true){
                                 layer.msg("保存成功");
                                 layer.closeAll();
                             }else{
                                 layer.msg("保存失败");
                             }
                            $('#table').bootstrapTable('refresh');
                        }
                    });
                }



                //			 //添加，修改
                //		  function save(data,url){
                //		  		$.ajax({
                //					url: url,
                //					data: data,
                //					type: 'post',
                //					dataType: 'json',
                //					success: function (res) {
                //						layer.msg(res.msg);
                //					  	$table.bootstrapTable("refresh",{
                //					  	 query: {ihId:ihId}
                //					  	});
                //						layer.closeAll();
                //					},
                //					error: function (err) {
                //	                    layer.msg('操作失败');
                //					}
                //				})
                //		  };



            }
        }

        return page;
    });
