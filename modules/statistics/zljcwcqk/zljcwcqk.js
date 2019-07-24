/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/zljcwcqk/zljcwcqk", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

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
                //url: `${resourceUrl}/findZljctjb`,
                url: "modules/statistics/zljcwcqk/data.json",
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
                            colspan:7,
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
                            align:'center'
                        },
                        {
                            field: 'pjName',
                            title: '项目名称',
                            align:'center'
                        },
                        {
                            field: 'sgdw',
                            title: '施工单位自检',
                            align:'center'
                        },
                        {
                            field: 'jldw',
                            title: '监理平行检测',
                            align:'center'
                        },
                        {
                            field: 'frdw',
                            title: '法人抽检',
                            align:'center'
                        },
                        {
                            field: 'jddw',
                            title: '监督单位飞检',
                            align:'center'
                        },
                        {
                            field: 'jgjc',
                            title: '竣工检测',
                            align:'center'
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
