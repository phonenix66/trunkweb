/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/zlqxysg/zlqxysg", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').show();
            var loginName = tools.getLoginName();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);


            $('#elyMang').bootstrapTable({
                // url: tools.API_URL+"/dw/zlgl/getZlgl",
                url: "modules/statistics/zlqxysg/data.json",
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                pageList: [50, 100],
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数
                    var searchParam = {dictTypeId:'101'};
                    searchParam.sessionid = sessionStorage.getItem("sessionid")
                    searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                    searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                    searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                    return searchParam;
                },
                // sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                responseHandler:function(res){
                    return res.rows;
                }, columns: [
                    [
                        {
                            field: "slgctjb",
                            title: "水利工程建设项目质量举报投诉、缺陷和事故处理情况统计表",
                            colspan:12,
                            valign:'middle',
                            align:'center'
                        }
                    ],
                    [
                        {
                            title: '序号',
                            field: '',
                            formatter: function (value, row, index) {
                                return index+1;
                            },
                            rowspan:2,
                            colspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "xmmc",
                            title: "项目名称",
                            rowspan:2,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "gczljbtssl",
                            title: "工程质量举报投诉受理",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "gczlqx",
                            title: "工程质量缺陷",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "gczlsgcl",
                            title: "工程质量事故处理",
                            rowspan:1,
                            colspan:4,
                            valign:'middle',
                            align:'center'
                        }

                    ],
                    [
                        {
                            field: "tssl",
                            title: "受理（起）",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "tsycl",
                            title: "已处理（起",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "tsclz",
                            title: "处理中（起）",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },{
                            field: "qxg",
                            title: "个",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "qxycl",
                            title: "已处理（个）",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "qxclz",
                            title: "处理中（个）",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "sgms",
                            title: "事故描述",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "sgdj",
                            title: "事故等级",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "zjss",
                            title: "直接损失(万元)",
                            rowspan:1,
                            valign:'middle',
                            align:'right'
                        },
                        {
                            field: "clqkjysm",
                            title: "处理情况简要说明",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        }
                    ]
                ]
            });

            //条件查询
            $("#query").on("click",function(){
                var label = $("#label").val();
                var query = {"label":label};
                $('#elyMang').bootstrapTable('refresh',{query: query});
            });

        }
    };

    return page;
});
