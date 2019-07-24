/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/zltjb/zltjb", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').hide();
            var resourceUrl = `${tools.API_URL}/sa/statistical`;
            var loginName = tools.getLoginName();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);


            $('#elyMang').bootstrapTable({
                url: `${resourceUrl}/findZltjb`,
                // url: "modules/statistics/zltjb/data.json",
                toolbar: '', //工具按钮用哪个容器
                height:$("body").height()-200,
                striped: true, //是否显示行间隔色
                pageSize: 20,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                pageList: [20,50,100],
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数
                    var pjName = $('#pjName').val();
                    var searchParam = {pjName:pjName};
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
                            field: "slgcjsxmtjb",
                            title: "水利工程建设项目质量评定与验收情况统计表",
                            colspan:17,
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
                            rowspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "pjName",
                            title: "项目名称",
                            rowspan:3,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "dygcsgzl",
                            title: "单元工程施工质量验收评定情况",
                            rowspan:1,
                            colspan:5,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "fbgczlpd",
                            title: "分部工程质量评定与验收情况",
                            rowspan:1,
                            colspan:4,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "dwgczlpd",
                            title: "单位工程质量评定与验收情况",
                            rowspan:1,
                            colspan:4,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "comResul",
                            title: "竣工验收结论",
                            rowspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "remarks",
                            title: "备注",
                            rowspan:3,
                            valign:'middle',
                            align:'center'
                        }
                    ],
                    [
                        {
                            field: "dyNo",
                            title: "单元工程总数（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "dyPass",
                            title: "合格（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "dyGood",
                            title: "优良（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },{
                            field: "qzzy",
                            title: "其中重要隐蔽及关键部位单元工程",
                            colspan:2,
                            valign:'middle',
                            align:'center'
                        },

                        {
                            field: "fbgcNum",
                            title: "分部工程总数（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "fbgcHgNum",
                            title: "合格（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "fbgcYlNum",
                            title: "优良（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },{
                            field: "fbgcsfhd",
                            title: "是否核定(备)",
                            rowspan:2,
                            valign:'middle',
                            align:'center',
                            formatter: function (value, row, index) {
                                if(value == '0'){
                                    return '是';
                                }else if (value == '1') {
                                    return '否';
                                }else{
                                    return '';
                                }
                            }
                        },

                        {
                            field: "dwgcNum",
                            title: "单位工程总数（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "dwgcHgNum",
                            title: "合格（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "dwgcYlNum",
                            title: "优良（个）",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },{
                            field: "dwgcsfhd",
                            title: "是否核定(备)",
                            rowspan:2,
                            valign:'middle',
                            align:'center',
                            formatter: function (value, row, index) {
                                if(value == '0'){
                                    return '是';
                                }else if (value == '1') {
                                    return '否';
                                }else{
                                    return '';
                                }
                            }
                        }

                    ],
                    [
                        {
                            field: "iptPass",
                            title: "合格（个）",
                            sortable:true,
                            valign:'middle',
                            align:'center'
                        },{
                            field: "iptGood",
                            title: "优良（个）",
                            sortable:true,
                            valign:'middle',
                            align:'center'
                        }
                    ]


                ]
            });

            $('.row-body').on("click", '#btn_export', function() {
                var url = tools.API_URL + `/sa/statistical/outputZltjbExcel`;
                var pjName = $("#pjName").val();
                var datas = [{
                    pjName:pjName
                }];
                tools.outputExcel(datas, url);
            });

            //条件查询
            $("#query").on("click",function(){
                var pjName = $("#pjName").val();
                var query = {"pjName":pjName};
                $('#elyMang').bootstrapTable('refresh',{query: query});
            });

        }
    };

    return page;
});
