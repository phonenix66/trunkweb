/*总览*/
define("modules/projectinfo/overview",
    ["jquery", "page/tools", "underscore",
        "text!modules/projectinfo/iframs/overview/form.html",
        "bootstrap-table-zh-CN", "modules/projectinfo/utils",
        "css!/css/projectinfo.css"
    ],
    function ($, tools, _, templ) {
        var page = function () {};
        page = {
            init: function (request) {
                tools.setNavData(2)
                var projectData = getProjectData()
                var project = projectData.project;
                var city = projectData.city;
                var county = projectData.county;
                var $table = $('#table');
                //流域下拉框
                // tools.getDictValue(dictTypeIdEnum.watershed, "watershed")
                //项目状态下拉框
                tools.getDictValue(dictTypeIdEnum.pjStatus, "pjStatus")
                //项目类型下拉框
                tools.getDictValue(dictTypeIdEnum.pjType, "pjType")
                tools.getDictValue(dictTypeIdEnum.fundsProvided)
                tools.getDictValue(dictTypeIdEnum.nature)
                tools.getDictValue(dictTypeIdEnum.statistic)
                /**
                 * table显示
                 */
                var tableURL = `${API_URL}/project_info/overview/dataList`
                $table.bootstrapTable({
                    height: $("body").height()-185,
                    url: tableURL,
                    method: "get",
                    // toolbar: '', //工具按钮用哪个容器
                    clickToSelect: false,
                    singleSelect: false,
                    striped: true, //是否显示行间隔色
                    pageSize: 50,
                    pageNumber: 1,
                    pageList:"[10, 25, 50, 100, ALL]",
                    dataType: "json",
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, //是否显示分页（*）
                    sortable: true, //是否启用排序
                    sortOrder: "asc", //排序方式
                    uniqueId: "id",
                    sidePagination: "client", //分页方式：client 客户端分页，server服务端分页（*）
                    queryParams: function (params) { //请求服务器发送的参数
                        var searchParam = dataFormObj("#search_form")
                        console.log(projectData)
                        if (city) {
                            searchParam.deptId = city.id
                        }
                        if (county) {
                            searchParam.deptId = county.id
                        }
                        if (project){
                            searchParam.id = project.id
                        }
                        searchParam.sessionid = sessionStorage.getItem("sessionid")
                        searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                        searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                        searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                        return searchParam;
                    },
                     responseHandler: function (res) {
                         var data = res.rows;
                         if (!data){
                             data = {rows:[]}
                             return data;
                         }
                         statistics(res)
                         return data;
                     },
                    onClickRow:function(row){
                        var view = false;
                        openRow(row,"项目信息",view)
                    },
                    columns: [
                        {
                        title: "全选",
                        checkbox: true,
                        visible: true
                    },
                        {
                            title: '序号',
                            field: '',
                            formatter: function (value, row, index) {
                                return index + 1;
                            }
                        },

                        {
                            field: "pjName",
                            sortable: true,
                            width:200,
                            title: "项目名称"
                        },
                        {
                            field: "pjType",
                            title: "项目类型",
                            sortable: true,
                            formatter: function (value, row, index) {
                                return fitDictName(dictTypeIdEnum.pjType, value)
                            }
                        },
                        {
                            field: "departmentName",
                            sortable: true,
                            title: "主管单位"
                        },
                        {
                            field: "corporateName",
                            sortable: true,
                            title: "项目法人"
                        },
                        {
                            field: "corporateDeptName",
                            sortable: true,
                            title: "法人单位"
                        },
                        {
                            field: "planStartDate",
                            sortable: true,
                            title: "计划开始时间"
                            ,formatter: function (value, row, index) {
                                return fitDateStr(value)
                            }
                        },
                        {
                            field: "planEndDate",
                            sortable: true,
                            title: "计划结束时间"
                            ,formatter: function (value, row, index) {
                                return fitDateStr(value)
                            }
                        },
                        {
                            field: "fundsProvided",
                            title: "资金来源",
                            sortable: true,
                            formatter: function (value, row, index) {
                                return fitDictName(dictTypeIdEnum.fundsProvided, value)
                            }
                        },
                        {
                            field: "stateInvestment",
                            sortable: true,
                            align:"right",
                            width:50,
                            title: "国家投资（万元）"
                            ,
                            formatter: function (value, row, index) {
                                if (value) {
                                    return value.toFixed(2);
                                }else {
                                    return ;
                                }
                            }
                        },
                        {
                            field: "totalInvestment",
                            sortable: true,
                            align:"right",
                            width:50,
                            title: "合同金额（万元）"
                            ,
                            formatter: function (value, row, index) {
                                return value.toFixed(2);
                            }
                        },
                        {
                            field: "cumulativeAllocated",
                            sortable: true,
                            align:"right",
                            title: "累计拨付(万元)"
                            ,formatter: function (value, row, index) {
                                return value.toFixed(2);
                            }
                        },
                        {
                            field: "cumulativeUsed",
                            sortable: true,
                            align:"right",
                            title: "累计完成(万元)"
                            ,formatter: function (value, row, index) {
                                return value.toFixed(2);
                            }
                        },
                        {
                            field: "progress",
                            title: "进度",
                            sortable: true,
                            width:200,
                            formatter: function (value, row, index) {
                                var progressHtml =
                                    `<div class="progress" style="background-color: darkgray;">
                                      <div class="progress-bar" role="progressbar" aria-valuenow="${value}" aria-valuemin="0" aria-valuemax="100" style="padding-left: 5px;text-align:left;width: ${value}%;">
                                        ${value}%
                                      </div>
                                    </div>
                                    `;
                                return progressHtml
                            }
                        },
                        {
                            field: "进度状态",
                            title: "进度状态",
                            sortable: true,
                            formatter: function (value, row, index) {
                                return fitDictName(dictTypeIdEnum.pjStatus, value)
                            }
                        },
                        {
                            field: "pjStatus",
                            title: "项目状态",
                            sortable: true,
                            formatter: function (value, row, index) {
                                var img = `<img src="images/project-info/pjstatus${value}.png">&nbsp`;
                                return img + fitDictName(dictTypeIdEnum.pjStatus, value)
                            }
                        },

                        /*{
                            field: "statistic",
                            title: "统计类型",
                            sortable: true,
                            formatter: function (value, row, index) {
                                return fitDictName(dictTypeIdEnum.statistic, value)
                            }
                        },*/

                        /*{
                            field: "city",
                            title: "所属地址",
                            sortable: true,
                            formatter: function (value, row, index) {
                                var addrss = Boolean(row.address) ? row.address : "";
                                var city = Boolean(row.city) ? row.city : "";
                                var country = Boolean(row.country) ? row.country : "";
                                return "西藏 " + city + " " + country + " " + addrss
                            }
                        },*/
                        /*{
                            field: "watershed",
                            title: "流域",
                            sortable: true,
                            formatter: function (value, row, index) {
                                return fitDictName(dictTypeIdEnum.watershed, value)
                            }
                        },*/
                        /*{
                            field: "scale",
                            sortable: true,
                            title: "建设规模"
                        },*/
                        /*{
                            field: "content", sortable: true, title: "建设内容"
                            , formatter: function (value, row, index) {
                                return "巩固提升0.361万农牧民饮水安全，其中解决0.0126万农村学校师生的饮水安全问题。";
                            }
                        },*/
                    ],
                    onSort: function (name, order) {
                        console.log(name)
                        console.log(order)
                    }
                });
                //统计信息
                function statistics(res) {
                    var t_html =
                        `<div style="display: inline;padding-left: 10px;">
<b>KPI指标：</b>
共有项目<span class="red"> ${res.total} </span>个，其中在建项目<span class="red"> ${res.building} </span>个，
未开工项目<span class="red"> ${res.noBuild} </span>个，进度滞后项目<span class="red"> ${res.lagging} </span>个；
总投资<span class="red"> ${res.totalInvestment} </span>万元，累计完成投资<span class="red"> ${res.cumulativeAllocated} </span>万元。
                    </div>`
                    $("#statistics").html(t_html)
                }
                /*****************table结束****************/

                /*增加*/
                $("#btn_add").on("click", function () {
                    var title = $(this).data("title");
                    var type = $(this).data("type");
                    var $html = _.template(templ)();
                    openForm(title, type, $html, function (data) {
                        console.log(data)
                        $.api.projectInfo.overview.add.exec(data,
                            function (re) {
                                if (re.success) {
                                    closeAndHandleNav("add", data)
                                }
                                layer.msg(re.msg)
                            })

                    });
                });
                /*修改*/
                $("#btn_edit").on("click", function () {
                    var obj = tableHasOneChoose($table)
                    if (!obj) return;
                    var title = $(this).data("title");
                    var type = $(this).data("type");
                    var $html = _.template(templ)();
                    openForm(title, type, $html, function (data) {
                        console.log(data)
                        $.api.projectInfo.overview.update.exec(data, function (re) {
                            if (re.success) {
                                closeAndHandleNav("edit", data)
                            }
                            layer.msg(re.msg)
                        })
                    }, obj);
                });

                /**
                 * 单击行打开
                 * @param row
                 * @param title
                 * @param view true|false
                 */
                function openRow(row,title,view){
                    var $html = _.template(templ)();
                    openForm(title, "edit", $html, function (data) {
                        console.log(data)
                        $.api.projectInfo.overview.update.exec(data, function (re) {
                            if (re.success) {
                                closeAndHandleNav("edit", data)
                            }
                            layer.msg(re.msg)
                        })
                    }, row,view);
                }
                $("#btn_view").on("click", function () {
                    var obj = tableHasOneChoose($table)
                    if (!obj) return;
                    var title = $(this).data("title");
                    var type = $(this).data("type");
                    var $html = _.template(templ)();
                    openForm(title, type, $html, function (data) {
                        layer.closeAll()
                    }, obj, true);
                });
                /*删除*/
                $("#btn_delete").on("click", function () {
                    deleteConfirm($table, function (objs) {
                        var ids = [];
                        for (obj of objs) {
                            ids.push(obj.id)
                        }
                        $.api.projectInfo.overview.delflag.exec({
                            ids: ids
                        }, function (re) {
                            layer.msg(re.msg)
                            if (re.success) {
                                objs.forEach(function (_this, index) {
                                    tools.handleNavData()
                                })
                            }
                            $table.bootstrapTable('refresh');
                        })


                    })

                });

                /*条件搜索*/
                $("#btn_search").on("click", function () {
                    $table.bootstrapTable("refresh");
                });
                $("#pjName").on("input", function () {
                    $table.bootstrapTable("refresh");
                });
                /*导出*/
                $("#btn_export").on("click", function () {
                    var searchParam = dataForm("#search_form") + "&excelPost=1&deptId=";
                    var deptId;
                    if (city) {
                        deptId = city.id
                    }
                    if (county) {
                        deptId = county.id
                    }
                    if (deptId) searchParam += deptId;
                    if (project) {
                        searchParam += "&id="+ project.id
                    }
                    window.open(tableURL + "?" + searchParam+"&sessionid="+sessionStorage.getItem("sessionid"))
                });

                /**
                 * 弹窗
                 * @param title 标题
                 * @param $html 模板
                 * @param fun(data) 回调
                 */
                function openForm(title, type, $html, fun, row, view) {
                    tools.handleModal({
                        title: title,
                        template: $html,
                        area: ["80%", "80%"],
                        url: "modules/projectinfo/iframs/overview/form.html",
                        eleId: "#send_form",
                        param: {
                            type: type,
                            row: row,
                            view: view
                        },
                        btn: ["确定", "关闭"],
                        yes: function (obj, index, data) {
                            fun(data);
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

    });
