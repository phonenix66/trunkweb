/*招、投标*/
define("modules/projectinfo/for_bidding",
    ["jquery", "layer", "page/tools", "underscore",
        "text!modules/projectinfo/iframs/bidding/form_sjdw.html",
        "text!modules/projectinfo/iframs/bidding/form_jldw.html",
        "text!modules/projectinfo/iframs/bidding/form_sgdw.html",
        "text!modules/projectinfo/iframs/bidding/form_qtdw.html",
        "bootstrap-datepicker", "bootstrap-table", "bootstrap-fileinput-locale-zh",
        "modules/projectinfo/utils",
        "css!/css/projectinfo.css"],
    function ($, layer, tools, _, temp_sjdw, temp_jldw, temp_sgdw, temp_qtdw) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                //$('.datepicker').datepicker();
                //$(".form").hide()
                var projectData = getProjectData()
                if (projectData.project == null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;

                tools.getDictValue(dictTypeIdEnum.bidWay)
                /**
                 * 初始化表格
                 */
                var clumns_a = [
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
                        field: "phaseName", title: "标段名称"
                    },
                    {
                        field: "bidWay", title: "招标办法"
                        , formatter: function (value, row, index) {
                            return fitDictName(dictTypeIdEnum.bidWay, value)
                        }
                    },
                    {
                        field: "agency", title: "代理机构"
                    },
                    {field: "aptitude", title: "资质"},
                    {
                        field: "bidExpert", title: "评标专家"
                    },
                    {
                        field: "postDate", title: "招标公告发布日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value)
                        }
                    },
                    {
                        field: "bidder", title: "中标人"
                    },
                    {
                        field: "bidDate", title: "中标日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value)
                        }
                    },
                    {
                        field: "bidMoney", title: "中标金额（万元）",align:"right"
                        ,formatter: function (value) {
                            return value.toFixed(2);
                        }
                    },
                ]
                var clumns_b = [
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
                        field: "phaseName", title: "标段名称"
                    },
                    {
                        field: "bidWay", title: "招标办法"
                        , formatter: function (value, row, index) {
                            return fitDictName(dictTypeIdEnum.bidWay, value)
                        }
                    },
                    {
                        field: "agency", title: "代理机构"
                    },
                    {field: "aptitude", title: "资质"},
                    {
                        field: "bidExpert", title: "评标专家"
                    },
                    {
                        field: "postDate", title: "招标公告发布日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value);
                        }
                    },
                    {
                        field: "bidder", title: "中标人"
                    },
                    {
                        field: "bidDate", title: "中标日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value)
                        }
                    },
                    {
                        field: "bidMoney", title: "中标金额（万元）",align:"right"
                        ,formatter: function (value) {
                            return value.toFixed(2);
                        }
                    },
                ]
                var clumns_c = [
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
                        field: "phaseName", title: "标段名称"
                    },
                    {field: "agency", title: "代理机构"},
                    {field: "bidExpert", title: "评标专家"},
                    {field: "bidder", title: "中标人"},
                    {
                        field: "bidMoney", title: "中标金额（万元）",align:"right"
                        ,formatter: function (value) {
                            return value.toFixed(2);
                        }
                    },
                    {
                        field: "postDate", title: "招标公告发布日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value);
                        }
                    },
                ]
                var clumns_d = [
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
                        field: "phaseName", title: "标段名称"
                    },
                    {field: "deviceName", title: "设备名称"},
                    {field: "agency", title: "代理机构"},
                    {field: "bidExpert", title: "评标专家"},
                    {field: "bidder", title: "中标人"},
                    {
                        field: "bidMoney", title: "中标金额（万元）",align:"right"
                        ,formatter: function (value) {
                            return value.toFixed(2);
                        }
                    },
                    {
                        field: "postDate", title: "招标公告发布日期",
                        formatter: function (value, row, index) {
                            return fitDateStr(value);
                        }
                    },
                ]
                var action_type = "a";
                var unit_type = "1";
                var tabTitle = "设计单位";
                $("#tabs a").on("click", function () {
                    action_type = $(this).data("type")
                    unit_type = $(this).data("unittype")

                    tabTitle = $(this).text()
                    buildTable()
                })
                /**
                 * tab项选择
                 */
                /*新增*/
                $(".btn_add").on("click", function () {
                    console.log(action_type)
                    var title = "新增 " + tabTitle + " 招、投标信息"
                    var type = $(this).data("tab")
                    var $html = _.template(getTempl(action_type))()
                    openForm(title, type, $html, function (data) {
                        data.pjId = pjId,
                            data.bidType = unit_type,
                            data.isNewRecord = true,
                            // data.bidMoney=data.bidMoney*10000,
                            $.api.projectInfo.bid.edit.exec(data, function (re) {
                                buildTable()
                                if (re.success) layer.closeAll()
                                layer.msg(re.msg)
                            })
                    })
                })
                /*修改*/
                $(".btn_edit").on("click", function () {
                    var obj = tableHasOneChoose($("#table_" + action_type));
                    if (!obj) return;
                    var title = "修改 " + tabTitle + " 招、投标信息"
                    var type = $(this).data("tab")
                    var $html = _.template(getTempl(action_type))()
                    openForm(title, type, $html, function (data) {
                        data.pjId = pjId,
                            data.bidType = unit_type,
                            data.isNewRecord = false,
                            // data.bidMoney=data.bidMoney*10000,
                            $.api.projectInfo.bid.edit.exec(data, function (re) {
                                buildTable()
                                if (re.success) layer.closeAll()
                                layer.msg(re.msg)
                            })
                    }, obj)
                })
                $(".btn_view").on("click", function () {
                    var obj = tableHasOneChoose($("#table_" + action_type));
                    if (!obj) return;
                    var title = "查看 " + tabTitle + " 招、投标信息"
                    var type = $(this).data("tab")
                    var $html = _.template(getTempl(action_type))()
                    openForm(title, type, $html, function (data) {
                                layer.closeAll()
                    }, obj,true)
                })
                /*删除*/
                $(".btn_delete").on("click", function () {
                    deleteConfirm($("#table_" + action_type),function (objs) {
                        var ids = []
                        for (var obj of objs) {
                            ids.push(obj.id)
                        }
                        $.api.projectInfo.bid.delete.exec({ids: ids}, function (re) {
                            layer.msg(re.msg)
                            buildTable()
                        })
                    })

                })
                /*查询*/
                $(".btn_search").on("click", function () {
                    buildTable()
                })
                /*下载扫描件*/
                $(".btn_down").on("click", function () {
                    var objs = tableHasChoose($("#table_" + action_type));
                    if (!objs) return;
                    console.log(objs)
                })

                /**
                 * 弹窗
                 * @param title 标题
                 * @param type 类型
                 * @param $html 模板
                 * @param fun(data) 回调
                 */
                function openForm(title, type, $html, fun, row,view) {
                    tools.handleModal({
                        title: title,
                        template: $html,
                        area: ["70%", "80%"],
                        url: getTemplUrl(action_type),
                        eleId: "#form",
                        param: {
                            type: type,
                            row: row,
                            view:view
                        },
                        btn: ["保存", "关闭"],
                        yes: function (obj, index, data) {
                            fun(data)
                            layer.closeAll()
                        }
                    })
                }

                /**获取列表标题*/
                function getClumns(to) {
                    switch (to) {
                        case "a":
                            return clumns_a;
                        case "b":
                            return clumns_b;
                        case "c":
                            return clumns_c;
                        case "d":
                            return clumns_d;
                        default :
                            return clumns_a;
                    }
                }

                /**获取模板*/
                function getTempl(to) {
                    switch (to) {
                        case "a":
                            return temp_sjdw;
                        case "b":
                            return temp_jldw;
                        case "c":
                            return temp_sgdw;
                        case "d":
                            return temp_qtdw;
                        default :
                            return null;
                    }
                }

                /**获取模板URL*/
                function getTemplUrl(to) {
                    switch (to) {
                        case "a":
                            return "modules/projectinfo/iframs/bidding/form_sjdw.html";
                        case "b":
                            return "modules/projectinfo/iframs/bidding/form_jldw.html";
                        case "c":
                            return "modules/projectinfo/iframs/bidding/form_sgdw.html";
                        case "d":
                            return "modules/projectinfo/iframs/bidding/form_qtdw.html";
                        default :
                            return null;
                    }
                }

                /**
                 *
                 * @param data 数据
                 */
                function buildTable() {
                    // action_type 活动tab 刷新
                    var param = dataFormObj("#search_form_" + action_type)
                    param.pjId = pjId,
                        param.bidType = unit_type,
                        $.api.projectInfo.bid.dataList.exec(param, function (res) {
                            if (!res.success) layer.msg(res.msg)
                            var data = res.data;
                            buildSampleTable($("#dataTable_" + action_type)
                                .html('<table id="table_' + action_type + '"></table>').find('table'), data, getClumns(action_type))
                        })
                }

                buildTable()
            }
        }
        return page;
    });