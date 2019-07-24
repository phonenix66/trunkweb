define("modules/schedule/schedule", ["jquery", "underscore", "page/tools", "echarts", "bootstrap-table-zh-CN", "modules/projectinfo/utils"], function($, _, tools, echarts, tmpl) {
    var page = function() {};
    page = {
        init: function(request) {

            tools.setNavData(2);
            var resourceUrl = `${tools.API_URL}/schedule/scheduleManagement`; //页面url地址
            // var spData = tools.getSpData(); //获取风场信息
            var loginName = tools.getLoginName();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);
            //y轴数据 第一张图
            var dataCountry = [];
            //x轴数据 第一张图
            var dataCountryValue = [];
            //y轴数据 第er张图
            var dataCountry_2 = [];
            //x轴数据 第er张图
            var dataCountryValue_2 = [];
            //y轴数据 第3张图
            var dataCountry_3 = [];
            //百分比
            var dataCountryByRate = [];
            //金额
            var dataCountryByMoney = [];
            var maxValue = [];
            if (cityEntity.city == null || cityEntity.city == "" && cityEntity.county == null && cityEntity.project == null) {
                showNum = 1;
            } else if (cityEntity.city != null && cityEntity.county == null && cityEntity.project == null) {

                showNum = 4;
            } else if (cityEntity.city != null && cityEntity.county != null && cityEntity.project == null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();
                showNum = 5;
            } else if (cityEntity.city != null && cityEntity.county != null && cityEntity.project != null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();

                showNum = 6;
            } else if (cityEntity.city != null && cityEntity.county == null && cityEntity.project != null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();

                showNum = 6;
            } else if (cityEntity.city == null && cityEntity.county != null && cityEntity.project == null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();

                showNum = 5;
            } else if (cityEntity.city == null && cityEntity.county != null && cityEntity.project != null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();

                showNum = 6;
            } else if (cityEntity.city == null && cityEntity.county == null && cityEntity.project != null) {

                $('#anniu_a').hide();
                $('#anniu_b').hide();
                showNum = 6;
            }


            showYear();

            function showYear() {
                var myDate = new Date();
                var year = myDate.getFullYear(); // 年份
                var startYear = myDate.getFullYear(); //起始年份 这个可以自定义前后多少年。
                var endYear = myDate.getFullYear() - 10; //结束年份
                var obj = document.getElementsByClassName('select_time');
                var o;
                for (o = 0; o < obj.length; o++) {
                    for (var i = startYear; i >= endYear; i--) {
                        if (obj[o].options != null) {
                            obj[o].options.add(new Option(i));
                        }
                    }
                    //  设置选中当前月
                    $(obj[o]).find("option").each(function() {
                        if ($(this).val() === year) {
                            $(this).attr("selected", true)
                        }
                    });
                }
            }




            /**
             * 查询
             */
            $("#btn_search").on("click", function() {
                var year = $('#year').val();
                selectAllTouzi();
                //查询第一个图型为show的echars
                if (showNum == 1) {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectRateAll();
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    myChart_1.setOption(option);
                    dataCountry_2 = [];
                    dataCountryValue_2 = [];
                    selectBySource();
                    option_1.legend.data = dataCountry_2;
                    option_1.series[0].data = dataCountryValue_2;
                    c_1.setOption(option_1);
                    dataCountry_3 = [];
                    dataCountryByRate = [];
                    dataCountryByMoney = [];
                    maxValue = [];
                    selectYueByAll();
                    option_2.yAxis[0].max = maxValue;
                    option_2.xAxis[0].data = dataCountry_3;
                    option_2.xAxis[1].data = dataCountry_3;
                    option_2.series[0].data = dataCountryByMoney;
                    option_2.series[1].data = dataCountryByRate;
                    myChart_2.setOption(option_2);
                    selectTableByAll(showNum);
                } else if (showNum == 4) {
                    dataCountry = [];
                    dataCountryValue = [];

                    selectRateCity(cityEntity.city.id);
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    myChart_1.setOption(option);
                    dataCountry_2 = [];
                    dataCountryValue_2 = [];
                    selectBySourceByCity(cityEntity.city.id);

                    option_1.legend.data = dataCountry_2;
                    option_1.series[0].data = dataCountryValue_2;
                    c_1.setOption(option_1);
                    dataCountry_3 = [];
                    dataCountryByRate = [];
                    dataCountryByMoney = [];
                    maxValue = [];
                    selectYueByAllByCity(cityEntity.city.id);
                    option_2.yAxis[0].max = maxValue;
                    option_2.xAxis[0].data = dataCountry_3;
                    option_2.xAxis[1].data = dataCountry_3;
                    option_2.series[0].data = dataCountryByMoney;
                    option_2.series[1].data = dataCountryByRate;
                    myChart_2.setOption(option_2);
                    selectTableByAll(showNum);
                } else if (showNum == 5) {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectRateCount(cityEntity.county.id);
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    myChart_1.setOption(option);
                    $('#anniu_a').hide();
                    $('#anniu_b').hide();
                    dataCountry_2 = [];
                    dataCountryValue_2 = [];
                    selectSourceByCountry(cityEntity.county.id);
                    option_1.legend.data = dataCountry_2;
                    option_1.series[0].data = dataCountryValue_2;
                    c_1.setOption(option_1);
                    dataCountry_3 = [];
                    dataCountryByRate = [];
                    dataCountryByMoney = [];
                    maxValue = [];
                    selectYueByCountry(cityEntity.county.id);
                    option_2.yAxis[0].max = maxValue;
                    option_2.xAxis[0].data = dataCountry_3;
                    option_2.xAxis[1].data = dataCountry_3;
                    option_2.series[0].data = dataCountryByMoney;
                    option_2.series[1].data = dataCountryByRate;
                    myChart_2.setOption(option_2);
                    selectTableByAll(showNum);
                } else if (showNum == 6) {
                    // dataCountry = [];
                    dataCountryValue = [];

                    selectRateName(cityEntity.project.id);

                    // option.yAxis.data = dataCountry;
                    option_6.series[0].data = dataCountryValue;
                    myChart_1.setOption(option_6);

                    // selectRateName(cityEntity.project.id);
                    // option_6.yAxis.data = dataCountry;
                    // option_6.series[0].data = dataCountryValue;
                    myChart_1.setOption(option_6);
                    $('#anniu_a').hide();
                    $('#anniu_b').hide();
                    dataCountry_2 = [];
                    dataCountryValue_2 = [];
                    selectYuanByProject(cityEntity.project.id);
                    option_1.legend.data = dataCountry_2;
                    option_1.series[0].data = dataCountryValue_2;
                    c_1.setOption(option_1);
                    dataCountry_3 = [];
                    dataCountryByRate = [];
                    dataCountryByMoney = [];
                    maxValue = [];
                    selectYueByProject(cityEntity.project.id);
                    option_2.yAxis[0].max = maxValue;
                    option_2.xAxis[0].data = dataCountry_3;
                    option_2.xAxis[1].data = dataCountry_3;
                    option_2.series[0].data = dataCountryByMoney;
                    option_2.series[1].data = dataCountryByRate;
                    myChart_2.setOption(option_2);
                    selectTableByAll(showNum);
                }
                $(".row-body").bootstrapTable('refresh', {
                    query: {
                        year: year
                    }
                });
            });
            //不选择的时候
            var myChart_1 = echarts.init(document.getElementById('main_1'));
            var option = {
                dataZoom: [

                    {
                        type: 'slider',
                        yAxisIndex: 0,
                        zoomLock: true,
                        width: 10,
                        right: 10,
                        top: 70,
                        bottom: 20,
                        start: 20,
                        end: 100,
                        handleSize: 0,
                        showDetail: false,
                    }, {
                        type: 'inside',
                        id: 'insideY',
                        yAxisIndex: 0,
                        start: 0,
                        end: 100,
                        zoomOnMouseWheel: false,
                        moveOnMouseMove: true,
                        moveOnMouseWheel: true
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                grid: {

                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    //x轴刻度取值范围
                    min: 0,
                    max: 100,
                    type: 'value',
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        formatter: '{value} %'
                    },
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: dataCountry
                },
                series: [{
                    name: '完成率',
                    type: 'bar',
                    barWidth: 15, //柱图宽度
                    itemStyle: {
                        normal: {
                            color: '#9fe6b8'
                        }
                    },

                    data: dataCountryValue
                }]
            };
            //选择项目的时候
            var option_6 = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {

                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    min: 0,
                    max: 100,
                    type: 'value',
                    axisLabel: {


                        show: true,
                        interval: 'auto',
                        formatter: '{value} %'
                    },
                    boundaryGap: [0, 0.01],

                },
                yAxis: {
                    type: 'category',
                    data: ['当年进度', '总体进度']
                },
                series: [{
                    name: '完成率',
                    type: 'bar',
                    barWidth: 15, //柱图宽度
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                var colorList = ['#8378ea', '#9fe6b8'];
                                return colorList[params.dataIndex];
                            }
                        }

                    },

                    data: dataCountryValue
                }]
            };

            myChart_1.setOption(option);
            //选择市查询县级数据
            if (showNum == 4) {
                //获取数据,并且设置进dataCountry，dataCountryValue数组里面
                dataCountry = [];
                dataCountryValue = [];
                selectRateCity(cityEntity.city.id);

                option.yAxis.data = dataCountry;
                option.series[0].data = dataCountryValue;
                myChart_1.setOption(option);
            } else if (showNum == 1) {
                dataCountry = [];
                dataCountryValue = [];
                selectRateAll();

                option.yAxis.data = dataCountry;
                option.series[0].data = dataCountryValue;
                myChart_1.setOption(option);
            } else if (showNum == 5) {
                selectRateCount(cityEntity.county.id);

                option.yAxis.data = dataCountry;
                option.series[0].data = dataCountryValue;
                myChart_1.setOption(option);
            } else if (showNum == 6) {
                selectRateName(cityEntity.project.id);

                // option.yAxis.data = dataCountry;
                option_6.series[0].data = dataCountryValue;
                myChart_1.clear();
                myChart_1.setOption(option_6);
            } else if (showNum == 7) {
                selectTypeAll();

                option.yAxis.data = dataCountry;
                option.series[0].data = dataCountryValue;
                myChart_1.setOption(option);
            } else if (showNum == 8) {
                selectTypeCity(cityEntity.city.id);
                option.yAxis.data = dataCountry;
                option.series[0].data = dataCountryValue;
                myChart_1.setOption(option);
            }


            $("#anniu_b").click(function() {

                if (cityEntity.city == null) {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectTypeAll();

                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    // option.dataZoom = null;
                    delete option["dataZoom"]
                        // var dataZoom = [{}];
                        // option.dataZoom = dataZoom;
                    myChart_1.clear();
                    myChart_1.setOption(option);


                } else {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectTypeCity(cityEntity.city.id);
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    delete option["dataZoom"]
                        // var dataZoom = [{}];
                        // option.dataZoom = dataZoom;
                    myChart_1.clear();
                    myChart_1.setOption(option);

                    // showNum = 8;
                }

            });

            $("#anniu_a").click(function() {
                if (cityEntity.city == null || cityEntity.city == '') {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectRateAll();
                    var dataZoom = [{
                        type: 'slider',
                        yAxisIndex: 0,
                        zoomLock: true,
                        width: 10,
                        right: 10,
                        top: 70,
                        bottom: 20,
                        start: 20,
                        end: 100,
                        handleSize: 0,
                        showDetail: false,
                    }, {
                        type: 'inside',
                        id: 'insideY',
                        yAxisIndex: 0,
                        start: 0,
                        end: 100,
                        zoomOnMouseWheel: false,
                        moveOnMouseMove: true,
                        moveOnMouseWheel: true
                    }];


                    option.dataZoom = dataZoom;
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    myChart_1.setOption(option);
                } else {
                    dataCountry = [];
                    dataCountryValue = [];
                    selectRateCity(cityEntity.city.id);
                    var dataZoom = [{
                        type: 'slider',
                        yAxisIndex: 0,
                        zoomLock: true,
                        width: 10,
                        right: 10,
                        top: 70,
                        bottom: 20,
                        start: 20,
                        end: 100,
                        handleSize: 0,
                        showDetail: false,
                    }, {
                        type: 'inside',
                        id: 'insideY',
                        yAxisIndex: 0,
                        start: 0,
                        end: 100,
                        zoomOnMouseWheel: false,
                        moveOnMouseMove: true,
                        moveOnMouseWheel: true
                    }];


                    option.dataZoom = dataZoom;
                    option.yAxis.data = dataCountry;
                    option.series[0].data = dataCountryValue;
                    myChart_1.setOption(option);
                }

            });
            var c_1 = echarts.init(document.getElementById('c_1'));
            var option_1 = {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    padding: -10,
                    // data: ['中央预算内资金', '中央水利发展资金', '自治区财政资金', '其他资金']
                    data: dataCountry_2
                },
                series: [{
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '50%'],
                    selectedMode: 'single',
                    label: {
                        normal: {
                            show: true,
                            formatter: '{c}({d}%)' //b:名称，c:数值,d:百分比
                        }
                    },


                    data: dataCountryValue_2,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            };

            if (showNum == 1) {
                dataCountry_2 = [];
                dataCountryValue_2 = [];
                selectBySource();
                option_1.legend.data = dataCountry_2;
                option_1.series[0].data = dataCountryValue_2;
                c_1.setOption(option_1);
            } else if (showNum == 4) {
                dataCountry_2 = [];
                dataCountryValue_2 = [];
                selectBySourceByCity(cityEntity.city.id);
                option_1.legend.data = dataCountry_2;
                option_1.series[0].data = dataCountryValue_2;
                c_1.setOption(option_1);
            } else if (showNum == 5) {
                dataCountry_2 = [];
                dataCountryValue_2 = [];
                selectSourceByCountry(cityEntity.county.id);
                option_1.legend.data = dataCountry_2;
                option_1.series[0].data = dataCountryValue_2;
                c_1.setOption(option_1);
            } else if (showNum == 6) {
                dataCountry_2 = [];
                dataCountryValue_2 = [];
                selectYuanByProject(cityEntity.project.id);
                option_1.legend.data = dataCountry_2;
                option_1.series[0].data = dataCountryValue_2;
                c_1.setOption(option_1);
            }


            var myChart_2 = echarts.init(document.getElementById('main_2'));
            // var myChart_3 = echarts.init(document.getElementById('main_3'));
            //第三张图，按月查询
            var option_2 = {

                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}<br/>{a}: {c}<br />{a1}: {c1}%'
                },
                legend: {
                    bottom: '2%',
                    left: 'center',
                    data: [
                        '检验次数(次)', '优良率'
                    ]
                },
                //盒子
                // toolbox: {
                //     show: true,
                //     feature: {
                //         mark: { show: false },
                //         dataView: { show: false, readOnly: false },
                //         magicType: { show: true, type: ['line', 'bar'] },
                //         restore: { show: true },
                //         saveAsImage: { show: true }
                //     }
                // },
                calculable: true,
                xAxis: [{
                        type: 'category',
                        data: dataCountry_3
                    },
                    {
                        type: 'category',
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: { show: false },
                        splitArea: { show: false },
                        splitLine: { show: false },
                        data: dataCountry_3
                    }
                ],
                yAxis: [{
                    type: 'value',
                    name: '金额(万元)',
                    // boundaryGap: true,
                    // axisLabel: {
                    //     margin: 2,
                    //     formatter: function(value, index) {
                    //         if (value < 1000) {
                    //             value = value + "万";
                    //         } else if (value >= 1000 && value < 1000000) {
                    //             value = value / 1000 + "千万";
                    //         } else if (value >= 1000000) {
                    //             value = value / 1000000 + "亿";
                    //         }
                    //         return value;
                    //     }
                    // },
                    splitLine: { show: false },
                    min: 0,
                    max: maxValue,
                    // interval: 100
                }, {
                    type: 'value',
                    name: '百分比',
                    splitLine: { show: false },
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: '{value} %'
                    }
                }],
                series: [{
                        name: '金额(万元)',
                        type: 'bar',
                        itemStyle: { normal: { color: 'rgba(193,35,43,0.5)' } },
                        barWidth: 30, //柱图宽度
                        data: dataCountryByMoney,
                    },
                    {
                        name: '百分比',
                        type: 'line',
                        yAxisIndex: 1,
                        itemStyle: { normal: { color: 'rgba(181,195,52,0.5)' } },
                        barWidth: 30, //柱图宽度
                        data: dataCountryByRate,
                    }
                ]
            };
            if (showNum == 1) {
                dataCountry_3 = [];
                dataCountryByRate = [];
                dataCountryByMoney = [];
                maxValue = [];
                selectYueByAll();
                option_2.yAxis[0].max = maxValue;
                option_2.xAxis[0].data = dataCountry_3;
                option_2.xAxis[1].data = dataCountry_3;
                option_2.series[0].data = dataCountryByMoney;
                option_2.series[1].data = dataCountryByRate;
                myChart_2.setOption(option_2);
            } else if (showNum == 4) {
                dataCountry_3 = [];
                dataCountryByRate = [];
                dataCountryByMoney = [];
                maxValue = [];
                selectYueByAllByCity(cityEntity.city.id);
                option_2.yAxis[0].max = maxValue;
                option_2.xAxis[0].data = dataCountry_3;
                option_2.xAxis[1].data = dataCountry_3;
                option_2.series[0].data = dataCountryByMoney;
                option_2.series[1].data = dataCountryByRate;
                myChart_2.setOption(option_2);
            } else if (showNum == 5) {
                dataCountry_3 = [];
                dataCountryByRate = [];
                dataCountryByMoney = [];
                maxValue = [];
                selectYueByCountry(cityEntity.county.id);
                option_2.yAxis[0].max = maxValue;
                option_2.xAxis[0].data = dataCountry_3;
                option_2.xAxis[1].data = dataCountry_3;
                option_2.series[0].data = dataCountryByMoney;
                option_2.series[1].data = dataCountryByRate;
                myChart_2.setOption(option_2);
            } else if (showNum == 6) {
                dataCountry_3 = [];
                dataCountryByRate = [];
                dataCountryByMoney = [];
                maxValue = [];
                selectYueByProject(cityEntity.project.id);
                option_2.yAxis[0].max = maxValue;
                option_2.xAxis[0].data = dataCountry_3;
                option_2.xAxis[1].data = dataCountry_3;
                option_2.series[0].data = dataCountryByMoney;
                option_2.series[1].data = dataCountryByRate;
                myChart_2.setOption(option_2);
            }


            // myChart_2.setOption(option_2);




            var self = this;
            $(".user-btn-add").on("click", function() {
                addNewUser();
            });

            function saveData(data) {
                $.ajax({
                    // url: `${resourceUrl}/save`,
                    data: data,
                    type: 'post',
                    dataType: 'json',
                    success: function(res) {
                        console.log(res);
                        if (res.success) {
                            layer.msg(res.msg);
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            function addNewUser() {
                tools.toDialog({
                    name: "添加进度管理信息",
                    url: "modules/schedule/schedule_add.html",

                    param: {
                        add: true
                    },
                    skin: "layerui-layer",
                    shade: 0.3,
                    btn: ['保存', '关闭'],
                    yes: function(obj, index, data) {
                        saveData(data);
                        $('#table').bootstrapTable('refresh');
                        layer.close(index);

                    },

                });
            }
            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });
            //查询市级数据.
            function selectRateCity(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectCountryByCityByXzqh`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {

                            for (var i = res.length - 1; i >= 0; i--) {
                                dataCountry.push(res[i].countryName);
                                if (res[i].rate >= 100) {
                                    res[i].rate = 100;
                                }
                                dataCountryValue.push(res[i].rate.toFixed(2));



                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //查询全部数据.
            function selectRateAll() {
                var year = $('select[name="build_time"]').val();
                data = {
                    year: year,
                    isLocation: false
                }
                $.ajax({
                    url: `${resourceUrl}/selectAllCityByXzqh`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null && res.length > 0) {

                            for (var i = res.length - 1; i >= 0; i--) {
                                dataCountry.push(res[i].cityName);
                                if (res[i].rate >= 100) {
                                    res[i].rate = 100;
                                }
                                dataCountryValue.push(res[i].rate.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //查询县级数据.
            function selectRateCount(deptId) {
                var year = $('select[name="build_time"]').val();
                data = {
                    deptId: deptId,
                    year: year,
                    hasSelf: true,
                    isLocation: false
                }
                $.ajax({
                    url: `${resourceUrl}/ProjectByCountry`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            for (var i = 0; i < res.project.length; i++) {
                                dataCountry.push(res.project[i].project);
                                if (res.project[i].rate >= 100) {
                                    res.project[i].rate = 100;
                                }
                                dataCountryValue.push(res.project[i].rate.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //查询单个.
            function selectRateName(id) {
                var date = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    date: date
                }
                $.ajax({
                    url: `${resourceUrl}/selectRateName`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            if (res.rate >= 100) {
                                res.rate = 100;
                            }
                            if (res.rates >= 100) {
                                res.rates = 100;
                            }
                            dataCountryValue.push(res.rate.toFixed(2));
                            dataCountryValue.push(res.rates.toFixed(2));
                            // }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //按照城市分类查询.
            function selectTypeCity(deptId) {
                var year = $('select[name="build_time"]').val();
                data = {
                    deptId: deptId,
                    hasSelf: true,
                    isLocation: false,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectCountryByCity`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            for (var i = res.type.length - 1; i >= 0; i--) {
                                dataCountry.push(res.type[i].name);
                                if (res.type[i].rate >= 100) {
                                    res.type[i].rate = 100;
                                }
                                dataCountryValue.push(res.type[i].rate.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //全部查询类型
            function selectTypeAll() {
                var year = $('select[name="build_time"]').val();
                data = {
                    year: year,
                    isLocation: false
                }
                $.ajax({
                    url: `${resourceUrl}/selectAllCity`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            for (var i = res.type.length - 1; i >= 0; i--) {
                                dataCountry.push(res.type[i].name);
                                if (res.type[i].rate >= 100) {
                                    res.type[i].rate = 100;
                                }
                                dataCountryValue.push(res.type[i].rate.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //按照资金来源分类
            function selectBySource() {

                var year = $('select[name="build_time"]').val();
                data = {
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectBySource`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {

                        if (res != null && res.length > 0) {
                            //定义颜色
                            var color1 = '#37a2da';
                            var color2 = '#67e0e3';
                            var color3 = '#ffdb5c';
                            var color4 = '#ff9f7f';
                            var color5 = 'rgb(229, 141, 194)';
                            dataCountry_2 = [];
                            dataCountryValue_2 = [];
                            for (var i = 0; i < res.length; i++) {
                                dataCountry_2.push(res[i].fundsProvided);

                                if (i == 0) { color = color1 }
                                if (i == 1) { color = color2 }
                                if (i == 2) { color = color3 }
                                if (i == 3) { color = color4 }
                                if (i == 4) { color = color5 }
                                var dataValue = {
                                    value: (res[i].plan),
                                    name: res[i].fundsProvided,
                                    itemStyle: {
                                        normal: {
                                            color: color
                                        }
                                    }
                                }
                                dataCountryValue_2.push(dataValue);
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //按照资金来源分类(通过城市查询县)
            function selectBySourceByCity(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectSourceByCity`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null && res.length > 0) {
                            //定义颜色
                            var color1 = '#37a2da';
                            var color2 = '#67e0e3';
                            var color3 = '#ffdb5c';
                            var color4 = '#ff9f7f';

                            dataCountry_2 = [];
                            dataCountryValue_2 = [];
                            for (var i = 0; i < res.length; i++) {
                                dataCountry_2.push(res[i].fundsProvided);

                                if (i == 0) { color = color1 }
                                if (i == 1) { color = color2 }
                                if (i == 2) { color = color3 }
                                if (i == 3) { color = color4 }

                                var dataValue = {
                                    value: (res[i].plan).toFixed(2),
                                    name: res[i].fundsProvided,
                                    itemStyle: {
                                        normal: {
                                            color: color
                                        }
                                    }
                                }
                                dataCountryValue_2.push(dataValue);
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //按照资金来源分类(通过县查询县)
            function selectSourceByCountry(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectSourceByCountry`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null && res.length > 0) {
                            //定义颜色
                            var color1 = '#37a2da';
                            var color2 = '#67e0e3';
                            var color3 = '#ffdb5c';
                            var color4 = '#ff9f7f';

                            dataCountry_2 = [];
                            dataCountryValue_2 = [];
                            for (var i = 0; i < res.length; i++) {
                                dataCountry_2.push(res[i].fundsProvided);

                                if (i == 0) { color = color1 }
                                if (i == 1) { color = color2 }
                                if (i == 2) { color = color3 }
                                if (i == 3) { color = color4 }

                                var dataValue = {
                                    value: (res[i].plan).toFixed(2),
                                    name: res[i].fundsProvided,
                                    itemStyle: {
                                        normal: {
                                            color: color
                                        }
                                    }
                                }
                                dataCountryValue_2.push(dataValue);
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            function selectYuanByProject(id) {

                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectYuanByProject`,
                    data: data,
                    type: 'get',
                    async: false,
                    success: function(res) {

                        if (res != null) {
                            // //定义颜色
                            var color1 = '#37a2da';
                            // var color2 = '#67e0e3';
                            // var color3 = '#ffdb5c';
                            // var color4 = '#ff9f7f';

                            dataCountry_2 = [];
                            dataCountryValue_2 = [];
                            // for (var i = 0; i < res.length; i++) {

                            dataCountry_2.push(res.fundsProvided);
                            // dataCountryValue_2.push(res.plan);
                            // if (i == 0) { color = color1 }
                            // if (i == 1) { color = color2 }
                            // if (i == 2) { color = color3 }
                            // if (i == 3) { color = color4 }
                            { color = color1 }
                            var dataValue = {

                                value: (res.plan).toFixed(2),
                                name: res.fundsProvided,
                                itemStyle: {
                                    normal: {
                                        color: color
                                    }
                                }
                            }
                            dataCountryValue_2.push(dataValue);
                            // }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //第三张图，按月查询总体情况
            function selectYueByAll() {
                var year = $('select[name="build_time"]').val();
                data = {
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectYueByAll`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            maxValue.push(res.plans.toFixed(2));
                            for (var i = 0; i < res.selectYueByCity.length; i++) {
                                dataCountry_3.push(res.selectYueByCity[i].stime);
                                dataCountryByRate.push(res.selectYueByCity[i].rate.toFixed(2));
                                dataCountryByMoney.push(res.selectYueByCity[i].done.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //第三张图，按月查询市情况
            function selectYueByAllByCity(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectYueByAllByCity`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            maxValue.push(res.plans.toFixed(2));

                            for (var i = 0; i < res.selectYueByCity.length; i++) {
                                dataCountry_3.push(res.selectYueByCity[i].stime);
                                dataCountryByRate.push(res.selectYueByCity[i].rate.toFixed(2));
                                dataCountryByMoney.push(res.selectYueByCity[i].done.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //第三张图，按月查询县情况
            function selectYueByCountry(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectYueByCountry`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            maxValue.push(res.plans.toFixed(2));
                            for (var i = 0; i < res.selectYueByCity.length; i++) {
                                dataCountry_3.push(res.selectYueByCity[i].stime);
                                dataCountryByRate.push(res.selectYueByCity[i].rate.toFixed(2));
                                dataCountryByMoney.push(res.selectYueByCity[i].done.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }

            //第三张图，按月查询县情况
            function selectYueByProject(id) {
                var year = $('select[name="build_time"]').val();
                data = {
                    id: id,
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectYueByProject`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res != null) {
                            maxValue.push(res.plans.toFixed(2));
                            for (var i = 0; i < res.selectYueByCity.length; i++) {
                                dataCountry_3.push(res.selectYueByCity[i].stime);
                                dataCountryByRate.push(res.selectYueByCity[i].rate.toFixed(2));
                                dataCountryByMoney.push(res.selectYueByCity[i].done.toFixed(2));
                            }
                        }
                    },
                    error: function(err) {

                    }
                })
            }
            selectTableByAll(showNum);

            function selectTableByAll(showNum) {
                var year = $('select[name="build_time"]').val();
                //查询市，县，项目(总体)
                if (showNum == 1) {
                    var url = `${resourceUrl}/selectTableByAll`;
                    //中央预算内资金
                    var data = {
                        typeId: 2150,
                        year: year
                    }
                    showTable(2150, url, data, null);
                    //中央水利发展资金
                    var data = {
                        typeId: 2151,
                        year: year
                    }
                    showTable(2151, url, data, null);
                    //自治区财政资金
                    var data = {
                        typeId: 2152,
                        year: year
                    }
                    showTable(2152, url, data, null);
                    //其他资金
                    var data = {
                        typeId: 2153,
                        year: year
                    }
                    showTable(2153, url, data, null);

                    //查询市，县，项目(市)
                } else if (showNum == 4) {
                    var id = cityEntity.city.id
                    var url = `${resourceUrl}/selectTableByCity`;
                    //中央预算内资金
                    var data = {
                        typeId: 2150,
                        year: year,
                        id: id
                    }
                    showTable(2150, url, data, id);
                    //中央水利发展资金
                    var data = {
                        typeId: 2151,
                        year: year,
                        id: id
                    }
                    showTable(2151, url, data, id);
                    //自治区财政资金
                    var data = {
                        typeId: 2152,
                        year: year,
                        id: id
                    }
                    showTable(2152, url, data, id);
                    //其他资金
                    var data = {
                        typeId: 2153,
                        year: year,
                        id: id
                    }
                    showTable(2153, url, data, id);


                    //查询市，县，项目(县)
                } else if (showNum == 5) {
                    var url = `${resourceUrl}/selectTableByCountry`;
                    var id = cityEntity.county.id
                        //中央预算内资金
                        //中央预算内资金
                    var data = {
                        typeId: 2150,
                        year: year,
                        id: id
                    }
                    showTable(2150, url, data, id);
                    //中央水利发展资金
                    var data = {
                        typeId: 2151,
                        year: year,
                        id: id
                    }
                    showTable(2151, url, data, id);
                    //自治区财政资金
                    var data = {
                        typeId: 2152,
                        year: year,
                        id: id
                    }
                    showTable(2152, url, data, id);
                    //其他资金
                    var data = {
                        typeId: 2153,
                        year: year,
                        id: id
                    }
                    showTable(2153, url, data, id);


                    //查询市，县，项目(项目)
                } else if (showNum == 6) {
                    var url = `${resourceUrl}/selectTableByProject`;
                    var id = cityEntity.project.id

                    //中央预算内资金
                    //中央预算内资金
                    var data = {
                        typeId: '2150',
                        year: year,
                        id: id
                    }

                    showTable(2150, url, data, id);
                    //中央水利发展资金
                    var data = {
                        typeId: 2151,
                        year: year,
                        id: id
                    }
                    showTable(2151, url, data, id);
                    //自治区财政资金
                    var data = {
                        typeId: 2152,
                        year: year,
                        id: id
                    }
                    showTable(2152, url, data, id);
                    //其他资金
                    var data = {
                        typeId: 2153,
                        year: year,
                        id: id
                    }
                    showTable(2153, url, data, id);
                }

                //总资金
            }



            function showTable(typeId, url, data, id) {

                $.ajax({
                    url: url,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        //中央预算内资金
                        //.toFixed(2),截取小数点后两位
                        if (typeId == 2150) {

                            $('.zyys_jhxd').text(res[0].jhxd.toFixed(2));
                            $('.zyys_lsdw').text(res[0].lsdw.toFixed(2));
                            $('.zyys_lsdwBfb').text(res[0].lsdwBfb.toFixed(2));
                            $('.zyys_wctz').text(res[0].wctz.toFixed(2));
                            $('.zyys_wctzBfb').text(res[0].wctzBfb.toFixed(2));
                            //中央水利发展资金
                        } else if (typeId == 2151) {
                            $('.zysl_jhxd').text(res[0].jhxd.toFixed(2));
                            $('.zysl_lsdw').text(res[0].lsdw.toFixed(2));
                            $('.zysl_lsdwBfb').text(res[0].lsdwBfb.toFixed(2));
                            $('.zysl_wctz').text(res[0].wctz.toFixed(2));
                            $('.zysl_wctzBfb').text(res[0].wctzBfb.toFixed(2));
                            //自治区财政资金
                        } else if (typeId == 2152) {
                            $('.zzq_jhxd').text(res[0].jhxd.toFixed(2));
                            $('.zzq_lsdw').text(res[0].lsdw);
                            $('.zzq_lsdwBfb').text(res[0].lsdwBfb.toFixed(2));
                            $('.zzq_wctz').text(res[0].wctz.toFixed(2));
                            $('.zzq_wctzBfb').text(res[0].wctzBfb.toFixed(2));
                            //其他资金
                        } else if (typeId == 2153) {
                            $('.qt_jhxd').text(res[0].jhxd.toFixed(2));
                            $('.qt_lsdw').text(res[0].lsdw.toFixed(2));
                            $('.qt_lsdwBfb').text(res[0].lsdwBfb.toFixed(2));
                            $('.qt_wctz').text(res[0].wctz.toFixed(2));
                            $('.qt_wctzBfb').text(res[0].wctzBfb.toFixed(2));
                            //总资金
                        }
                        $('.z_jhxd').text(res[1].jhxd.toFixed(2));
                        $('.z_lsdw').text(res[1].lsdw.toFixed(2));
                        $('.z_lsdwBfb').text(res[1].lsdwBfb.toFixed(2));
                        $('.z_wctz').text(res[1].wctz.toFixed(2));
                        $('.z_wctzBfb').text(res[1].wctzBfb.toFixed(2));
                        // maxValue.push(res[1].jhxd.toFixed(2));
                    },
                    error: function(err) {

                    }
                })

            }
            selectAllTouzi();
            //计算总投资情况
            function selectAllTouzi() {
                var year = $('select[name="build_time"]').val();
                var data = {
                    year: year
                }
                $.ajax({
                    url: `${resourceUrl}/selectAllTouzi`,
                    data: data,
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    success: function(res) {
                        if (res.rate >= 100) {
                            res.rate = 100;
                        }
                        $('#wcl').text(res.rate.toFixed(2) + "%");
                    },
                    error: function(err) {

                    }
                })
            }

        }
    }
    return page;
});