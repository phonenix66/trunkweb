/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/jdtjb/jdtjb", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').hide();
            // var loginName = tools.getLoginName();
            // var showNum;
            // var city = sessionStorage.getItem("selected");
            // var cityEntity = JSON.parse(city);

            //给年份下拉框赋值
            tools.showYear();

            var date=new Date;
            var month=date.getMonth()+1;
            $('#month').val(month);

            $('#elyMang').bootstrapTable({
                url: tools.API_URL+"/schedule/ScheduleManagementTj/selectAllName",
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                height:$("body").height()-200,
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
                    var year = $('#year').val();
                    var month = $('#month').val();
                    var searchParam = {year:year,month:month};
                    return searchParam;
                },
                // sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                responseHandler:function(res){
                    return res;
                }, columns: [
                    [
                        {
                            field: "jdtjb",
                            title: "<span class='jdtjbYear'></span>年全区重点水利工程建设项目进度表（<span class='jdtjbMonth'></span>月）",
                            colspan:16,
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
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "name",
                            title: "项目名称",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "jsxz",
                            title: "建设性质",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "xmjsdw",
                            title: "项目建设单位",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "kgnf",
                            title: "开工年份",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "jcnf",
                            title: "建成年份",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "tzlb",
                            title: "投资类别（万元）",
                            valign:'middle',
                            rowspan:1,
                            colspan:4,
                            align:'center'
                        },
                        {
                            field: "ztz",
                            title: "总投资（万元）",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'right'
                        },
                        {
                            field: "xdtz",
                            title: "<span class='xdtz'></span>年下达投资 （万元）",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'right'
                        },
                        {
                            field: "kgqk",
                            title: "<span class='wkgqk'></span>月底未开工情况",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "wctz",
                            title: "<span class='wctz'></span>月完成投资（万元）",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'right'
                        },
                        {
                            field: "rate",
                            title: "完成下达投资率（%）",
                            valign:'middle',
                            rowspan:2,
                            colspan:1,
                            align:'center'
                        }
                    ],
                    [
                        {
                            field: "tzlbZyys",
                            title: "中央预算内资金",
                            valign:'middle',
                            rowspan:1,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "tzlbXzzzq",
                            title: "西藏自治区财政资金",
                            valign:'middle',
                            rowspan:1,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "tzlbZysl",
                            title: "中央水利发展资金",
                            valign:'middle',
                            rowspan:1,
                            colspan:1,
                            align:'center'
                        },
                        {
                            field: "tzlbQt",
                            title: "投资其他类资金类别",
                            valign:'middle',
                            rowspan:1,
                            colspan:1,
                            align:'center'
                        }
                    ]


                ]
            });

            $('.row-body').on("click", '#btn_export', function() {
                var url = tools.API_URL+"/schedule/ScheduleManagementTj/outputExcel";
                var year = $('#year').val();
                var month = $("#month").val();
                var datas = [{
                    year: year,
                    month: month
                }];
                tools.outputExcel(datas, url);
            });

            //条件查询
            $("#query").on("click",function(){
                var year = $('#year').val();
                var month = $('#month').val();
                setTitle();
                var query = {};
                $('#elyMang').bootstrapTable('refresh',{query: query});
            });


            //设置表格中table
            setTitle();
            function setTitle() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();

                //获得月份
                $('.jdtjbYear').text(year);
                $('.jdtjbMonth').text(month);
                $('.xdtz').text(year);
                $('.wkgqk').text(month);
                $('.wctz').text(month);

            }

        }
    };

    return page;
});
