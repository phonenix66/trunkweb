/*考核总览*/
define("modules/evaluation/overview",
    ["jquery", "layer", "page/tools", "underscore", "echarts",
        "bootstrap-table",
        "modules/projectinfo/utils"
    ], function ($, layer, tools, _, echarts) {
        var page = function () {
        };
        page = {
            init: function (request) {
                $(".box-collapse").on("click", function () {
                    var to = $(this).data("toggle");
                    $(".box-body-" + to).slideToggle(300, function () {
                        // $(".box-body-"+to).height($("body").height()-300);
                    });

                })

                // 准备好的数据

                var echartsData = {
                    xAxis: ['质量目标', '质量规划制度', '质量检测管理', '质量诚信建设', '质量问题处理', '质量基础工作'],
                    series: [69, 57, 71, 92, 86, 89],
                    goal: [13, 14, 7, 13, 7, 46],
                    score: [9, 8, 5, 12, 6, 41],
                }
                /************** 进度条 *****************/
                var totalScore = 0;
                var totalGoal = 0;
                for (const score of echartsData.score) {
                    totalScore+=score;
                }
                for (const goal of echartsData.goal) {
                    totalGoal+=goal;
                }
                $("#score").html(totalScore);
                $("#goal").html(totalGoal);
                var w = totalScore/totalGoal*100;
                if (w<10){
                    $("#score").parent("div").width(150);
                }else {
                    $("#score").parent("div").width(w+"%");
                }
                $(".progress-bar").width(w+"%");
                /*********************图表的配置项和数据**********************/
                function echartsInit() {
                    var myChart = echarts.init(document.getElementById('echarts'));
                    var option = {
                        title: {
                            text: '总体考核得分情况',
                            subtext: '百分比/条目'
                        },
                        tooltip: {
                            trigger: 'axis',
                            formatter:'{b0}<br />{a0}: {c0}%'
                        },
                        legend: {
                            data: ['得分比率']
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                dataView: {readOnly: true},
                                magicType: {type: ['line', 'bar']},
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            type: 'category',
                            name:"类目",
                            boundaryGap: false,
                            data: echartsData.xAxis
                        },
                        yAxis: {
                            type: 'value',
                            name:"百分比",
                            max:100,
                            min:0,
                            axisLabel: {
                                formatter: '{value} %'
                            }
                        },
                        series: [
                            {
                                name: '得分比率',
                                type: 'line',
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            formatter:function (param) {
                                                return param.value+"%";
                                            }
                                        }
                                    },
                                },
                                data: echartsData.series
                                /*,markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }*/
                            }
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    // 移除容器上的 _echarts_instance_ 属性 重新绘制
                    document.getElementById('echarts').removeAttribute('_echarts_instance_');
                    myChart.setOption(option);
                }
                echartsInit();
                $(window).resize(function () {
                    echartsInit();
                })
                //下面的表格
                var tableTempl =
                    `<thead>
                    <% var dataLen = xAxis.length;%>
                    <tr>
                        <th></th>
                        <% for (var i = 0; i < dataLen; i++) {%>
                            <th><%=xAxis[i]%></th>
                        <%}%>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">目标分值</th>
                        <% for (var i = 0; i < dataLen; i++) {%>
                            <td><%=goal[i]%></td>
                        <%}%>
                    </tr>
                    <tr>
                        <th scope="row">得分</th>
                        <% for (var i = 0; i < dataLen; i++) {%>
                            <td><%=score[i]%></td>
                        <%}%>
                    </tr>
                    <tr>
                        <th scope="row">完成率</th>
                        <% for (var i = 0; i < dataLen; i++) {%>
                            <td><%=series[i]%>%</td>
                        <%}%>
                    </tr>
                    </tbody>`
                var tableHtml = _.template(tableTempl)(echartsData)
                $("#echartsTable").html(tableHtml)

                /***********************************项目考核********************************************/
                $("#dataTable").bootstrapTable({
                    height: $("body").height() - 300,
                    url: "modules/projectinfo/data.json",
                    method: "get",
                    toolbar: '', //工具按钮用哪个容器
                    clickToSelect: false,
                    singleSelect: false,
                    striped: true, //是否显示行间隔色
                    pageSize: 50,
                    pageNumber: 1,
                    pageList: "[10, 25, 50, 100, ALL]",
                    dataType: "json",
                    cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                    pagination: true, //是否显示分页（*）
                    sortable: true, //是否启用排序
                    sortOrder: "asc", //排序方式
                    uniqueId: "id",
                    sidePagination: "client", //分页方式：client 客户端分页，server服务端分页（*）
                    queryParams: function (params) { //请求服务器发送的参数
                        var searchParam = dataFormObj("#search_form")
                        searchParam.sessionid = sessionStorage.getItem("sessionid")
                        searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                        searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                        searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                        return searchParam;
                    },
                    responseHandler: function (res) {
                        var data = res.rows;
                        return data;
                    },
                    onClickRow: function (row) {
                    },
                    columns: [
                        {
                            field: "name",
                            sortable: true,
                            title: "项目名称"
                        },
                        {
                            field: "总得分",
                            title: "总得分",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "项目法人质量管理（24分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "勘察设计质量保证（7分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "监理质量控制（20分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "施工质量保证（22分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "项目投资、政府验收、质量监督（7分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "施工现场管理、实体质量（20分）",
                            sortable: true
                        },
                        {
                            field: "",
                            title: "操作",
                            sortable: true,
                            formatter: function (val, row, index) {
                                return "<div style='cursor: pointer;color: #00a7d0;'>考核详情</div>"
                            }
                        }
                    ],
                    onSort: function (name, order) {
                    }
                });
            }
        }
        return page;
    });