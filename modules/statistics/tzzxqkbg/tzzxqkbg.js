/**
 * 统计分析=》投资执行请款报告
 */
define("modules/statistics/tzzxqkbg/tzzxqkbg", [
    "jquery", "underscore", "page/tools",
    "bootstrap-table","bootstrap-table-x-editable",
    "bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            var resourceUrl = `${tools.API_URL}/schedule/scheduleManagementMonth`;
            var loginName = tools.getLoginName();
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);
            $('#projectNav').hide();

            $('#hrightId').height($("body").height()-200)

            //给年份下拉框赋值
            tools.showYear();
            var date=new Date;
            var month=date.getMonth()+1;
            if(month<10){
                month = "0"+month;
            }
            $('#month').val(month);


            $('#elyMang').bootstrapTable({
                url: `${tools.API_URL}/schedulemanagement/Tzzxtj/findList`,
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: false, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数
                    var year = $('#year').val();
                    var month = $('#month').val();
                    var searchParam = {year:year,month:month};
                    return searchParam;
                },
                responseHandler:function(res){
                    return res.rows;
                }, columns: [
                    [
                        {
                            field: "tzqktjb",
                            title: "<span class='tzqktjbYear'></span>年各单位完成投资情况报表（<span class='tzqktjbMonth'></span>月）",
                            colspan:8,
                            valign:'middle',
                            align:'center'
                        }
                    ],
                    [
                        {
                            field: "sdName",
                            title: "单位名称",
                            rowspan:2,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "mbtz",
                            title: "<span class='jhwctz'></span>年计划投资（万元）",
                            rowspan:2,
                            valign:'middle',
                            align:'right'
                        },
                        {
                            field: "wctz",
                            title: "<span class='jhwctz'></span>年截止12月完成投资（万元）",
                            rowspan:2,
                            valign:'middle',
                            align:'right'
                        },
                        {
                            field: "tzwcl",
                            title: "投资完成率（%）",
                            rowspan:2,
                            valign:'middle',
                            align:'right',
                            formatter:function(value,roe,index){
                                 var wcl = (value*100).toFixed(2);
                                 return wcl;
                            }
                        },
                        {
                            field: "",
                            title: "续建项目",
                            valign:'middle',
                            rowspan:1,
                            colspan:2,
                            align:'center'
                        },
                        {
                            field: "",
                            title: "新开工项目",
                            valign:'middle',
                            rowspan:1,
                            colspan:2,
                            align:'center'
                        }
                    ],
                    [
                        {
                            field: "xjxm",
                            title: "数量",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "xjwctz",
                            title: "完成投资",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "newXm",
                            title: "数量",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "newctz",
                            title: "完成投资",
                            rowspan:1,
                            valign:'middle',
                            align:'center'
                        }
                    ]


                ]
            });

            showTable("elyMangOne","2150","中央预算内水利建设项目投资完成情况");
            showTable("elyMangtwo","2151","中央水利发展资金投资完成情况");
            showTable("elyMangthree","2152","自治区财政资金完成投资情况");
            function showTable(example,intype,name){
                $('#' + example).bootstrapTable({
                    url: `${tools.API_URL}/schedulemanagement/Tzzxtj/findListByZjType`,
                    toolbar: '', //工具按钮用哪个容器
                    striped: true, //是否显示行间隔色
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: false, //是否显示分页（*）
                    sortable: false, //是否启用排序
                    sortOrder: "asc", //排序方式
                    uniqueId: "id",
                    sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                    queryParams: function (params) { //请求服务器发送的参数
                        var year = $('#year').val();
                        var month = $('#month').val();
                        var searchParam = {
                            year:year,
                            month:month,
                            fundsProvided:intype
                        };
                        return searchParam;
                    },
                    responseHandler:function(res){
                        return res.rows;
                    }, columns: [
                        [
                            {
                                field: "tzqktjb",
                                title: "<span class='tzqktjbYear'></span>年 "+name+"（<span class='tzqktjbMonth'></span>月）",
                                colspan:7,
                                valign:'middle',
                                align:'center'
                            }
                        ],
                        [
                            {
                                field: "label",
                                title: "工程名称",
                                valign:'middle',
                                align:'center'
                            },
                            {
                                field: "xdzj",
                                title: "下达投资（万元）",
                                valign:'middle',
                                align:'right'
                            },
                            {
                                field: "wctz",
                                title: "完成投资（万元）",
                                valign:'middle',
                                align:'right'
                            },
                            {
                            field: "tzwcl",
                            title: "投资完成率（%）",
                            valign:'middle',
                            align:'right',
                                formatter:function(value,roe,index){
                                    var wcl = (value*100).toFixed(2);
                                    return wcl;
                                }
                        },
                            {
                                field: "corporateDeptName",
                                title: "项目法人单位",
                                valign:'middle',
                                align:'right'
                            },
                            {
                                field: "departmentName",
                                title: "项目主管单位",
                                valign:'middle',
                                align:'center'
                            },
                            {
                                field: "1",
                                title: "截止月份",
                                valign:'middle',
                                align:'center',
                                formatter:function (value,row,index) {
                                    value = $('#month').val();
                                    return value;
                                }
                            }
                        ]
                    ]
                });
            }

            //条件查询
            $("#query").on("click",function(){
                setTitle();
                count();
                counts();
                $('#elyMang').bootstrapTable('refresh');
                $('#elyMangOne').bootstrapTable('refresh');
                $('#elyMangtwo').bootstrapTable('refresh');
                $('#elyMangthree').bootstrapTable('refresh');
            });

            //给统计列赋值
            count();
            function count() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();
                var data = {
                    year:year,
                    month:month
                }
                $.ajax({
                    type: "post",
                    url:`${tools.API_URL}/schedulemanagement/Tzzxtj/count`,
                    data: data,
                    async: true
                }).then(function(res) {
                    $('#mbtz').text(res.data.mbtz);
                    $('#kfgxmzs').text(res.data.kfgxmzs);
                    $('#wctz').text(res.data.wctz);
                    $('#tzwcl').text((res.data.tzwcl).toFixed(2));
                    $('#xjxm').text(res.data.xjxm);
                    $('#xjwctz').text(res.data.xjwctz);
                    $('#newXm').text(res.data.newXm);
                    $('#newctz').text(res.data.newctz);
                }, function() {
                    console.log("请求错误");
                });
            }

            counts();
            function counts() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();
                var data = {
                    year:year,
                    month:month
                };
                $.ajax({
                    type: "post",
                    url:`${tools.API_URL}/schedulemanagement/Tzzxtj/countType`,
                    data: data,
                    async: true
                }).then(function(res) {
                    for (var row of res.data){
                        var type = row.fundsProvided
                        var xdzj = `.row${type} .xdzj`;
                        var jsxm = `.row${type} .jsxm`;
                        var wctz = `.row${type} .wctz`;
                        var tzwcl = `.row${type} .tzwcl`;
                        $(xdzj).text(row.xdzj)
                        $(jsxm).text(row.jsxm)
                        $(wctz).text(row.wctz)
                        $(tzwcl).text((row.tzwcl*100).toFixed(2))
                    }
                }, function() {
                    console.log("请求错误");
                });
            }

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


            $('.row-body').on("click", '#btn_export', function() {
                //获得年份
                var year = $('#year').val();
                var month = $('#month').val();
                var url = `${tools.API_URL}/schedulemanagement/Tzzxtj/exportWord`;
                var datas = [{
                    year:year,
                    month:month
                }];
                tools.outputExcel(datas, url);
            });

        }
    };

    return page;
});
