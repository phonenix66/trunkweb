
define("modules/supervise/overview/overview",["jquery","layer","bootstrap-table","modules/projectinfo/utils"], function ($,layer) {
    var page = function() {};
    page = {
        init: function (request) {
            var $table = $('#table');
            /**
             * table显示
             */
            $table.bootstrapTable({
                url: "modules/projectinfo/data.json",
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
                        rows: params.limit,                         //页面大小
                        page: (params.offset / params.limit) + 1,   //页码
                        sort: params.sort,      //排序列名
                        sortOrder: params.order //排位命令（desc，asc）
                    };

                    console.log($("#name").val());
                    console.log(temp);
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
                    //console.log(row);
                }
            });

            /*条件搜索*/
            $("#btn_search").on("click",function () {
                //条件组装在 queryParams 中处理
                $table.bootstrapTable("refresh");
            });


        }
    }




    return page;

});

