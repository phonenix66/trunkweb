/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/zljctjb/zljctjb", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

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
                url: `${resourceUrl}/findZljctjb`,
                // url: "modules/statistics/zljctjb/data.json",
                height:$("body").height()-200,
                toolbar: '', //工具按钮用哪个容器
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
                            field: "slgctjb",
                            title: "水利工程建设项目实体工程质量抽检情况表",
                            colspan:26,
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
                            field: 'pjName',
                            title: '项目名称',
                            rowspan:2,
                            colspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hj",
                            title: "合计",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "tftzysl",
                            title: "土方填筑压实度（相对密度）",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "tfstxs",
                            title: "土方渗透系数",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "hntqd",
                            title: "混凝土强度（取芯）",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "hntks",
                            title: "混凝土抗渗（取芯）",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "hntht",
                            title: "混凝土回弹（强度）",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "gjgc",
                            title: "灌浆工程（透水率）",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "qt",
                            title: "其他",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        }

                    ],
                    [
                        {
                            field: "hjCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hjhgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.hjCjds!=0){
                                    return (row.hjhgds/row.hjCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },{
                            field: "tftzCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "tftzHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "tfhgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.tftzCjds!=0){
                                    return (row.tftzHgds/row.tftzCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },{
                            field: "tfstCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "tfstHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "sthgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.tfstCjds!=0){
                                    return (row.tfstHgds/row.tfstCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },
                        {
                            field: "hntqdCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hntqdHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "qdhgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.hntqdCjds!=0){
                                    return (row.hntqdHgds/row.hntqdCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },
                        {
                            field: "hntksCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hntksHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "kshgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.hntksCjds!=0){
                                    return (row.hntksHgds/row.hntksCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },
                        {
                            field: "hnthtCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hnthtHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "hthgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.hnthtCjds!=0){
                                    return (row.hnthtHgds/row.hnthtCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },
                        {
                            field: "gggcCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "gggcHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "gjhgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.gggcCjds!=0){
                                    return (row.gggcHgds/row.gggcCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        },
                        {
                            field: "qtCjds",
                            title: "抽检点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "qtHgds",
                            title: "合格点数</br>（个）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center'
                        },
                        {
                            field: "qthgl",
                            title: "合格率</br>（%）",
                            rowspan:1,
                            valign:'middle',
                            sortable: true,
                            align:'center',
                            formatter: function(value, row, index) {
                                if(row.qtCjds!=0){
                                    return (row.qtHgds/row.qtCjds).toFixed(2);
                                }else{
                                    return "";
                                }
                            }
                        }

                    ]
                ]
            });

            $('.row-body').on("click", '#btn_export', function() {
                var url = tools.API_URL + `/sa/statistical/outputZljctjbExcel`;
                var pjName = $("#pjName").val();
                var datas = [{
                    pjName:pjName
                }];
                tools.outputExcel(datas, url);
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
