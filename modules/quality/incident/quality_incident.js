/**
 * 质量管理=》质量缺陷/事故管理
 */
define("modules/quality/incident/quality_incident",
    ["jquery", "underscore", "page/tools","layer",
        "text!modules/quality/incident/incidentAccident_add.html",
        "text!modules/quality/incident/incidentDefect_add.html",
        "modules/projectinfo/utils"
    ],
    function ($, _, tools,layer,tmpl,tmpl1) {
        var page = function () { };
        page = {
            init: function () {
                tools.setNavData(1);
                var projectData = getProjectData()
                var loginName = tools.getLoginName();

                /**
                 * 获取相关项目信息
                 */
                var project = projectData.project;
                var city = projectData.city ;
                var country = projectData.county;

                $('#example').bootstrapTable({
                        url:  `${API_URL}/qa/qaIncident/dataList`,
                        method: "get",
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
                        queryParams: function () { //请求服务器发送的参数
                            var deptId ;
                            if (city){
                                deptId = city.id;
                            }
                            if(country){
                                deptId = country.id;
                            }
                            return {
                                pageSize :-1,
                                deptId:deptId,
                                pjId:project.id
                            }
                        },
                        responseHandler: function (res) {
                            return res.rows;
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
                                width: 1000,
                                formatter: function (value, row, index) {
                                    return index + 1;
                                }
                            },
                            {
                                field: "incdName",
                                title: "事故名称",
                                width: 1000
                            },
                            {
                                field: "occurrenceSite",
                                title: "事故部位",
                                width: 1000
                            },
                            {
                                field: "incdDetail",
                                title: "事故描述",
                                width: 1000
                            },
                            {
                                field: "incdType",
                                title: "事故类型",
                                width: 1000,
                                formatter:function (value,row,index) {
                                    if (value=='1'){
                                        return '一般质量事故';
                                    }else if (value=='2') {
                                        return '较大质量事故';
                                    }else if (value=='3') {
                                        return '重大质量事故';
                                    }else if (value=='4') {
                                        return '特大质量事故';
                                    }
                                }
                            },
                            {
                                field: "reportDate",
                                title: "上报时间",
                                width: 1000,
                                formatter: function (value, row, index) {
                                    return value ? new Date(value).format('yyyy-MM-dd') : value;
                                }
                            },
                            {
                                field: "processDate",
                                title: "处理时间",
                                width: 1000,
                                formatter: function (value, row, index) {
                                    return value ? new Date(value).format('yyyy-MM-dd') : value;
                                }
                            },
                            {
                                field: "isPrcs",
                                title: "完成处理",
                                width: 1000,
                                formatter:function (value,row,index) {
                                    debugger;
                                    if (value == '1') {
                                        return '是';
                                    } else {
                                        return '否';
                                    }
                                }
                            }
                        ],
                        onLoadSuccess: function () {

                        },
                        onLoadError: function () {
                        },
                        onClickRow:function (row) {
                            var $html = _.template(tmpl)({
                                data:row
                            });
                            tools.handleModal({
                                eleId: '#qualityForm',
                                url:  "modules/quality/incident/incidentAccident_add.html",
                                template: $html,
                                param: {
                                    show: {
                                        data: row,
                                        show:true
                                    }
                                },
                                btn: ['关闭'],
                                yes: function () {
                                    layer.closeAll();
                                }
                            });
                        }
                    });
                /**
                 * 事故新增
                 */
                $('#btn_add').off('click').on('click', function () {
                    //有附件上传，请获取uuid
                    var uuid = tools.getUUID();
                    var title = $(this).data("title");
                    var $html = _.template(tmpl)({
                        data:null
                    });
                    tools.handleModal({
                        title: title,
                        eleId: '#qualityForm',
                        url: "modules/quality/incident/incidentAccident_add.html",
                        area: ['80%', '90%'],
                        template: $html,
                        param: {
                            add: {
                                uuid: uuid
                            }
                        },
                        btn: ['保存', '关闭'],
                        yes: function (obj, index, data) {
                            data.id = uuid;
                            data.pjId = projectData.project.id;
                            data.isNewRecord = true;
                            addAccident(data);
                        }
                    });
                });

                /**
                 *  删除
                 */

                $('#btn_delete').on('click', function () {
                    var $table = ($('#example'));
                    deleteConfirm($table,function (objs) {
                        var ids = '';
                        for (var i = 0 ;i<objs.length;i++){
                            if(i == objs.length-1){
                                ids+=objs[i].id;
                            }else{
                                ids = ids + objs[i].id + ',';
                            }
                        }
                        $.api.qa.qaIncident.delflag.exec({
                            ids:ids
                        },function (re) {
                            layer.msg(re.msg);
                            if (re.success){
                                objs.forEach(function (_this, index) {
                                })
                            }
                            $table.bootstrapTable('refresh');
                        });
                    });

                });

                function addAccident(data) {
                    $.api.qa.qaIncident.add.exec(data,function (res) {
                        if (res.success){
                            layer.closeAll();
                            $("#example").bootstrapTable('refresh');
                        }
                        layer.msg(res.msg)
                    },'POST');
                }

                $('#exampleOne').bootstrapTable({
                    url: `${API_URL}/qa/qaDefects/dataList`,
                    method: "get",
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
                    queryParams: function () { //请求服务器发送的参数
                        var deptId ;
                        if (city){
                            deptId = city.id;
                        }
                        if(country){
                            deptId = country.id;
                        }
                        return {
                            pageSize :-1,
                            deptId:deptId,
                            pjId:project.id
                        }
                    },
                    responseHandler: function (res) {
                        return res.rows;
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
                            width: 1000,
                            formatter: function (value, row, index) {
                                return index + 1;
                            }
                        },
                        {
                            field: "defName",
                            title: "缺陷名称",
                            width: 1000
                        },
                        {
                            field: "occurrenceSite",
                            title: "缺陷部位",
                            width: 1000
                        },
                        {
                            field: "defDetail",
                            title: "缺陷描述",
                            width: 1000
                        },
                        {
                            field: "defType",
                            title: "缺陷类别",
                            width: 1000,
                            formatter:function (value,row,index) {
                                if (value=='1'){
                                    return '轻微缺陷';
                                }else if (value=='2') {
                                    return '一般缺陷';
                                }else if (value=='3') {
                                    return '严重缺陷';
                                }else if (value=='4') {
                                    return '致命缺陷';
                                }
                            }
                        },
                        {
                            field: "reportDate",
                            title: "上报时间",
                            width: 1000,
                            formatter: function (value, row, index) {
                                return value ? new Date(value).format('yyyy-MM-dd') : value;
                            }
                        },
                        {
                            field: "processDate",
                            title: "处理时间",
                            width: 1000,
                            formatter: function (value, row, index) {
                                return value ? new Date(value).format('yyyy-MM-dd') : value;
                            }
                        },
                        {
                            field: "isPrcs",
                            title: "完成处理",
                            width: 1000,
                            formatter:function (value,row,index) {
                                if (value == '1') {
                                    return '是';
                                } else {
                                    return '否';
                                }
                            }
                        }
                    ],
                    onLoadSuccess: function () {

                    },
                    onLoadError: function () {
                    },
                    onClickRow:function (row) {
                        var $html = _.template(tmpl1)({
                            data:row
                        });
                        tools.handleModal({
                            eleId: '#qualityForm',
                            url:  "modules/quality/incident/incidentDefect_add.html",
                            template: $html,
                            param: {
                                show: {
                                    data: row,
                                    show:true
                                }
                            },
                            btn: ['关闭'],
                            yes: function () {
                                layer.closeAll();
                            }
                        });
                    }
                });



                /**
                 * 缺陷新增
                 */
                $('#btn_add1').off('click').on('click', function () {
                    //有附件上传，请获取uuid
                    var uuid = tools.getUUID();
                    var title = $(this).data("title");
                    var $html = _.template(tmpl1)({
                        data:null
                    });
                    tools.handleModal({
                        title: title,
                        eleId: '#qualityForm',
                        url: "modules/quality/incident/incidentDefect_add.html",
                        area: ['80%', '90%'],
                        template: $html,
                        param: {
                            add: {
                                uuid: uuid
                            }
                        },
                        btn: ['保存', '关闭'],
                        yes: function (obj, index, data) {
                            data.id = uuid;
                            data.pjId = projectData.project.id;
                            data.isNewRecord = true;
                            addDefect(data);
                        }
                    });
                });

                /**
                 *  删除
                 */

                $('#btn_delete1').on('click', function () {
                    var $table = ($('#exampleOne '));
                    deleteConfirm($table,function (objs) {
                        var ids = '';
                        for (var i = 0 ;i<objs.length;i++){
                            if(i == objs.length-1){
                                ids+=objs[i].id;
                            }else{
                                ids = ids + objs[i].id + ',';
                            }
                        }
                        $.api.qa.qaDefects.delflag.exec({
                            ids:ids
                        },function (re) {
                            layer.msg(re.msg);
                            if (re.success){
                                objs.forEach(function (_this, index) {
                                })
                            }
                            $table.bootstrapTable('refresh');
                        });
                    });
                });

                function addDefect(data) {
                    $.api.qa.qaDefects.add.exec(data,function (res) {
                        if (res.success){
                            layer.closeAll();
                            $("#exampleOne").bootstrapTable('refresh');
                        }
                        layer.msg(res.msg)
                    },'POST');
                }

            }
        };
        return page
    });
