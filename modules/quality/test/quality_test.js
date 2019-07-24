/**
 * 质量管理=》质量检测
 */
define("modules/quality/test/quality_test",
    ["jquery", "underscore", "page/tools","layer",
        "echarts",
        "text!modules/quality/test/quality_add.html",
        "modules/projectinfo/utils"
        ],
    function ($, _, tools,layer, echarts, tmpl) {
        var page = function () { };
        page = {
            init: function () {
                tools.setNavData(1);
                var projectData = getProjectData()
                var loginName = tools.getLoginName();
                var myChart = echarts.init(document.getElementById('main'));


                /**
                 * 获取相关项目信息
                 */
                var project = projectData.project;
                var city = projectData.city ;
                var country = projectData.county;

                /**
                 * 质量检测柱状图
                 */
                var linNums = [];
                var linyll = [];
                var linNames =[];
                  var deptId ;
                  var pjId;
                  if (city){
                      deptId = city.id;
                  }
                  if(country){
                      deptId = country.id;
                  }
                  if(project){

                      pjId = project.id;
                  }
                    var data = {
                      deptId:deptId,
                        pjId:pjId
                    };
                  show(false);
                  function show(boo) {
                      $.api.qa.qaTest.showEcharts.exec(data, function (res) {
                           linNames = [];
                           linNums = [];
                           linyll=[];
                          for (var i = 0; i < res.length; i++) {
                              var item = res[i];
                              linNums.push(item.testNum);
                              switch (item.type) {
                                  case "1" :
                                      linNames.push("施工单位自检");
                                      break;
                                  case "2" :
                                      linNames.push("监理单位平检");
                                      break;
                                  case "3" :
                                      linNames.push("项目法人抽检");
                                      break;
                                  case "4" :
                                      linNames.push("监督检测（飞检）");
                                      break;
                                  case "5" :
                                      linNames.push("竣工验收检测");
                                      break;
                              }
                             /* if (item.type == "1") {
                                  linNames.push("施工单位自检");
                              } else if (item.type == "2") {
                                  linNames.push("监理单位平检");
                              } else if (item.type == "3") {
                                  linNames.push("项目法人抽检");
                              } else if (item.type == "4") {
                                  linNames.push("监督检测（飞检）");
                              } else if (item.type == "5") {
                                  linNames.push("竣工验收检测");
                              }*/
                              //linTypes.push(item.type);
                              linyll.push(item.goodRate);
                          }

                          if(boo){
                              var option = myChart.getOption();
                              option.series[0].data = linNums;
                              option.series[1].data = linyll;
                              option.xAxis[0].data = linNames;
                              option.xAxis[1].data = linNames;
                              myChart.setOption(option);
                          }else{
                              renderChart(linNames, linNums, linyll);
                          }
                      });
                  }

                showTable("example", 1);
                showTable("exampleOne", 2);
                showTable("exampleTwo", 3);
                showTable("exampleThree", 4);
                showTable("exampleFour",5);
                function showTable(example, intype) {
                    $('#' + example).bootstrapTable({
                        url: `${API_URL}/qa/qaTest/dataList`,
                       /* contentType: "application/x-www-form-urlencoded",*/
                        method: "get",
                        toolbar: '', //工具按钮用哪个容器
                        striped: true, //是否显示行间隔色
                        pageSize: 10,
                        pageNumber: 1,
                        pageList: [5, 10, 25, 50, 100],
                        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: true, //是否显示分页（*）
                        sortable: true, //是否启用排序
                        sortOrder: "asc", //排序方式
                        uniqueId: "id",
                        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                        queryParams: function () { //请求服务器发送的参数
                            return {
                                pageSize :-1,
                                type:intype,
                                deptId:deptId,
                                pjId:pjId
                            }
                        },
                        responseHandler: function(res) {
                            return res.rows;
                        },
                        columns: [  {
                            title: "全选",
                            checkbox: true,
                            visible: true
                        },
                            {
                                title: '序号',
                               /* sortable: true,*/
                                field: '',
                                width: 1000,
                                formatter: function (value, row, index) {
                                    return index + 1;
                                }
                            },
                            {
                            field: "item",
                            title: "检测项",
                            width: 1000
                        },
                        {
                            field: "testDate",
                            title: "检测时间",
                            width: 1000,
                            formatter: function (value, row, index) {
                                return value ? new Date(value).format('yyyy-MM-dd') : value;
                            }
                        },
                        {
                            field: "sdName",
                            title: "检测单位",
                            width: 1000
                        },
                        {
                            field: "tester",
                            title: "检测人",
                            width: 1000
                        },
                        {
                            field: "conclusion",
                            title: "检测结论",
                            width: 1000,
                            formatter:function (value,row,index) {
                                if (value=='1'){
                                 return '合格';
                                }else {
                                    return '不合格';
                                }
                            }
                        }
                        ],
                        onLoadSuccess: function () {

                        },
                        onLoadError: function () {
                        },
                        onClickRow:function (row) {
                            var $html = _.template(tmpl)({
                                data:row
                            });
                            tools.handleModal({
                                eleId: '#qualityForm',
                                url: "modules/quality/test/quality_add.html",
                                template: $html,
                                param: {
                                    show:{
                                        data: row,
                                        show:true
                                    }
                                },
                                btn: ['关闭'],
                                yes: function () {
                                    layer.closeAll();
                                }
                            });
                        }
                    });
                }

                /**
                 * 新增
                 */
                addBetten("btn_add1", 1);
                addBetten("btn_add2", 2);
                addBetten("btn_add3", 3);
                addBetten("btn_add4", 4);
                addBetten("btn_add5", 5);
                function addBetten(btnAdd,intype) {
                    $('#' + btnAdd).off("click").on('click', function () {
                        //有附件上传，请获取uuid
                        var uuid = tools.getUUID();
                        var title = $(this).data("title");
                        var $html = _.template(tmpl)({
                            data: null
                        });
                        tools.handleModal({
                            title: title,
                            eleId: '#qualityForm',
                            url: "modules/quality/test/quality_add.html",
                            area: ['80%', '90%'],
                            template: $html,
                            param: {
                                add: {
                                    uuid: uuid
                                }
                            },
                            btn: ['保存', '关闭'],
                            yes: function (obj, index, data) {
                                data.id = uuid;
                                data.pjId = projectData.project.id;
                                data.type = intype;
                                data.isNewRecord = true;
                                add(data);
                            }
                        });
                    });
                }
                /**
                 * 删除
                 */
                deletebuttom("btn_delete1","example", 1);
                deletebuttom("btn_delete2","exampleOne", 2);
                deletebuttom("btn_delete3","exampleTwo", 3);
                deletebuttom("btn_delete4","exampleThree", 4);
                deletebuttom("btn_delete5","exampleFour", 5);
                function deletebuttom(btnDelete,example){
                    $('#' + btnDelete).on('click', function () {
                        var $table = ($('#' + example + ''));
                        deleteConfirm($table,function (objs) {
                            var ids = '';
                            for (var i = 0 ;i<objs.length;i++){
                                if(i == objs.length-1){
                                    ids+=objs[i].id;
                                }else{
                                    ids = ids + objs[i].id + ',';
                                }
                            }
                            $.api.qa.qaTest.delflag.exec({
                                ids:ids
                            },function (re) {
                                layer.msg(re.msg);
                                if (re.success){
                                    objs.forEach(function (_this, index) {
                                    })
                                }
                                $table.bootstrapTable('refresh')
                                show(true);
                            });

                        });
                    });
                }

                function add(data) {
                    $.api.qa.qaTest.add.exec(data,function (re) {
                        if (re.success){
                            layer.closeAll();
                            $("#example").bootstrapTable('refresh');
                            $("#exampleOne").bootstrapTable('refresh');
                            $("#exampleTwo").bootstrapTable('refresh');
                            $("#exampleThree").bootstrapTable('refresh');
                            $("#exampleFour").bootstrapTable('refresh');
                             show(true);
                        }
                        layer.msg(re.msg)
                    },'POST');
                }

                function renderChart(linNames,linNums,linyll){
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                       /* toolbox: {
                            feature: {
                                dataView: { show: false, readOnly: false },
                                magicType: { show: false, type: ['line', 'bar'] },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },*/
                        legend: {
                            bottom: '2%',
                            left: 'center',
                            data: [
                                '检验次数(次)', '合格率'
                            ]
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: linNames
                            },
                            {
                                type: 'category',
                                axisLine: { show: false },
                                axisTick: { show: false },
                                axisLabel: { show: false },
                                splitArea: { show: false },
                                splitLine: { show: false },
                                data: linNames
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name:'次数',
                                interval: 2,
                                axisLabel: {
                                    formatter: '{value} 次'
                                }
                            },{
                                type:'value',
                                name:'合格率',
                                min:0,
                                max:100,
                                axisLabel: {
                                    formatter: '{value} %'
                                }
                            }
                        ],
                        series: [
                            {
                                name: '检验次数(次)',
                                type: 'bar',
                                itemStyle: { normal: { color: 'rgba(193,35,43,0.5)' } },
                                barWidth: 30,//柱图宽度
                                data: linNums
                            },
                            {
                                name: '合格率',
                                type: 'line',
                                yAxisIndex: 1,
                                itemStyle: { normal: { color: 'rgba(181,195,52,0.5)' } },
                                barWidth: 30,//柱图宽度
                                data: linyll
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            }
        };
        return page
    });
