/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/statistics/xmtjb/xmtjb", ["jquery", "underscore", "page/tools","bootstrap-table","bootstrap-table-x-editable","bootstrap-datepicker"], function($, _, tools) {

    var page = function() {};
    page = {
        init: function(request) {
            $('#projectNav').hide();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);

            //项目所在地
            $("#gsd").on("click",function () {
                tools.chooseDeptTree($("#p"),function (obj) {
                    console.log(obj)
                    $("#gsdId").val(obj.id)
                    $("#gsd").val(obj.sdPathname)
                },2)
            })
            $('#elyMang').bootstrapTable({
                url: tools.API_URL+"/project_info/xmtjbList",
                // url: "modules/statistics/xmtjb/data.json",
                height:$("body").height()-200,
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                pageSize: 50,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: true, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                pageList: [50, 100,"ALL"],
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数
                    var searchParam = {pjName:$("#name").val(),locationId:$("#gsdId").val()};
                    searchParam.sessionid = sessionStorage.getItem("sessionid")
                    searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                    searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                    searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                    return searchParam;
                },
                // sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                responseHandler:function(res){
                    return res.data||[];
                }, columns: [
                    /*[
                        {
                            field: "slgctjb",
                            title: "水利工程建设项目质量举报投诉、缺陷和事故处理情况统计表",
                            colspan:11,
                            valign:'middle',
                            align:'center'
                        }
                    ],*/
                    [
                        {
                            title: '序号',
                            field: '',
                            formatter: function (value, row, index) {
                                return index+1;
                            },
                            rowspan:2,
                            colspan:1,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "xmgk",
                            title: "项目慨况",
                            rowspan:1,
                            colspan:5,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "jcdw",
                            title: "检测单位",
                            rowspan:1,
                            colspan:3,
                            valign:'middle',
                            align:'center'
                        },
                        {
                            field: "zljddw",
                            title: "质量监督单位",
                            rowspan:2,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        /*{
                            field: "bz",
                            title: "备注",
                            rowspan:2,
                            valign:'middle',
                            align:'center'
                        }*/
                    ],
                    [
                        {
                            field: "xmmc",
                            title: "项目名称",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "xmlx",
                            title: "项目类型",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "pfgs",
                            title: "批复概算(万元)",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'right',
                            formatter:function (val,row,index) {
                                if (val){
                                    return val.toFixed(2);
                                }
                                return val;
                            }
                        },{
                            field: "kgsj",
                            title: "开工时间（年月）",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "xxjd",
                            title: "形象进度",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "sgzjdw",
                            title: "施工自检单位",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "jlpxjcdw",
                            title: "监理平行检测单位",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        },
                        {
                            field: "zjdw",
                            title: "终检单位",
                            rowspan:1,
                            valign:'middle',
                            sortable:true,
                            align:'center'
                        }

                    ]


                ]
            });

            //条件查询
            $("#query").on("click",function(){
                $('#elyMang').bootstrapTable('refresh');
            });

            //条件查询
            $("#reset").on("click",function(){
                $('#gsdId').val("");
                $('#elyMang').bootstrapTable('refresh');
            });

            //导出
            $("#btn_export").on("click",function(){
                var name = $("#name").val()
                var sessionid = sessionStorage.getItem("sessionid")
                var url = `${API_URL}/project_info/xmtjbExport?sessionid=${sessionid}&pjName=${name}`
                console.log(url)
                window.open(url)
            });

        }
    };

    return page;
});
