/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/ybb/ybb", ["jquery", "underscore", "page/tools", "bootstrap-table", "bootstrap-table-x-editable", "bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').hide();
            var resourceUrl = `${tools.API_URL}/schedule/scheduleManagementMonth`;
            var loginName = tools.getLoginName();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);

            //给年份下拉框赋值
            tools.showYear();
            var date = new Date;
            var month = date.getMonth() + 1;
            if (month < 10) {
                month = "0" + month;
            }
            $('#month').val(month);


            $('#elyMang').bootstrapTable({
                url: `${resourceUrl}/selectAllPlanByMonth`,
                // url: "modules/statistics/ybb/data.json",
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                pageSize: 20,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                pageList: [50, 100],
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function(params) { //请求服务器发送的参数
                    var year = $('#year').val();
                    var month = $('#month').val();
                    var searchParam = { year: year, month: month };
                    searchParam.sessionid = sessionStorage.getItem("sessionid")
                    searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                    searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                    searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                    return searchParam;
                },
                // sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                responseHandler: function(res) {
                    return res;
                },
                columns: [
                    [{
                        field: "tzqktjb",
                        title: "<span class='tzqktjbYear'></span>年全区水利建设项目完成投资情况统计表（<span class='tzqktjbMonth'></span>月）",
                        colspan: 10,
                        valign: 'middle',
                        align: 'center'
                    }],
                    [{
                            title: '序号',
                            field: '',
                            formatter: function(value, row, index) {
                                return index + 1;
                            },
                            valign: 'middle',
                            align: 'center'
                        },
                        {
                            field: "name",
                            title: "单位",
                            valign: 'middle',
                            align: 'center',
                            formatter(value, row, index) {
                                return value.replace("水利局", "");
                            }
                        },
                        {
                            field: "plan",
                            title: "<span class='jhwctz'></span>年计划完成投资（万元）",
                            valign: 'middle',
                            align: 'right'
                        },
                        {
                            field: "xujian",
                            title: "续建项目完成投资（万元）",
                            valign: 'middle',
                            align: 'right'
                        },
                        {
                            field: "xinjian",
                            title: "新建项目完成投资（万元）",
                            valign: 'middle',
                            align: 'right'
                        },
                        {
                            field: "done",
                            title: "完成总投资（万元）",
                            valign: 'middle',
                            align: 'right'
                        },
                        {
                            field: "rate",
                            title: "投资完成率（%）",
                            valign: 'middle',
                            align: 'center',
                            formatter(value, row, index) {
                                return (value * 100).toFixed(2);
                            }
                        },
                        {
                            field: "xujianNum",
                            title: "续建项目复工个数",
                            valign: 'middle',
                            align: 'center'
                        },
                        {
                            field: "xinjianNum",
                            title: "新建项目开工个数",
                            valign: 'middle',
                            align: 'center'
                        },
                        {
                            field: "kaifuNum",
                            title: "开复工总项目数",
                            valign: 'middle',
                            align: 'center'
                        }
                    ]


                ]
            });



            $('.row-body').on("click", '#btn_export', function() {
                var url = tools.API_URL + `/schedule/scheduleManagementMonth/outputExcel`;
                var year = $('#year').val();
                var month = $("#month").val();
                var datas = [{
                    year: year,
                    month: month
                }];
                tools.outputExcel(datas, url);
            });


            //条件查询
            $("#query").on("click", function() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();
                setTitle();
                $('#elyMang').bootstrapTable('refresh');
            });

            //设置表格中table
            setTitle();

            function setTitle() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();

                //获得月份
                $('.tzqktjbMonth').text(month);
                $('.tzqktjbYear').text(year);
                $('.jhwctz').text(year);
            }

        }
    };

    return page;
});
