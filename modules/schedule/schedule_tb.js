define("modules/schedule/schedule_tb", ["jquery", "underscore", "page/tools",
        "text!modules/schedule/schedule_add.html",
        "bootstrap-datepicker", "bootstrap-treeview",
        "bootstrap-table-zh-CN", "modules/projectinfo/utils"
    ],
    function($, _, tools, templ) {
        var page = function() {};
        page = {
            init: function(request) {
                tools.setNavData(1);
                var projectData = getProjectData()
                if (projectData.project == null) {
                    loadingPage()
                }
                var resourceUrl = `${tools.API_URL}/schedule/scheduleManagement`; //页面url地址
                var userId = tools.getEwindUser().info.departmentId;
                var $table = $('#table');
                var city = sessionStorage.getItem("selected");
                var cityEntity = JSON.parse(city);
                var projectId = projectData.project.id;

                $('#pjStatus').append('<option value="">全部</option>');
                tools.getDictValue(202, "pjStatus");
                //1.拿字典
                // var pjStatusS = tools.getDicts("202");
                // console.log("pjStatusS", pjStatusS) //[0: {id: "2020", createDate: "2019-05-16 11:26:33", label: "待建", value: "1", dictType: {…}}...]
                //     //2.处理数据结构
                // var opetions = []
                // for (var one of pjStatusS) {
                //     var o = { value: one.id, text: one.label }
                //     opetions.push(o);
                // }
                // console.log("opetions", opetions) //[0: {value: "2020", text: "待建"}...]
                function getTypeStatus(num) {
                    switch (num) {
                        case "0":
                            return "未审核"
                        case "1":
                            return "审核通过"
                        case "2":
                            return "审核未通过"


                    }
                }
                /**
                 * table显示
                 */
                $table.bootstrapTable({
                    url: `${resourceUrl}/data`,
                    method: "get",
                    toolbar: '', //工具按钮用哪个容器
                    clickToSelect: false,
                    singleSelect: false,
                    striped: true, //是否显示行间隔色
                    pageSize: 10,
                    pageNumber: 1,
                    // pageList: [5, 10, 25, 50, 100],
                    dataType: "json",
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, //是否显示分页（*）
                    sortable: false, //是否启用排序
                    sortOrder: "asc", //排序方式
                    uniqueId: "id",
                    sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
                    onDblClickCell: function(field, value, row, $element) {
                        $element.find(".cell-edit").removeAttr("disabled");
                    },
                    queryParams: function(params) { //请求服务器发送的参数
                        var searchParam = {
                            pjId: projectId
                        };
                        searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                        searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                        searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                        return searchParam;
                    },
                    onClickRow: function(row) {
                        var view = false;
                        openRow(row, "进度填报", view)
                    },
                    columns: [{
                            title: "全选",
                            checkbox: true,
                            visible: true
                        },
                        {
                            title: '序号',
                            sortable: true,
                            field: '',
                            align: 'center',
                            width: 100,
                            formatter: function(value, row, index) {
                                return index + 1;
                            }
                        },
                        {
                            field: "reportingDate",
                            title: "上报时间",
                            align: 'center',
                            width: 100

                        },
                        {
                            field: "pjStateValue",
                            title: "状态",
                            width: 100,
                            align: 'center'

                        },
                        {
                            field: "sAppropriate",
                            title: "本次资金拨付(万元)",
                            width: 200,
                            align: 'right'

                        },
                        // {
                        //     field: "sAppropriateBn",
                        //     title: "本年资金拨付(万元)",
                        //     width: 200,
                        //     align: 'right',
                        //     formatter: function(value, row, index) {
                        //         if (row.status == '1') {
                        //             return value
                        //         }
                        //     }

                        // },
                        {
                            field: "sSettlement",
                            title: "本次资金结算(万元)",
                            width: 200,
                            align: 'right'

                        },
                        // {
                        //     field: "sSettlementBn",
                        //     title: "本年资金结算(万元)",
                        //     width: 200,
                        //     align: 'right',
                        //     formatter: function(value, row, index) {
                        //         if (row.status == '1') {
                        //             return value
                        //         }
                        //     }

                        // },
                        {
                            field: "progressBn",
                            title: "年度进度(当月)",
                            width: 200,
                            align: 'center',
                            formatter: function(value, row, index) {
                                if (row.status == '1') {
                                    // sumSettlement: "1283"
                                    // tatalInvestment: "7402.02"

                                    var sAppropriate = row.tatalInvestmentBn;
                                    var sSettlement = row.sumSettlementBn;
                                    //
                                    var progress = (sSettlement / sAppropriate * 100).toFixed(2);
                                    var showprogress = 0;
                                    if (progress > 100) {
                                        showprogress = 100;
                                    }
                                    var progressHtml =
                                        `<div class="progress">
                                      <div class="progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="min-width: 3em; width: ${showprogress}%;">
                                        ${progress}%
                                      </div>
                                    </div>`;
                                    return progressHtml
                                }

                            }
                        },
                        {
                            field: "progress",
                            title: "总体进度(当月)",
                            width: 200,
                            align: 'center',
                            formatter: function(value, row, index) {
                                // sumSettlement: "1283"
                                // tatalInvestment: "7402.02"
                                if (row.status == '1') {
                                    var sAppropriate = row.tatalInvestment;
                                    var sSettlement = row.sumSettlement;
                                    //
                                    var progress = (sSettlement / sAppropriate * 100).toFixed(2);
                                    var showprogress = 0;
                                    if (progress > 100) {
                                        showprogress = 100;
                                    }
                                    var progressHtml =
                                        `<div class="progress">
                                      <div class="progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="min-width: 3em; width: ${showprogress}%;">
                                        ${progress}%
                                      </div>
                                    </div>`;
                                    return progressHtml
                                }
                            }
                        },
                        {
                            field: "status",
                            title: "状态",
                            align: 'center',
                            width: 100,
                            formatter: function(value, row, index) {
                                return getTypeStatus(value);
                            }

                        }


                    ],
                    onLoadSuccess: function() {

                    },
                    onLoadError: function() {
                        console.log("数据加载失败！");
                    },

                    onSort: function(name, order) {
                        console.log(name)
                        console.log(order)
                    }
                });


                /**
                 * 单击行打开
                 * @param row
                 * @param title
                 * @param view true|false
                 */
                function openRow(row, title, view) {
                    tools.toDialog({
                        name: "修改信息",
                        url: "modules/schedule/schedule_add.html",
                        param: { show: row },
                        btn: ['关闭'],
                        yes: function(obj, index, data) {

                            layer.close(index);
                        }
                    });

                }



                /*增加*/
                $("#btn_add").unbind("click").on("click", function() {
                    $.ajax({
                        url: `${resourceUrl}/selectKgsj`,
                        data: data,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        success: function(res) {
                            if (res != null) {
                                if (res == "0") {
                                    tools.toDialog({
                                        name: "添加项目信息",
                                        url: "modules/schedule/schedule_add.html",
                                        param: { add: true, projectId: projectId },
                                        btn: ['保存', '关闭'],
                                        yes: function(obj, index, data) {
                                            data.pjId = projectId;
                                            saveData(data);

                                            layer.close(index);
                                        }
                                    });
                                } else {
                                    layer.msg("请填写开工时间");
                                }
                            }
                        },
                        error: function(err) {

                        }
                    });
                });

                function saveData(data) {
                    //拿到项目状态
                    $.ajax({
                        url: `${resourceUrl}/save`,
                        data: data,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        success: function(data) {
                            if (data.success) {
                                //修改缓存里面的项目状态
                                $('#table').bootstrapTable('refresh');
                                selectBtl(projectId, '2019');
                                layer.msg("保存成功");
                            }

                        }
                    });
                }
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
                    var data = { "ids": ids };
                    layer.confirm("您确认要删除吗？", function(index, layero) {
                        $.ajax({
                            url: `${tools.API_URL}/schedule/scheduleManagement/deleteAll`,
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
                                selectBtl(projectId, '2019');
                            }
                        });
                    });
                });


                /**
                 * 修改
                 */
                $("#btn_edit").unbind("click").on("click", function() {
                    var obj = tableHasChoose($table)
                    if (obj != null) {
                        if (obj.length == 1) {
                            if (obj[0].status == "1") {
                                layer.msg("审核已通过，不能修改");
                            } else {
                                tools.toDialog({
                                    name: "修改信息",
                                    url: "modules/schedule/schedule_add.html",
                                    param: { edit: obj[0] },
                                    btn: ['保存', '关闭'],
                                    yes: function(obj, index, data) {
                                        editData(data);
                                        updateStatus(data.id);
                                        layer.close(index);
                                    }
                                });
                            }
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

                function editData(data) {
                    $.ajax({
                        url: `${tools.API_URL}/schedule/scheduleManagement/edit`,
                        data: data,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            layer.msg("修改成功");
                            $('#table').bootstrapTable('refresh');
                            selectBtl(projectId, '2019');
                        }
                    });
                }

                function updateStatus(id) {
                    data = {
                        id: id
                    }
                    $.ajax({
                        url: `${tools.API_URL}/schedule/scheduleManagement/updateStatus`,
                        data: data,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        success: function(res) {

                        },
                        error: function(err) {

                        }
                    });
                }


                var fatherId = "";
                //查询审核法人
                function selectFrId(id) {
                    data = {
                        id: id
                    }
                    $.ajax({
                        url: `${tools.API_URL}/schedule/scheduleManagement/selectFrId`,
                        data: data,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        success: function(res) {
                            if (res != null) {
                                fatherId = res.fatherId;
                            }

                        },
                        error: function(err) {

                        }
                    });
                }

                selectFrId(projectId);
                if (fatherId == userId || userId == "2e5d6abbc4744dd6b7fe688318efaaaa") {
                    $('#btn_sh').show();
                } else {
                    $('#btn_sh').hide();
                }

                /**
                 * 审核
                 */
                $("#btn_sh").unbind("click").on("click", function() {
                    var obj = tableHasChoose($table)
                    if (obj != null) {
                        if (obj.length == 1) {
                            if (obj[0].status == "1") {
                                layer.msg("审核已通过，无需审核");
                            } else {
                                // selectFrId(obj[0].pjId);
                                // if (fatherId == userId) {
                                tools.toDialog({
                                    name: "审核信息",
                                    url: "modules/schedule/schedule_sh.html",
                                    param: { edit: obj[0] },
                                    btn: ['保存', '关闭'],
                                    yes: function(obj, index, data) {
                                        editData(data);

                                        layer.close(index);
                                    }
                                });
                                // } else {
                                //     layer.msg("非指定法人不能审核");
                                // }
                            }
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

                function editData(data) {
                    $.ajax({
                        url: `${tools.API_URL}/schedule/scheduleManagement/edit`,
                        data: data,
                        type: 'post',
                        dataType: 'json',
                        success: function(data) {
                            layer.msg("修改成功");
                            $('#table').bootstrapTable('refresh');
                            // selectBtl(projectId, '2019');
                        }
                    });
                }

                selectBtl(projectId, '2019');

                function selectBtl(id, year) {

                    var data = {
                        year: year,
                        id: id
                    }
                    $.ajax({
                        url: `${resourceUrl}/selectBtl`,
                        data: data,
                        type: 'post',
                        async: false,
                        dataType: 'json',
                        success: function(res) {
                            $('#zt').text(res.state);
                            $('#jn').text(res.jn.toFixed(2));
                            $('#gj').text(res.jzqn.toFixed(2));
                            $('#ztz').text(res.ztz.toFixed(2));
                            $('#zbjy').text(res.zbjy.toFixed(2));
                            $('#jnBf').text(res.jnBf.toFixed(2));
                        },
                        error: function(err) {

                        }
                    })

                }

                /**
                 * 关闭弹窗 修改菜单栏
                 */
                function closeAndHandleNav(type, row) {
                    $table.bootstrapTable("refresh");
                    layer.closeAll()
                    tools.handleNavData();
                }
            }
        }
        return page;
    })