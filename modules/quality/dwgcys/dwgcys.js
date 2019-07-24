/**
 * 质量管理=》单位工程验收
 */
define("modules/quality/dwgcys/dwgcys",
    [
        "jquery", "underscore", "page/tools","layer",
        "echarts", "jquery-treegrid", "bootstrap-table-treegrid"], function($, _, tools,layer,echarts) {
    var page = function() {};
    page = {
        init: function(request) {
            tools.setNavData(1);
            var ysNewData = null;
            var passNewData = null;
            var goodNewData = null;
            var projectData = getProjectData()
            var loginName = tools.getLoginName();
            var myChart = echarts.init(document.getElementById('main'));
            var myChartHg = echarts.init(document.getElementById('mainTwo'));
            var myChartThree = echarts.init(document.getElementById('mainThree'));

            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });

            /**
             * 获取相关项目信息
             */
            var project = projectData.project;
            var city = projectData.city;
            var country = projectData.county;

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

            var data ={
                deptId:deptId,
                pjId:pjId
            };


            show();
            function show(boo) {
                $.api.qa.qaDygcys.showEcharts.exec(data, function (res) {
                    var yslData = null;
                    var passData = null;
                    var goodData = null;
                    var yslRate = null;
                    var passRate = null;
                    var goodRate = null;
                    yslData = res.data['yslList'];
                    ysNewData = res.data['yslList'];
                    passData = res.data['passList'];
                    passNewData = res.data['passList'];
                    goodData = res.data['goodList'];
                    goodNewData = res.data['goodList'];
                    yslRate = res.data['ysRate'];
                    passRate = res.data['passRate'];
                    goodRate = res.data['goodRate'];
                    if (boo){
                        var ysOption = myChart.getOption();
                        ysOption.series[0].data = yslData;
                        ysOption.title[0].subtext = yslRate;
                        var passOption = myChartHg.getOption();
                        passOption.series[0].data = passData;
                        passOption.title[0].subtext = passRate;
                        var goodOption = myChartThree.getOption();
                        goodOption.series[0].data = goodData;
                        goodOption.title[0].subtext = goodRate;
                        myChart.setOption(ysOption);
                        myChartHg.setOption(passOption);
                        myChartThree.setOption(goodOption);

                    } else {
                        renderChart(yslRate, yslData, passRate, passData, goodRate, goodData);
                    }
                });
            }



            $('#example').bootstrapTable({
                url:  `${API_URL}/qa/qaComAcceptance/findList`,
                method: "get",
                contentType: "application/x-www-form-urlencoded",
                queryParams: function() { //请求服务器发送的参数
                    return {
                        pageSize: -1,
                        pjId:pjId
                    }
                },
              /*  height: $('#content').height() - 100,*/
                striped: true,
                sidePagination: 'client',
                //这里是标志id  和 parentIdField有关系
                idField: 'iId',
                columns: [{
                    field: "name",
                    title: "工程名称",
                    width:1000
                },
                    {
                        field: "pointType",
                        title: "节点类型",
                        width:1000,
                        formatter:function (value,row,index) {
                            if (value=='1'){
                                return '项目工程';
                            }else if (value=='2') {
                                return '单位工程';
                            }else if (value=='3'){
                                return '分部工程';
                            }else {
                                return '未知';
                            }
                        }
                    },
                    {
                        field: "pdDate",
                        title: "验评时间",
                        width:1000,
                        formatter: function(value, row, index) {
                            return value ? new Date(value).format('yyyy-MM-dd') : value;
                        }
                    },
                    {
                        field: "lv",
                        title: "工程质量等级",
                        width:1000,
                        formatter:function (value, row, index) {
                            if (value == '0'){
                                return "合格";
                            } else if (value == "1"){
                                return "优良";
                            }else {
                                return "未知";
                            }
                        }
                    },
                    {
                        field: "3",
                        title: "操作",
                        width: 1000,
                        formatter: function (value, row, index) {
                            row._nodes = null;
                            var rowObj = JSON.stringify(row);
                            var v = ``;
                            var tbStatus = row.tbStatus;

                            //查看
                            var kh = `<div class='btn-group'>
						        		<button type='button' class='btn btn-info zdy-btn-show' data='${rowObj}'>查看</button>
						        		&nbsp;&nbsp;</div>`;
                            //编辑
                            var del = `<div class='btn-group'>
					        			<button type='button' class='btn btn-info zdy-btn-edit'  data='${rowObj}'>编辑</button>
					        			</div>`;
                            if (tbStatus=='1'){
                                v = kh ;
                            } else {
                                v = del;
                            }
                            return v;
                        }
                    }
                ],
                treeShowField:'name',
                parentIdField:'fiId',
                onLoadSuccess:function (data) {
                    $('#example').treegrid({
                        initialState: 'collapsed',//收缩
                        treeColumn: 0,//指明第几列数据改为树形
                        expanderExpandedClass: 'glyphicon glyphicon-triangle-bottom',
                        expanderCollapsedClass: 'glyphicon glyphicon-triangle-right',
                        onchange:function () {
                            $('#example').bootstrapTable('resetWidth');
                        }
                    })
                }
            });

            /**
             * 编辑
             */
            $('.row-body').on('click', '.zdy-btn-edit', function() {
                var row = eval('(' + $(this).attr("data") + ')');
                var url = "";
                if (row.pointType =="2"){
                    url ="modules/quality/dwgcys/dwgcys_add.html"
                } else if (row.pointType == "3") {
                    url ="modules/quality/dwgcys/fbgcys_add.html"
                }
                //有附件上传，请获取uuid
                tools.toDialog({
                    id:"dwgc",
                    name: "项目验收",
                    url: url,
                    area:['80%', '90%'],
                    btn: ['保存', '关闭','填报完成'],
                    param: {
                        add: {
                            data:row
                        }
                    },
                    yes: function(obj, index, data) {
                            data.id = row.id;
                            data.pjId = pjId;
                            data.isNewRecord = false;
                            addgc(data);
                    },
                    btn2:function (index) {
                        layer.close(index);
                    },
                    btn3:function (obj, index, data) {
                        layer.confirm("填报完成后不予修改？", { icon: 3, title: '填报完成提示' },
                            function ( index) {
                                    data.id = row.id;
                                    data.pjId = pjId;
                                    data.tbStatus = "1";
                                    data.isNewRecord = false;
                                addgc(data);
                                layer.close(index);
                            })
                    }
                });
            });

            /**
             * 查看
             */
            $('.row-body').on('click', '.zdy-btn-show', function() {
                var data = eval('(' + $(this).attr("data") + ')');
                var url = "";
                if (data.pointType =="2"){
                    url ="modules/quality/dwgcys/dwgcys_show.html"
                } else if (data.pointType == "3") {
                    url ="modules/quality/dwgcys/fbgcys_show.html"
                }
                tools.toDialog({
                    name: "工程验收",
                    url: url,
                    param: {
                        show: {
                            data:data,
                            show:true
                        }
                    },
                    btn: ['关闭'],
                    yes: function() {
                        layer.closeAll();
                    }
                });
            });

            function addgc(data){
                 $.api.qa.qaPmDivde.add.exec(data,function (res) {
                     if (res.success){
                         layer.closeAll();
                         $("#example").bootstrapTable('refresh');
                         show(true);
                     }
                    layer.msg(res.msg)
                 },'POST');
            }


            /*************项目验收表格开始**************/
            $('#exampleone').bootstrapTable({
                url: `${API_URL}/qa/qaComAcceptance/dataList`,
                method: "get",
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                pageList: [5, 10, 25, 50, 100],
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function () { //请求服务器发送的参数
                    var deptId ;
                    if (city){
                        deptId = city.id;
                    }
                    if(country){
                        deptId = country.id;
                    }
                    return {
                        pageSize :-1,
                        deptId:deptId,
                        pjId:project.id
                    }
                },
                responseHandler: function (res) {
                    return res.rows;
                },
                columns: [
                    {
                        field: "pjName",
                        title: "项目名称",
                        width: 1000
                    },
                    {
                        field: "pjType",
                        title: "项目类型",
                        width: 1000
                    },
                    {
                        field: "comResult",
                        title: "竣工验收结论",
                        width: 1000
                    },
                    {
                        field: "qaGrade",
                        title: "质量等级",
                        width: 1000,
                        formatter:function (value,row,index) {
                            if (value=='0'){
                                return '合格';
                            }else if (value=='1') {
                                return '优良';
                            }else {
                                return '未知';
                            }
                        }
                    },
                    {
                        field: "accDate",
                        title: "验收评定时间",
                        width: 1000,
                        formatter: function (value, row, index) {
                            return value ? new Date(value).format('yyyy-MM-dd') : value;
                        }
                    },
                    {
                        field: "receiveStatus",
                        title: "是否验收",
                        width: 1000,
                        formatter:function (value,row,index) {
                            if (value=='0'){
                                return '否';
                            }else if (value=='1') {
                                return '是';
                            }else {
                                return '未知';
                            }
                        }
                    },
                    {
                        field: "remarks",
                        title: "备注",
                        width: 1000
                    } ,
                    {
                        field: "3",
                        title: "操作",
                        width: 1000,
                        formatter: function (value, row, index) {
                            row._nodes = null;
                            var rowObj = JSON.stringify(row);
                            var v = ``;
                            var tbStatus = row.tbStatus;
                            //查看
                            var kh = `<div class='btn-group'>
						        		<button type='button' class='btn btn-info zdy-btn-show1' data='${rowObj}'>查看</button>
						        		&nbsp;&nbsp;</div>`;
                            //填报
                            var sb = `<div class='btn-group'>
					        			<button type='button' class='btn btn-info zdy-btn-edit1'  data='${rowObj}'>填报</button>
					        			</div>`;
                            if (tbStatus=="1"){
                                v = kh;
                            } else {
                                v =sb ;
                            }
                            return v;
                        }
                    }
                ]
            });

            /**
             * 填报
             */
           $('.row-body').on('click', '.zdy-btn-edit1', function() {
               var row = eval('(' + $(this).attr("data") + ')');
               //有附件上传，请获取uuid
               var uuid = tools.getUUID();
               tools.toDialog({
                   id:"dwgc",
                   name: "项目验收",
                   url: "modules/quality/dwgcys/comAcceptance_add.html",
                   area:['80%', '90%'],
                   btn: ['保存', '关闭','填报完成'],
                   param: {
                       add: {
                           data:row
                       }
                   },
                   yes: function(obj, index, data) {
                       if (row.id != null){
                           data.id = row.id;
                           data.pjId = pjId;
                           data.isNewRecord = false;
                           add(data);
                       } else {
                           data.id = uuid;
                           data.pjId = pjId;
                           data.isNewRecord = true;
                           add(data);
                       }
                   },
                   btn2:function (index) {
                       layer.close(index);
                   },
                   btn3:function (obj, index, data) {
                       layer.confirm("填报完成后不予修改？", { icon: 3, title: '填报完成提示' },
                           function ( index) {
                               if (row.id != null){
                                   data.id = row.id;
                                   data.pjId = pjId;
                                   data.tbStatus = "1";
                                   data.isNewRecord = false;
                                   add(data);
                               } else {
                                   data.id = uuid;
                                   data.pjId = pjId;
                                   data.tbStatus = "1";
                                   data.isNewRecord = true;
                                   add(data);
                               }
                               layer.close(index);
                           })
                   }

               });

            });

            /**
             * 查看
             */
            $('.row-body').on('click', '.zdy-btn-show1', function() {
                var data = eval('(' + $(this).attr("data") + ')');
                tools.toDialog({
                    name: "工程验收",
                    url:  "modules/quality/dwgcys/comAcceptance_show.html",
                    param: {
                        show: {
                            data:data,
                            show:true
                        }
                    },
                    btn: ['关闭'],
                    yes: function() {
                        layer.closeAll();
                    }
                });
            });

            function add(data) {
                console.log(data);
                $.api.qa.qaComAcceptance.add.exec(data,function (res) {
                    if (res.success){
                        layer.closeAll();
                        $("#exampleone").bootstrapTable('refresh');
                    }
                    layer.msg(res.msg)
                },'POST');
            }
            /***********************项目验收表格结束*******************************/

            function renderChart(yslRate,yslData,passRate,passData,goodRate,goodData) {


                // 圆环图各环节的颜色
                var color = ['#37CBCB', '#3BA1FF'];
                var ysOption = {
                    title: {
                        text: '验收率',
                        subtext: yslRate ,
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
                        data:yslData,
                         formatter: function (name) {
                             if(ysNewData == null){
                                 ysNewData = yslData;
                             }
                            var target;
                            for (var i = 0; i < ysNewData.length; i++) {
                                if (ysNewData[i].name === name) {
                                    target = ysNewData[i].value
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
                myChart.setOption(ysOption);

                var colorHg = ['#55cb9b', '#a5c7ff'];
                var passOption = {
                    title: {
                        text: '合格率',
                        subtext: passRate ,
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
                        data:passData,
                        formatter: function (name) {
                            if (passNewData == null){
                                passNewData = passData;
                            }
                            var target;
                            for (var i = 0; i < passNewData.length; i++) {
                                if (passNewData[i].name === name) {
                                    target = passNewData[i].value
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
                myChartHg.setOption(passOption);

                var colorYl = ['#cba895', '#ffb9c7'];
                var goodOption = {
                    title: {
                        text: '优良率',
                        subtext: goodRate ,
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
                        data: goodData,
                        formatter: function (name) {
                            if (goodNewData == null){
                                goodNewData = goodData;
                            }
                            var target;
                            for (var i = 0; i < goodNewData.length; i++) {
                                if (goodNewData[i].name === name) {
                                    target = goodNewData[i].value
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
                myChartThree.setOption(goodOption);
            }
        }
        // renderChart:function (yslRate,yslData,passRate,passData,goodRate,goodData) {
        //     // 圆环图各环节的颜色
        //     var color = ['#37CBCB', '#3BA1FF'];
        //     var option = {
        //         title: {
        //             text: '验收率',
        //             subtext: yslRate ,
        //             x: 'center',
        //             y: 'center'
        //
        //         },
        //         // 图例
        //         legend: [{
        //             orient: 'vertical',
        //             selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
        //             bottom: '0%',
        //             left: 'center',
        //             itemWidth: 10,             // 图例图形宽度
        //             itemHeight: 10,
        //             data: ['参与验收个数', '未参与验收个数'],
        //             formatter: function (name) {
        //                 var target;
        //                 for (var i = 0; i < yslData.length; i++) {
        //                     if (yslData[i].name === name) {
        //                         target = yslData[i].value
        //                     }
        //                 }
        //                 var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
        //                 return arr
        //
        //             },
        //             textStyle: {                      // 图例的公用文本样式。
        //                 rich: {
        //                     a: {
        //                         fontSize: 16,
        //                         color: "#0a0a0a"
        //                     },
        //                     b: {
        //                         fontSize: 14,
        //                         color: "#333"
        //                     }
        //                 }
        //             }
        //         }],
        //
        //         // 提示框
        //         tooltip: {
        //             show: true,                 // 是否显示提示框
        //             formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
        //         },
        //
        //         // 系列列表
        //         series: [{
        //             name: '圆环图系列名称',         // 系列名称
        //             type: 'pie',                    // 系列类型
        //             center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
        //             radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
        //             hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
        //             color: color,                   // 圆环图的颜色
        //             label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
        //                 normal: {
        //                     show: false,             // 是否显示标签[ default: false ]
        //                     position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
        //                     formatter: '{b} :占比{d}%'  // 标签内容
        //                 }
        //             },
        //             data: yslData                      // 系列中的数据内容数组。
        //         }]
        //     };
        //     myChart.setOption(option);
        //
        //     var colorHg = ['#55cb9b', '#a5c7ff'];
        //     var optionTwo = {
        //         title: {
        //             text: '合格率',
        //             subtext: passRate ,
        //             x: 'center',
        //             y: 'center'
        //
        //         },
        //         // 图例
        //         legend: [{
        //             orient: 'vertical',
        //             selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
        //             bottom: '0%',
        //             left: 'center',
        //             itemWidth: 10,             // 图例图形宽度
        //             itemHeight: 10,
        //             data: ['合格个数', '参与验收个数'],
        //             formatter: function (name) {
        //                 var target;
        //                 for (var i = 0; i < passData.length; i++) {
        //                     if (passData[i].name === name) {
        //                         target = passData[i].value
        //                     }
        //                 }
        //                 var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
        //                 return arr
        //
        //             },
        //             textStyle: {                      // 图例的公用文本样式。
        //                 rich: {
        //                     a: {
        //                         fontSize: 16,
        //                         color: "#0a0a0a"
        //                     },
        //                     b: {
        //                         fontSize: 14,
        //                         color: "#333"
        //                     }
        //                 }
        //             }
        //         }],
        //
        //         // 提示框
        //         tooltip: {
        //             show: true,                 // 是否显示提示框
        //             formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
        //         },
        //
        //         // 系列列表
        //         series: [{
        //             name: '圆环图系列名称',         // 系列名称
        //             type: 'pie',                    // 系列类型
        //             center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
        //             radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
        //             hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
        //             color: colorHg,                   // 圆环图的颜色
        //             label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
        //                 normal: {
        //                     show: false,             // 是否显示标签[ default: false ]
        //                     position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
        //                     formatter: '{b} :占比{d}%'  // 标签内容
        //                 }
        //             },
        //             data: passData                      // 系列中的数据内容数组。
        //         }]
        //     };
        //     myChartHg.setOption(optionTwo);
        //
        //     var colorYl = ['#cba895', '#ffb9c7'];
        //     var optionYl = {
        //         title: {
        //             text: '优良率',
        //             subtext: goodRate ,
        //             x: 'center',
        //             y: 'center'
        //
        //         },
        //         // 图例
        //         legend: [{
        //             orient: 'vertical',
        //             selectedMode: true,             // 图例选择的模式，控制是否可以通过点击图例改变系列的显示状态。默认开启图例选择，可以设成 false 关闭。
        //             bottom: '0%',
        //             left: 'center',
        //             itemWidth: 10,             // 图例图形宽度
        //             itemHeight: 10,
        //             data: ['优良个数', '参与验收个数'],
        //             formatter: function (name) {
        //                 var target;
        //                 for (var i = 0; i < goodData.length; i++) {
        //                     if (goodData[i].name === name) {
        //                         target = goodData[i].value
        //                     }
        //                 }
        //                 var arr = ["{b|" + name + "}", "{a|" + target + "}个"];
        //                 return arr
        //
        //             },
        //             textStyle: {                      // 图例的公用文本样式。
        //                 rich: {
        //                     a: {
        //                         fontSize: 16,
        //                         color: "#0a0a0a"
        //                     },
        //                     b: {
        //                         fontSize: 14,
        //                         color: "#333"
        //                     }
        //                 }
        //             }
        //         }],
        //
        //         // 提示框
        //         tooltip: {
        //             show: true,                 // 是否显示提示框
        //             formatter: '{b} </br> 个数:{c}个 </br> 占比:{d}%'      // 提示框显示内容,此处{b}表示各数据项名称，此项配置为默认显示项，{c}表示数据项的值，默认不显示，({d}%)表示数据项项占比，默认不显示。
        //         },
        //
        //         // 系列列表
        //         series: [{
        //             name: '圆环图系列名称',         // 系列名称
        //             type: 'pie',                    // 系列类型
        //             center: ['50%', '50%'],           // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。[ default: ['50%', '50%'] ]
        //             radius: ['45%', '60%'],         // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
        //             hoverAnimation: true,           // 是否开启 hover 在扇区上的放大动画效果。[ default: true ]
        //             color: colorYl,                   // 圆环图的颜色
        //             label: {                        // 饼图图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等.
        //                 normal: {
        //                     show: false,             // 是否显示标签[ default: false ]
        //                     position: 'outside',    // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
        //                     formatter: '{b} :占比{d}%'  // 标签内容
        //                 }
        //             },
        //             data: goodData                      // 系列中的数据内容数组。
        //         }]
        //     };
        //     myChartThree.setOption(optionYl);
        // }
    };
    return page;
});
