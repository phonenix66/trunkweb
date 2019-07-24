define("modules/security/aqrz/yzaqrz/aqrz_yzaq", ["jquery", "underscore", "page/tools",
    "bootstrap-datepicker", "serializeJSON", "bootstrap-treeview", "jstree"
], function($, _, tools) {
    var page = function() {};
    page = {
        init: function(request) {
            var resourceUrl = `${tools.API_URL}/aqgl/aqrz`; //页面url地址
            var loginName = tools.getLoginName();



            function getTypeStates(num, row) {
                if (num == '1') {
                    return "草稿"
                } else if (num == '2') {
                    if (row.taskDefKey != null && row.taskDefKey != '') {
                        return "审核中"
                    } else {
                        return "审核通过"
                    }
                } else {
                    return "退回"
                }
            }

            function getTypeWeather(num) {
                switch (num) {
                    case "0":
                        return "晴"
                    case "1":
                        return "阴"
                    case "2":
                        return "雨"
                    case "3":
                        return "雪"

                }
            }

            function getTypeBc(num) {
                switch (num) {
                    case "0":
                        return "白班"
                    case "1":
                        return "夜班"

                }
            }


            /**
             * table显示
             */
            $('#table').bootstrapTable({
                // url: `${resourceUrl}/data`,
                url: "modules/security/aqrz/yzaqrz/data.json",
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
                queryParams: function() { //请求服务器发送的参数

                    var loginName = tools.getLoginName();


                    return { pageSize: -1, loginName: loginName };
                },
                responseHandler: function(res) {
                    var data = res.rows;
                    return data;
                },
                columns: [{
                        title: '序号',
                        field: '',
                        formatter: function(value, row, index) {
                            return index + 1;
                        }
                    },
                    {
                        field: "saProtect",
                        title: "工程项目"
                    },
                    {
                        field: "saDate",
                        title: "日期"
                    },
                    {
                        field: "saWeather",
                        title: "天气",
                        formatter: function(value, row, index) {
                            return getTypeWeather(value);
                        }
                    },
                    {
                        field: "saPeople",
                        title: "当班人员"
                    },
                    {
                        field: "saBc",
                        title: "班次",
                        formatter: function(value, row, index) {
                            return getTypeBc(value);
                        }
                    },
                    {
                        field: "status",
                        title: "状态",
                        formatter: function(value, row, index) {
                            return getTypeStates(value, row);
                        }
                    },
                    {
                        field: "status",
                        title: "操作",
                        width: 270,
                        formatter: function(value, row, index) {
                            row.processObj = {
                                id: row.id,
                                procDefKey: "aqrz_yzaq",
                                procInsId: row.procInsId,
                                table: "scy_aqrz",
                                startActCallback: `function(data){
							$("#table").bootstrapTable("refresh");
						}`
                            }
                            var rows = JSON.stringify(row);
                            var v = '';
                            if (value == "1") {
                                var loginName = tools.getLoginName(); //获得用户登陆名

                                if (loginName == row.createBy.id) {
                                    v = `<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-edit' data='${rows}'>编辑 </button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info btn-startAct' data='${rows}'>提交</button>
                                    &nbsp;&nbsp;</div>
                                    <div class='btn-group'>
                                    <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${rows}'>删除</button>
						        	</div>`
                                } else {
                                    v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                        <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                                }

                            } else if (value == "2") {
                                var loginName = tools.getLoginName(); //获得用户登陆名
                                //1，审核中
                                if (row.taskDefKey != null && row.taskDefKey != '') {
                                    if (row.processName == loginName) {
                                        //审核参数
                                        v = ` 
										<div class='btn-group'>
							        	<button type='button' class='btn btn-info btn-complete' data='${rows}'>审核</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                    <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                                    } else {
                                        v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                        <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                                    }
                                } else {
                                    v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                        <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                                }
                                //2，审核成功
                            } else if (value == "3") {
                                var loginName = tools.getLoginName(); //获得用户登陆名
                                if (row.createBy.id != loginName) {
                                    v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                        <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                                } else {
                                    v = `<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-edit' data='${rows}'>编辑 </button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info btn-startAct' data='${rows}'>提交</button>
                                    &nbsp;&nbsp;</div>
                                    <div class='btn-group'>
                                    <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	&nbsp;&nbsp;</div>
						        	<div class='btn-group'>
						        	<button type='button' class='btn btn-info zdy-btn-delete'  data='${rows}'>删除</button>
						        	</div>`

                                }
                            } else if (value == "4") {
                                v = `<div class='btn-group'>
								        <button type='button' class='btn btn-info zdy-btn-show' data='${rows}'>查看</button>
                                        &nbsp;&nbsp;</div>
                                        <div class='btn-group'>
                                        <button type='button'  class='btn btn-info btn-primary1' data='${rows}'>导出</button>
						        	</div>`
                            }


                            return v;
                        }
                    }
                ]
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
                    url: "modules/security/aqrz/yzaqrz/aqrz_yzaq_audit.html",
                    param: {
                        edit: data
                    },
                    btn: ['关闭'],
                    yes: function(obj, index, data) {
                        layer.closeAll();
                    }
                });
            })

            /*
             * 导出
             */
            $('.row-body').on('click', '.btn-primary1', function() {
                // debugger;
                var d = $(this).data;
                var da = eval('(' + $(this).attr("data") + ')');
                var data = [{
                    'id': da.id

                }]; //模拟后台需要接收的参数
                var url = `${resourceUrl}/exportWord`;
                // debugger;
                tools.outputExcel(data, url);
            });



            /**
             * 修改特种作业人员
             */
            $('.row-body').on('click', '.zdy-btn-edit', function() {
                var data = eval('(' + $(this).attr("data") + ')');
                var id = data.id;
                tools.toDialog({
                    name: "修改安全日志",
                    url: "modules/aqgl/aqrz/aqrz_add.html",
                    param: {
                        edit: data
                    },
                    btn: ['保存', '关闭'],
                    yes: function(obj, index, data) {
                        // debugger;
                        editData(data);
                        $('#table').bootstrapTable('refresh');
                        layer.close(index);
                        //add(data);
                    }
                });
            });

            /**
             * 审核材料进场信息
             */
            $('.row-body').on('click', '.btn-complete', function() {
                var data = eval('(' + $(this).attr("data") + ')');
                var id = data.id;
                var procInsId = data.procInsId;
                data.show = true;
                tools.toDialog({
                    type: 2,
                    name: "审核安全管理日志",
                    url: "modules/security/aqrz/yzaqrz/aqrz_yzaq_audit.html",
                    param: {
                        edit: data
                    },
                    btn: ['提交', '驳回', '关闭'],
                    success: function(obj, index) {

                    },
                    yes: function(obj, index, data, page) {


                        var userObtain = {
                            lcdyKey: "aqrz_yzaq",
                            procInsId: procInsId,
                            condition: null
                        };
                        tools.toDialogProcessUser(userObtain, function(_obj, _index, _data) {
                            var thisData = {
                                "procInsId": procInsId,
                                "flag": 1,
                                "comment": data.comment
                            }
                            if (_data) { //是否还有下级审批
                                thisData.assignee = _data.loginName
                            }
                            $.ajax({
                                type: "post",
                                url: API_URL + "/act/task/complete",
                                data: thisData,
                                dataType: "json",
                                success: function(data) {
                                    //刷新数据
                                    $('#table').bootstrapTable('refresh');
                                    layer.closeAll();
                                }
                            });
                        });


                    },
                    btn2: function(index, obj) {
                        var _obj = $(obj).find('iframe').contents().find('body');
                        var datas = $(_obj).find('form').serializeObject(); // 返回参数''
                        var data = {
                            "procInsId": procInsId,
                            "flag": 0,
                            "comment": datas.comment,
                            "businessId": id,
                            "table": "scy_aqrz"
                        }
                        $.ajax({
                            type: "post",
                            url: API_URL + "/act/task/complete",
                            data: data,
                            dataType: "json",
                            success: function(data) {
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
            $('.row-body').on('click', '.zdy-btn-delete', function() {
                var data = eval('(' + $(this).attr("data") + ')');
                var id = data.id;
                var data = { "ids": id };
                //删除数据
                layer.confirm(
                    "您确认要删除吗？", { title: '提示' },
                    function(index, layero) {
                        $.ajax({
                            url: `${tools.API_URL}/aqgl/aqrz/deleteAll`,
                            type: 'get',
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

            var self = this;
            $("#btn_add").on("click", function() {
                addNewUser();
            });
            $('.companyName,.search-c').on('click', function() {
                var type = 1;
                selectHandle(type);
            })
            $('.officeName,.search-o').on('click', function() {
                var type = 2;
                selectHandle(type);
            });

            function saveData(data) {
                // debugger;
                $.ajax({
                    url: `${resourceUrl}/save`,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        if (res.success) {
                            layer.msg(res.msg);
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            function editData(data) {
                // debugger;
                $.ajax({
                    url: `${resourceUrl}/edit`,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        if (res.success) {
                            layer.msg(res.msg);
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            function addNewUser() {
                tools.toDialog({
                    name: "添加安全日志",
                    url: "modules/security/aqrz/yzaqrz/aqrz_yzaq_add.html",
                    param: {
                        add: true
                    },
                    skin: "layerui-layer",
                    shade: 0.3,
                    btn: ['保存', '关闭'],
                    yes: function(obj, index, data) {
                        saveData(data);
                        $('#table').bootstrapTable('refresh');
                        layer.close(index);

                    }
                });
            }

        }
    }
    return page;
});
