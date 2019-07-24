
define("modules/system/zcfrsh/zcfrsh",["jquery","underscore","layer","page/tools","bootstrap-table","modules/projectinfo/utils"], function ($,_,layer,tools) {
    var page = function() {};
    page = {
        init: function (request) {
            var $table = $('#table');
            var resourceUrl = `${tools.API_URL}/sys/sysFaren`; //页面url地址

            /**
             * table显示
             */
            $table.bootstrapTable({
                url: `${resourceUrl}/data`,
                // contentType: "application/x-www-form-urlencoded",
                method: "get",
                toolbar: '#toolbar', //工具按钮用哪个容器
                clickToSelect: true,
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                pageList: [10, 25, 50, 100],
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: true, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client 客户端分页，server 服务端分页（*）
                queryParams: function(params) { //请求服务器发送的参数
                    var temp = {

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

                    { field: "dwName", title: "单位名称" },
                    { field: "frAddress", title: "单位地址" },
                    { field: "frDbName", title: "单位法人代表" },
                    { field: "frDbPhone", title: "联系电话" },
                    { field: "status", title: "状态" ,
                        formatter:function (value, row, index) {
                            switch (value) {
                                case "0": return "未完成";
                                case "1": return "已完成";
                                default : return "未知";

                            }
                        }
                    },
                    {
                        field: "5",
                        title: "操作",
                        formatter: function(value, row, index) {
                            var status = row.status;
                            row = JSON.stringify(row);
                            var v = "";
                            if(status == '0'){
                                v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-view' data='${row}'>查看</button>
					        	&nbsp;&nbsp;</div><div class='btn-group'>
                                    <button type='button' class='btn btn-info zdy-btn-examine'  data='${row}'>审核</button>
                                    </div>`
                            }else{
                                v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-view' data='${row}'>查看</button>`
                            }
                            return v;
                        }
                    }

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
                var data = $("form").serializeObject();
                // data.spCode = spData.spCode;
                $table.bootstrapTable('refresh', {
                    query: data
                });
            });

            /*增加*/
            $("#btn_add").on("click", function () {
                tools.toDialog({
                    name: "添加",
                    url: "modules/system/zcfrsh/zcfrsh_add.html",
                    area:['80%', '90%'],
                    param: {

                    },
                    btn: ['通过', '关闭'],
                    yes: function(obj, index, data) {

                        data.status = '0';
                        add(data);
                        // layer.msg("保存成功");
                        // layer.closeAll();
                        var query = $("form").serializeObject();
                        $table.bootstrapTable('refresh', {
                            query: query
                        });
                    }
                });
            });

            //查看
            $('#table').on('click', '.zdy-btn-view', function () {
                var data = eval('(' + $(this).attr("data") + ')');
                tools.toDialog({
                    name: "查看",
                    url: "modules/system/zcfrsh/zcfrsh_add.html",
                    area:['80%', '90%'],
                    param: {
                        show:true,
                        edit:data
                    },
                    btn: ['关闭'],
                    yes: function(obj, index, data) {
                        layer.close(index);
                    }
                });
            });

            //审核
            $('#table').on('click', '.zdy-btn-examine', function () {
                var data = eval('(' + $(this).attr("data") + ')');
                tools.toDialog({
                    name: "审批",
                    url: "modules/system/zcfrsh/zcfrsh_add.html",
                    area:['80%', '90%'],
                    param: {
                        show:true,
                        edit:data
                    },
                    btn: ['通过','退回','关闭'],
                    yes: function(obj, index) {
                        editStatus(data,1);
                        // layer.close(index);
                    },
                    btn2: function (obj,index) {
                        editStatus(data,2);
                        // layer.close(index);
                    }
                });
            });


            function editStatus(data,status) {
                var url = "";
                if(status == 1){
                    url = `${resourceUrl}/update`;
                    data.status = 1;
                }else if(status == 2){
                    url = `${resourceUrl}/delete`;
                }
                $.ajax({
                    url: url,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        layer.msg(res.msg);
                            if (res.success) {
                                layer.closeAll();
                                var query = $("form").serializeObject();
                                $table.bootstrapTable('refresh', {
                                    query: query
                                });
                            }

                    },
                    error: function(err) {

                    }
                })
            }



            function add(data) {
                $.ajax({
                    url: `${resourceUrl}/save`,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        layer.msg(res.msg);
                        if (res.success) {
                            layer.closeAll();
                            $table.bootstrapTable("refresh");
                        }
                    },
                    error: function(err) {

                    }
                })
            }

        }
    }




    return page;

});

