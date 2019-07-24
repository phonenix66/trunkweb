/**
 * 质量管理=》总览
 */
define("modules/quality/overview/overview_list", [
    "jquery", "underscore", "page/tools","echarts",
    "bootstrap-datepicker",
    "modules/projectinfo/utils"], function($, _, tools,echarts) {
    var page = function() {};
    page = {
        init: function() {
            tools.setNavData(2);
            var self = this;
            var projectData = getProjectData()
            var loginName = tools.getLoginName();
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);
            if (cityEntity.project == null) {
                $('#ysqks').show();
                $('#ysqk').hide();
            } else {
                $('#ysqks').hide();
                $('#ysqk').show();
            }


            var myDate = new Date();
            var year = myDate.getFullYear(); // 年份
            var startYear = myDate.getFullYear();//起始年份 这个可以自定义前后多少年。
            var endYear = myDate.getFullYear() - 15;//结束年份
            var obj = document.getElementsByClassName('select_time');
            var o;
            for (o = 0; o < obj.length; o++) {
                for (var i = startYear; i >= endYear; i--) {
                    obj[o].options.add(new Option(i));
                }
                //  设置选中当前月
                $(obj[o]).find("option").each(function () {
                    if ($(this).val() === year) {
                        $(this).attr("selected", true)
                    }
                });
            }

            /**
             * 获取相关项目信息
             */
            var project = projectData.project;
            var city = projectData.city;
            var country = projectData.county;

            $('#example').bootstrapTable({
                url: `${API_URL}/qa/qaTest/overviewDataList`,
                method: "get",
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function () { //请求服务器发送的参数
                    var deptId;
                    var pjId;
                    if (city) {
                        deptId = city.id;
                    }
                    if (country) {
                        deptId = country.id;
                    }
                    if (project) {
                        pjId = project.id
                    }
                    return {
                        pageSize: -1,
                        deptId: deptId,
                        pjId: pjId
                    }
                },
                responseHandler: function (res) {
                    var data = res.rows;
                    return data;
                },
                columns: [{
                    field: "type",
                    title: "检测类型",
                    formatter: function (value, row, index) {
                        switch (value) {
                            case "1":
                                return '施工单位自检';
                            case "2":
                                return '监理单位平捡';
                            case "3":
                                return '项目法人抽检';
                            case "4":
                                return '监督检测（飞检）';
                            case "5":
                                return '竣工验收检测';
                        }
                       /* if (value == '1') {
                            return '施工单位自检';
                        } else if (value == '2') {
                            return '监理单位平捡';
                        } else if (value == '3') {
                            return '项目法人抽检';
                        } else if (value == '4') {
                            return '监督检测（飞检）';
                        } else if (value == '5') {
                            return '竣工验收检测';
                        }*/
                    }
                },
                    {
                        field: "testNum",
                        title: "检测次数"
                    },
                    {
                        field: "goodNum",
                        title: "合格个数"
                    },
                    {
                        field: "goodRate",
                        title: "合格率",
                        formatter: function (value, row, index) {
                            return value + '%';
                        }
                    },
                    {
                        field: "passNum",
                        title: "不合格个数"
                    },
                    {
                        field: "passRate",
                        title: "不合格率",
                        formatter: function (value, row, index) {
                            return value + '%';
                        }
                    }
                ]
            });
            $('#exampleOne').bootstrapTable({
                url: `${API_URL}/qa/qaPmDivde/show`,
                method: "get",
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function () { //请求服务器发送的参数
                    var deptId;
                    var pjId;
                    if (city) {
                        deptId = city.id;
                    }
                    if (country) {
                        deptId = country.id;
                    }
                    if (project) {
                        pjId = project.id
                    }
                    return {
                        pageSize: -1,
                        deptId: deptId,
                        pjId: pjId
                    }

                },
                responseHandler: function (res) {
                    var data = res.rows;
                    return data;
                },
                columns: [{
                    field: "pointName",
                    title: "节点类别",
                    formatter:function (value, row, index) {
                        if (value == "2"){
                            return "单位工程";
                        } else if (value =="3") {
                            return "分部工程"
                        } else {
                            return value;
                        }
                    }
                },
                    {
                        field: "pointSum",
                        title: "节点总数量"
                    },
                    {
                        field: "passRate",
                        title: "合格率"
                    },
                    {
                        field: "goodRate",
                        title: "优良率"
                    }
                ]
            });

            var deptId;
            var pjId;
            if (city) {
                deptId = city.id;
            }
            if (country) {
                deptId = country.id;
            }
            if (project) {
                pjId = project.id
            }
            var allPro = null;
            var defcNum = null;
            var inciNum = null;

            if (pjId == null) {
                var yslData = null;
                var passData = null;
                var goodData = null;
                var passNum = null;
                var goodNum = null;
                var yslNum = null;
                var yslRate = null;
                var passRate = null;
                var goodRate = null;
                var data ={
                    deptId:deptId
                };
                $.api.qa.qaOverview.showEcharts.exec(data,function (res) {
                    yslData = res.data['yslList'];
                    passData = res.data['passList'];
                    goodData = res.data['goodList'];
                    yslNum = res.data['ysl'];
                    allPro = res.data['allPro'];
                    passNum = res.data['passNum'];
                    goodNum = res.data['goodNum'];
                    defcNum = res.data['defectsNum'];
                    inciNum = res.data['incidentNum'];
                   /* $.each(res.data,function (key,value) {
                        if(key == 'yslList'){yslData = value;}
                        if (key == 'passList') {passData = value;}
                        if (key == 'goodList') {goodData = value;}
                        if (key == 'ysl') {yslNum = value;}
                        if (key =='allPro') {allPro = value;}
                        if(key == 'passNum'){passNum = value;}
                        if(key == 'goodNum'){goodNum = value;}
                        if(key == 'defectsNum'){ defcNum = value;}
                        if(key == 'incidentNum'){inciNum = value;}
                    });*/
                    if (allPro!=0) {
                        yslRate = (yslNum / allPro* 100).toFixed(2) ;
                    }else {
                        yslRate = 0;
                    }
                    if (yslNum!=0) {
                        passRate = (passNum / yslNum * 100).toFixed(2);
                        goodRate = (goodNum / yslNum * 100).toFixed(2);
                    }else {
                        passRate = 0;
                        goodRate = 0;
                    }
                    self.renderChart(yslRate,yslData,passRate,passData,goodRate,goodData);
                    self.renderText(allPro,defcNum,inciNum);
                });
        }else {
                var data1 ={
                    deptId:deptId,
                    pjId:pjId
                };
                $.api.qa.qaOverview.showEcharts.exec(data1,function (res) {
                    allPro = res.data['allPro'];
                    defcNum = res.data['defectsNum'];
                    inciNum = res.data['incidentNum'];
                    self.renderTexts(allPro,defcNum,inciNum);
                   /* $.each(res.data,function (key,value) {
                        if (key =='allPro') {allPro = value;}
                        if(key == 'defectsNum'){ defcNum = value;}
                        if(key == 'incidentNum'){inciNum = value;}

                        self.renderTexts(allPro,defcNum,inciNum);
                    })*/
                });
            }
        },
        renderChart:function (yslRate,yslData,passRate,passData,goodRate,goodData) {
            // 圆环图各环节的颜色
            var color = ['#37CBCB', '#3BA1FF'];
            var option = {
                title: {
                    text: '验收率',
                    subtext: yslRate + '%',
                    x: 'center',
                    y: 'center'

                },
                // 图例
                legend: [{
                    orient: 'vertical',
                    selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
                    bottom: '0%',
                    left: 'center',
                    itemWidth: 10,             // 图例图形宽度
                    itemHeight: 10,
                    data: ['参与验收个数', '未参与验收个数'],
                    formatter: function (name) {
                        var target;
                        for (var i = 0; i < yslData.length; i++) {
                            if (yslData[i].name === name) {
                                target = yslData[i].value
                            }
                        }
                        var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
                        return arr

                    },
                    textStyle: {                      // 图例的公用文本样式。
                        rich: {
                            a: {
                                fontSize: 16,
                                color: "#0a0a0a"
                            },
                            b: {
                                fontSize: 14,
                                color: "#333"
                            }
                        }
                    }
                }],

                // 提示框
                tooltip: {
                    show: true,                 // 是否显示提示框
                    formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
                },

                /*   // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                   graphic: {
                       type: 'text',               // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                       top: 'center',              // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
                       left: 'center',             // 同上
                       style: {
                           text: '项目验收率',       // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                           fill: '#0a0a0a',           // 填充色。
                           fontSize: 16,           // 字体大小
                           fontWeight: 'bold'		// 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
                       }
                   },*/

                // 系列列表
                series: [{
                    name: '圆环图系列名称',         // 系列名称
                    type: 'pie',                    // 系列类型
                    center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
                    radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
                    hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
                    color: color,                   // 圆环图的颜色
                    label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
                        normal: {
                            show: false,             // 是否显示标签[ default: false ]
                            position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
                            formatter: '{b} :占比{d}%'  // 标签内容
                        }
                    },
                    data: yslData                      // 系列中的数据内容数组。
                }]
            };
            var myChart = echarts.init(document.getElementById('main'));
            myChart.setOption(option);

            var colorHg = ['#55cb9b', '#a5c7ff'];
            var optionTwo = {
                title: {
                    text: '合格率',
                    subtext: passRate + '%',
                    x: 'center',
                    y: 'center'

                },
                // 图例
                legend: [{
                    orient: 'vertical',
                    selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
                    bottom: '0%',
                    left: 'center',
                    itemWidth: 10,             // 图例图形宽度
                    itemHeight: 10,
                    data: ['合格数', '参与验收个数'],
                    formatter: function (name) {
                        var target;
                        for (var i = 0; i < passData.length; i++) {
                            if (passData[i].name === name) {
                                target = passData[i].value
                            }
                        }
                        var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
                        return arr

                    },
                    textStyle: {                      // 图例的公用文本样式。
                        rich: {
                            a: {
                                fontSize: 16,
                                color: "#0a0a0a"
                            },
                            b: {
                                fontSize: 14,
                                color: "#333"
                            }
                        }
                    }
                }],

                // 提示框
                tooltip: {
                    show: true,                 // 是否显示提示框
                    formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
                },

                /*  // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                  graphic: {
                      type: 'text',               // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                      top: 'center',              // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
                      left: 'center',             // 同上
                      style: {
                          text: '项目合格率',       // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                          fill: '#0a0a0a',           // 填充色。
                          fontSize: 16,           // 字体大小
                          fontWeight: 'bold'		// 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
                      }
                  },*/

                // 系列列表
                series: [{
                    name: '圆环图系列名称',         // 系列名称
                    type: 'pie',                    // 系列类型
                    center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
                    radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
                    hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
                    color: colorHg,                   // 圆环图的颜色
                    label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
                        normal: {
                            show: false,             // 是否显示标签[ default: false ]
                            position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
                            formatter: '{b} :占比{d}%'  // 标签内容
                        }
                    },
                    data: passData                      // 系列中的数据内容数组。
                }]
            };
            var myChartHg = echarts.init(document.getElementById('mainTwo'));
            myChartHg.setOption(optionTwo);

            var colorYl = ['#cba895', '#ffb9c7'];
            var optionYl = {
                title: {
                    text: '优良率',
                    subtext: goodRate + '%',
                    x: 'center',
                    y: 'center'

                },
                // 图例
                legend: [{
                    orient: 'vertical',
                    selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
                    bottom: '0%',
                    left: 'center',
                    itemWidth: 10,             // 图例图形宽度
                    itemHeight: 10,
                    data: ['优良数', '参与验收个数'],
                    formatter: function (name) {
                        var target;
                        for (var i = 0; i < goodData.length; i++) {
                            if (goodData[i].name === name) {
                                target = goodData[i].value
                            }
                        }
                        var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
                        return arr

                    },
                    textStyle: {                      // 图例的公用文本样式。
                        rich: {
                            a: {
                                fontSize: 16,
                                color: "#0a0a0a"
                            },
                            b: {
                                fontSize: 14,
                                color: "#333"
                            }
                        }
                    }
                }],

                // 提示框
                tooltip: {
                    show: true,                 // 是否显示提示框
                    formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
                },

                // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                /*   graphic: {
                       type: 'text',               // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
                       top: 'center',              // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
                       left: 'center',             // 同上
                       style: {
                           text: '项目优良率',       // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                           fill: '#0a0a0a',           // 填充色。
                           fontSize: 16,           // 字体大小
                           fontWeight: 'bold'		// 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
                       }
                   },*/

                // 系列列表
                series: [{
                    name: '圆环图系列名称',         // 系列名称
                    type: 'pie',                    // 系列类型
                    center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
                    radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
                    hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
                    color: colorYl,                   // 圆环图的颜色
                    label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
                        normal: {
                            show: false,             // 是否显示标签[ default: false ]
                            position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
                            formatter: '{b} :占比{d}%'  // 标签内容
                        }
                    },
                    data: goodData                      // 系列中的数据内容数组。
                }]
            };
            var myChartThree = echarts.init(document.getElementById('mainThree'));
            myChartThree.setOption(optionYl);
        },
        renderText:function (allPro,defcNum,inciNum) {
            $('.ysk_xmzs').text(allPro);
            $('.ysk_qxgs').text(defcNum);
            $('.ysk_skgs').text(inciNum);
        },
        renderTexts:function (allPro,defcNum,inciNum) {
            if (allPro ==0 ){
                $('.ysk_xmzses').text("未验收");
            }else {
                $('.ysk_xmzses').text("已验收");
            }
            $('.ysk_qxgses').text(defcNum);
            $('.ysk_skgses').text(inciNum);
        }
    };
    return page;
});
