/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/zlyaqyhtjb/zlyaqyhtjb", ["jquery", "underscore", "page/tools","layer","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools,layer) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').show();
            var resourceUrl = `${tools.API_URL}/sa/saHiddenDanger`;

            //给年份下拉框赋值
            tools.showYear();

            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);
            var projectId = '';
            var projectName = '';
            var countyId = '';
            var cityId = '';
            //设置项目id
            if(cityEntity !=null ){
                if(cityEntity.project != null && cityEntity != ''){
                    projectId = cityEntity.project.id;
                    projectName= cityEntity.project.pjName;
                }else if(cityEntity != null && cityEntity.county != null){
                    countyId = cityEntity.county.id;
                }else if(cityEntity != null && cityEntity.city != null){
                    cityId = cityEntity.city.id;
                }
            }


            $('#elyMang').bootstrapTable({
                url: `${resourceUrl}/data`,
                // url: "modules/statistics/zlyaqyhtjb/data.json",
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                pageList: [50, 100],
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数
                    var searchParam = {};
                    if(cityId != ''){
                        searchParam = {cityId:cityId};
                    }else if(countyId != ''){
                        searchParam = {countyId:countyId};
                    }else if(projectId != ''){
                        searchParam = {pjId:projectId};
                    }
                    searchParam.year = $('#year').val();
                    searchParam.sessionid = sessionStorage.getItem("sessionid")
                    searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                    searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                    searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                    return searchParam;
                },
                // sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                responseHandler:function(res){
                    return res.rows;
                },
                // onClickRow:function (row,$element) {
                //     update(row);
                // },
                columns: [
                    [
                        {
                            field: "zlyaqyhtjb",
                            title: "西藏自治区水利质量与安全隐患排查平台",
                            colspan:15,
                            valign:'middle',
                            align:'center'
                        }
                    ],
                    [
                        {
                            field: "zazxlrq",
                            title: "质安中心录入区<span class='zazxlrq'>2018</span>年",
                            colspan:15,
                            valign:'middle',
                            align:'center'
                        }
                    ],
                    [
                        // {
                        //     title: "全选",
                        //     checkbox: true,
                        //     visible: true
                        // },
                        {
                            field: "hdCode",
                            title: "隐患编号",
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "hdPersionLiable",
                            title: "被检查单位(责任人)",
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "pjName",
                            title: "项目名称",
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "inspectionDate",
                            title: "检查时间",
                            valign:'middle',
                            width:100,
                            align:'center'
                        },
                        {
                            field: "hdContent",
                            title: "隐患内容",
                            valign:'middle',
                            width:200,
                            align:'center'
                        },
                        {
                            field: "hdType",
                            title: "隐患类别",
                            valign:'middle',
                            align:'center',
                            formatter: function (value, row, index) {
                                switch(value) {
                                    case '1':
                                        return "质量";
                                    case '2':
                                        return "安全";
                                    case '3':
                                        return "质量、安全";
                                    default:
                                        return "未定义";
                                }
                            }
                        },
                        {
                            field: "zgRequirment",
                            title: "整改要求",
                            valign:'middle',
                            width:200,
                            align:'center'
                        },
                        {
                            field: "reviewDate",
                            title: "复查时间",
                            valign:'middle',
                            width:100,
                            align:'center'
                        },
                        {
                            field: "zgSituation",
                            title: "整改情况",
                            valign:'middle',
                            width:200,
                            align:'center'
                        },
                        {
                            field: "gpdbSituation",
                            title: "挂牌督办情况",
                            valign:'middle',
                            align:'center',
                            formatter: function (value, row, index) {
                                switch(value) {
                                    case '1':
                                        return "是";
                                    case '0':
                                        return "否";
                                    default:
                                        return "未定义";
                                }
                            }
                        },
                        {
                            field: "salesDate",
                            title: "销号日期",
                            valign:'middle',
                            width:100,
                            align:'center'
                        },
                        {
                            field: "salesCompany",
                            title: "销号单位或人",
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "inputBy",
                            title: "录入人员",
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "remarks",
                            width:200,
                            title: "备注",
                            valign:'middle',
                            align:'center'
                        }
                    ]


                ]
            });

            // /*增加*/
            // $('.row-body').on("click", '#btn_add', function () {
            //     if(projectId != ''){
            //         tools.toDialog({
            //             name: "增加",
            //             url: "modules/statistics/zlyaqyhtjb/zlyaqyhtjb_add.html",
            //             param: {
            //                 add: true,
            //                 projectId:projectId,
            //                 projectName:projectName
            //             },
            //             btn: ['保存', '关闭'],
            //             yes: function(obj, index, data) {
            //                 add(data);
            //             }
            //         });
            //     }else{
            //         layer.msg("请选择项目");
            //     }
            //
            // });
            //
            // /*删除*/
            // $('.row-body').on("click", '#btn_delete', function () {
            //     var obj = $('#elyMang').bootstrapTable("getSelections");
            //
            //     if(obj.length >0){
            //         //将集合的id连起来，逗号隔开
            //         var ids = '';
            //         for(var i = 0 ;i<obj.length; i++){
            //             if(i == 0){
            //                 ids+=obj[i].id;
            //             }else{
            //                 var objs = ','+obj[i].id;
            //                 ids+=objs;
            //             }
            //         }
            //
            //         layer.confirm("确定要删除此清单项目？", {
            //             title: '提示'
            //         }, function (index) {
            //             var data = {ids: ids };
            //             $.api.sa.hiddenDanger.deleteAll.exec(data,function (res) {
            //                 if (res.success){
            //                     var year = $("#year").val();
            //                     var hdCode = $("#hdCode").val();
            //                     var query = {"year":year,hdCode:hdCode};
            //                     $('#elyMang').bootstrapTable('refresh',{query: query});
            //                     layer.closeAll();
            //                 }
            //                 layer.msg(res.msg)
            //             });
            //         })
            //     }else{
            //         layer.msg("请选择要操作的数据！")
            //         return;
            //     }
            // });


            $('.row-body').on("click", '#btn_export', function () {
                var url = tools.API_URL+`/sa/saHiddenDanger/outputExcel`;
                var year = $('#year').val();
                var hdCode = $("#hdCode").val();
                var datas = [
                    { year:year,
                      pjId:projectId,
                      hdCode:hdCode}
                ];
                if(cityId != ''){
                    datas[0].cityId=cityId;
                }else if(countyId != ''){
                    datas[0].countyId=countyId;
                }else if(projectId != ''){
                    datas[0].pjId=projectId;
                }
                tools.outputExcel(datas,url);
            });


            // function add(data){
            //     $.api.sa.hiddenDanger.add.exec(data,function (res) {
            //         if (res.success){
            //             var year = $("#year").val();
            //             var hdCode = $("#hdCode").val();
            //             var query = {"year":year,
            //                           pjId:projectId,
            //                           hdCode:hdCode};
            //             $('#elyMang').bootstrapTable('refresh',{query: query});
            //             layer.closeAll();
            //         }
            //         layer.msg(res.msg)
            //     });
            // }
            //
            // function update(data){
            //     tools.toDialog({
            //         name: "修改",
            //         url: "modules/statistics/zlyaqyhtjb/zlyaqyhtjb_add.html",
            //         param: {
            //             edit: true,
            //             data:data
            //         },
            //         btn: ['保存', '关闭'],
            //         yes: function(obj, index, data) {
            //             $.api.sa.hiddenDanger.update.exec(data,function (res) {
            //                 if (res.success){
            //                     var year = $("#year").val();
            //                     var hdCode = $("#hdCode").val();
            //                     var query = {"year":year,pjId:projectId,hdCode:hdCode};
            //                     $('#elyMang').bootstrapTable('refresh',{query: query});
            //                     layer.closeAll();
            //                 }
            //                 layer.msg(res.msg)
            //             });
            //         }
            //     });
            // }


            //条件查询
            $("#query").on("click",function(){
                setTitle();
                var year = $("#year").val();
                var hdCode = $("#hdCode").val();
                var query = {"year":year,hdCode:hdCode};
                $('#elyMang').bootstrapTable('refresh',{query: query});
            });


            //设置表格中table
            setTitle();
            function setTitle() {
                //获得年份
                var year = $('#year').val();
                //获得月份
                $('.zazxlrq').text(year);
            }

        }
    };

    return page;
});
