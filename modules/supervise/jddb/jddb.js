/**
 * 质量管理=》总览
 */
define("modules/supervise/jddb/jddb", ["jquery", "underscore", "page/tools","echarts","bootstrap-datepicker"], function($, _, tools,echarts) {
    var page = function() {};
    page = {
        init: function() {

            var $table = $('#table');
            var resourceUrl = API_URL+"/sv/svManagement";
            /**
             * table显示
             */
            $table.bootstrapTable({
                url: `${resourceUrl}/data`,
                contentType: "application/x-www-form-urlencoded",
                method: "get",
                toolbar: '#toolbar', //工具按钮用哪个容器
                clickToSelect: true,
                striped: true, //是否显示行间隔色
                pageSize: 5,
                pageNumber: 1,
                pageList: [5,10, 25, 50, 100],
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: true, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client 客户端分页，server 服务端分页（*）
                queryParams: function(params) { //请求服务器发送的参数
                    var temp = {
                    };
                    return temp;
                },
                responseHandler: function(res) {
                    var data = res.rows;
                    return data;
                },
                columns: [
                    {
                        title:"全选",
                        checkbox:true,
                        visible: true
                    },
                    {
                        title: '序号',
                        field: '',
                        formatter: function(value, row, index) {
                            return index + 1;
                        }
                    },

                    { field: "name", title: "督办名称" },
                    { field: "type1", title: "督办模块" },
                    { field: "test", title: "时间" },
                    { field: "test", title: "提交人" },
                    { field: "test", title: "督办原因" },
                    { field: "status", title: "状态" ,
                        formatter:function (value, row, index) {
                            switch (value) {
                                case "": return "未选择";
                                case "0": return "未完成";
                                case "1": return "已完成";
                                default : return "未知";

                            }
                        }
                    },
                    { field: "test", title: "进度" }

                ],
                onLoadSuccess: function () {
                },
                onLoadError: function () {
                    console.log("数据加载失败！");
                },
                onClickRow: function (row) {

                }
            });

        }
    };
    return page;
});
