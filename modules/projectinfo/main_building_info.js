/*项目参建主体*/
define("modules/projectinfo/main_building_info",
    ["jquery", "layer", "underscore", "page/tools",
        "text!modules/projectinfo/iframs/main_buiding/main_building_info_form.html",
        "modules/projectinfo/utils", "bootstrap-table", "bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css"],
    function ($, layer, _, tools, templ_form) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                var projectData = getProjectData()
                if (projectData.project == null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                var unitType = "1";
                var action_type = "a";
                /*$("#tabs li").on("click", function () {
                    action_type = $(this).data("type")
                    unitType = $(this).data("unittype")
                    console.log(action_type)
                    buidTable($("#table_" + action_type))
                })*/
                buidTable("a")
                buidTable("b")
                buidTable("c")
                buidTable("d")
                buidTable("e")
                function getUnitType(action_type){
                    switch (action_type) {
                        case "a":return 1;
                        case "b":return 2;
                        case "c":return 3;
                        case "d":return 4;
                        case "e":return 5;
                        default:return 0;
                    }
                }
                function getActionType(unit){
                    switch (unit) {
                        case "1":return "a";
                        case "2":return "b";
                        case "3":return "c";
                        case "4":return "d";
                        case "5":return "e";
                        default:return 0;
                    }
                }
                /*构建table*/
                function buidTable(action_type) {
                    var $table = $("#table_"+action_type);
                    $table.bootstrapTable({
                        url: `${API_URL}/project_info/mainBuilding/dataList`,
                        contentType: "application/x-www-form-urlencoded",
                        method: "get",
                        height:250,
                        //toolbar: '#toolbar', //工具按钮用哪个容器
                        clickToSelect: false,
                        striped: true, //是否显示行间隔色
                        pageSize: 10,
                        pageNumber: 1,
                        pageList: "[5, 10, 25, 50, 100,ALL]",
                        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: true, //是否显示分页（*）
                        sortable: true, //是否启用排序
                        sortOrder: "asc", //排序方式
                        uniqueId: "id",
                        sidePagination: "server", //分页方式：client 客户端分页，server 服务端分页（*）
                        queryParams: function (params) { //请求服务器发送的参数
                            var searchParam = dataFormObj("#search_form_"+action_type);
                            searchParam.pjId=pjId;
                            searchParam.unitType=getUnitType(action_type);
                            searchParam.sessionid=sessionStorage.getItem("sessionid");
                            searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                            searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                            searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;

                            return searchParam;
                        },
                        /*responseHandler: function (res) {
                            var data = res.rows;
                            return data;
                        },*/
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
                                field: "identity", title: "职责岗位"
                                , formatter: function (value, row, index) {
                                    switch (row.unitType +"-"+row.identity) {
                                        case "1-1":
                                            return "项目经理";
                                        case "1-2":
                                            return "技术负责人";
                                        case "1-3":
                                            return "施工员";
                                        case "1-4":
                                            return "安全员";
                                        case "1-5":
                                            return "质检员";
                                        case "1-6":
                                            return "材料员";
                                        case "1-7":
                                            return "造价员";
                                        case "2-1":
                                            return "项目法人代表";
                                        case "2-2":
                                            return "项目法人驻工地代表";
                                        case "3-1":
                                            return "总监理工程师";
                                        case "3-2":
                                            return "监理工程师";
                                        case "4-1":
                                            return "设计总工";
                                        case "4-2":
                                            return "设计代表";
                                        case "5-1":
                                            return "质量监督人员";
                                        default :
                                            return "--"
                                    }
                                }
                            },
                            {field: "name", title: "人员姓名"
                            },
                            {field: "idCard", title: "身份证号"
                            },
                            {
                                field: "sex", title: "性别",
                                formatter: function (value, row, index) {
                                    switch (value) {
                                        case "0":
                                            return "女";
                                        case "1":
                                            return "男";
                                        default :
                                            return "--";

                                    }
                                }
                            },
                            {field: "title", title: "职称"
                            },
                            {field: "qNo", title: "资格证书号"
                            },
                            {field: "rNo", title: "注册证书号"
                            },
                            {field: "status", title: "是否启用"
                                ,formatter: function (value, row, index) {
                                    switch (value) {
                                        case "0":
                                            return "已废弃";
                                        case "1":
                                            return "已启用";
                                        default :
                                            return "--";

                                    }
                                 }
                            },
                            {field: "remark", title: "备注"}
                        ],
                        onLoadSuccess: function () {
                        },
                        onLoadError: function () {
                            console.log("数据加载失败！");
                        },
                        onClickRow: function (row) {
                            //console.log(row);
                            openRow(row)
                        },
                        onSort: function (name, order) {
                            console.log(name)
                            console.log(order)
                        }
                    });

                }
                //查询
                $(".btn_search").on("click",function () {
                    action_type = $(this).data("action");
                    unitType = $(this).data("unit");
                    $("#table_"+action_type).bootstrapTable("refresh")
                })
                //启用/废弃
                $(".is-start-using").on("click",function () {
                    action_type = $(this).data("action");
                    unitType = $(this).data("unit");
                    var objs = tableHasChoose($("#table_"+action_type))
                    if (!objs)return;
                    var ids = [];
                    for (var obj of objs){
                        ids.push(obj.id)
                    }
                    var status = $(this).data("status");
                    $.api.projectInfo.mainBuilding.status.exec({
                        status:status,
                        ids:ids
                    },function (re) {
                        $("#table_"+action_type).bootstrapTable("refresh")
                        layer.msg(re.msg)
                    })
                })
                //删除
                $(".btn_delete").on("click",function () {
                    action_type = $(this).data("action");
                    unitType = $(this).data("unit");
                    deleteConfirm($("#table_"+action_type),function (objs) {
                        var ids = [];
                        for (var obj of objs){
                            ids.push(obj.id)
                        }
                        $.api.projectInfo.mainBuilding.delete.exec({
                            ids:ids
                        },function (re) {
                            $("#table_"+action_type).bootstrapTable("refresh")
                            layer.msg(re.msg)
                        })
                    })


                })
                /**
                 * 新增/编辑
                 */
                $('.open_form').on('click', function () {
                    action_type = $(this).data("action");
                    unitType = $(this).data("unit");
                    //获取data里面的数据
                    var type = $(this).data("type");
                    var obj;
                    if(type=="edit"||type=="view"){
                        obj = tableHasOneChoose($("#table_"+action_type))
                        if (!obj)return;
                    }
                    var title = $(this).data("title");
                    var unit = unitType;
                    var $html = _.template(templ_form)();
                    tools.handleModal({
                        eleId: '#form',
                        title: title,
                        url: "modules/projectinfo/iframs/main_buiding/main_building_info_form.html",
                        area: ['70%', '60%'],
                        template: $html,
                        param: {
                            data: {
                                type: type,
                                unit: unit,
                                row:obj
                            }
                        },
                        btn: ['确定', '关闭'],
                        yes: function (obj, index, data) {
                            data.pjId = pjId;
                            data.unitType = unitType;
                            if (type=="add"){
                                data.isNewRecord = true;
                            }
                            $.api.projectInfo.mainBuilding.edit.exec( data,
                                function (re) {
                                    $("#table_"+action_type).bootstrapTable("refresh")
                                    layer.closeAll()
                                    layer.msg(re.msg)
                                }
                            )
                        }
                    });
                });
                function openRow(row) {
                    unitType = row.unitType;
                    action_type = getActionType(unitType);
                    //获取data里面的数据
                    var type = "edit";
                    var obj = row;
                    var title = "参建主体";
                    var unit = unitType;
                    var $html = _.template(templ_form)();
                    tools.handleModal({
                        eleId: '#form',
                        title: title,
                        url: "modules/projectinfo/iframs/main_buiding/main_building_info_form.html",
                        area: ['70%', '60%'],
                        template: $html,
                        param: {
                            data: {
                                type: type,
                                unit: unit,
                                row:obj
                            }
                        },
                        btn: ['确定', '关闭'],
                        yes: function (obj, index, data) {
                            data.pjId = pjId;
                            data.unitType = unitType;
                            if (type=="add"){
                                data.isNewRecord = true;
                            }
                            $.api.projectInfo.mainBuilding.edit.exec( data,
                                function (re) {
                                    $("#table_"+action_type).bootstrapTable("refresh")
                                    layer.closeAll()
                                    layer.msg(re.msg)
                                }
                            )
                        }
                    });
                }


            }
        }
        return page;
    });