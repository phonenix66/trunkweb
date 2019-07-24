/*项目划分*/
define("modules/projectinfo/project_partition",
    ["jquery", "layer", "page/tools",
        "text!modules/projectinfo/iframs/project_part/project_part_form_dwgc.html",
        "text!modules/projectinfo/iframs/project_part/project_part_form_fbgc.html",
        "modules/projectinfo/utils", "jstree", "bootstrap-table-zh-CN","bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css","jquery-treegrid", "bootstrap-table-treegrid"
    ],
    function ($, layer, tools, templ_dwgc, templ_fbgc) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                var sessionid= sessionStorage.getItem("sessionid")
                var projectData = getProjectData()
                var data = [];
                if (projectData.project==null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                //点击节点 节点类型（1、项目名称 、2、单位工程、3、分部工程）
                var uuid = pjId
                //上传附件
                var settings = {
                    "fileTypeArr":["zip"]
                }
                tools.initFileInput("f_spwjfj", uuid, "PM","F_APPROVE",pjId);
                tools.loadFilesHtml("#filesDiv",uuid,"F_APPROVE")
                //搜索项目
                $("#searchTable").on("click",function () {
                    $('#dataTable').bootstrapTable("refresh")
                })
                var url = `${API_URL}/project_info/divde/dataList`;
                $('#dataTable').bootstrapTable({
                    url:  url,
                    method: "get",
                    contentType: "application/x-www-form-urlencoded",
                    queryParams: function() { //请求服务器发送的参数
                        return {
                            pageSize: -1,
                            pjId:pjId,
                            sessionid:sessionid,
                            name:$("#serVal_table").val(),
                        }
                    },
                    striped: true,
                    height:$("body").height()-260,
                    sidePagination: 'client',
                    //这里是标志id  和 parentIdField有关系
                    idField: 'iId',
                    columns: [
                        {
                        field: "name",
                        title: "节点名称",
                            width:350,
                        formatter:function (value,row,index) {
                            var pointType = row.pointType;
                            if (pointType==1){
                                return value;
                            }
                            return tools.fitTableEditCell("input","name",row.id,value)
                        }
                    },
                        {
                            field: "pointType",
                            title: "节点类型",width:150,
                            formatter:function (value,row,index) {
                                if (value=='1'){
                                    return '<span style="color: #0000cc">项目工程</span>';
                                }else if (value=='2') {
                                    return '<span style="color: #0F71EE">单位工程</span>';
                                }else if (value=='3'){
                                    return '<span style="color: #00a7d0">分部工程</span>';
                                }
                            }
                        },
                        {
                            field: 'chCount',
                            title: '子节点数量',width:100,
                        },
                        {
                            field: "dyNo",
                            title: "单元工程个数",width:100,
                            formatter: function(value, row, index) {
                                var pointType = row.pointType;
                                if (pointType!=3){
                                    return value;
                                }
                                return tools.fitTableEditCell("input","dyNo",row.id,value)
                            }
                        },
                        {
                            field: "majorStatus",
                            title: "是否主要",width:100,
                            formatter: function(value, row, index) {
                                var pointType = row.pointType;
                                if (pointType==1){
                                    return value;
                                }
                                var options = [{value:1,text:"是"},{value:0,text:"否"}]
                                return tools.fitTableEditCell("select","majorStatus",row.id,value,options)
                            }
                        },
                        {
                            field: 'fbIpt',
                            title: '重要隐蔽单元工程个数',width:100,
                            formatter: function(value, row, index) {
                                var pointType = row.pointType;
                                if (pointType!=3){
                                    return value;
                                }
                                return tools.fitTableEditCell("input","fbIpt",row.id,value)
                            }
                        },
                        {
                            field: 'm',
                            title: '操作',width:400,
                            formatter: function (value, row, index) {
                                var pointType = row.pointType;
                                var v = [];
                                if (pointType==1) {
                                    v.push(`<button data-title="添加单位工程" data-point-type="2" data-to="dwgc" data-id="${row.id}" type="button" class="btn btn-info zdy-btn-edit project-add" >添加单位工程</button>`);
                                }
                                if (pointType==2) {
                                    v.push(`<button data-title="删除单位工程" data-to="dwgc" data-id="${row.id}" type="button" class="btn btn-info zdy-btn-edit project-delete" >删除</button>`);
                                    v.push(`<button data-title="添加分部工程" data-point-type="3" data-to="fbgc" data-id="${row.id}" type="button" class="btn btn-info zdy-btn-edit project-add" >添加分部工程</button>`);
                                }
                                if (pointType==3) {
                                    v.push(`<button data-title="删除分部工程" data-to="fbgc" data-id= "${row.id}" type="button" class="btn btn-info zdy-btn-edit project-delete" >删除</button>`);
                                }

                                return v.join(" ")
                            }
                        }
                    ],
                    treeShowField:'name',
                    parentIdField:'fiId',
                    onLoadSuccess:function (data) {
                        $('#dataTable').treegrid({
                            initialState: 'expanded',//收缩 collapsed 展开 expanded
                            treeColumn: 0,//指明第几列数据改为树形
                            expanderExpandedClass: 'glyphicon glyphicon-triangle-bottom',
                            expanderCollapsedClass: 'glyphicon glyphicon-triangle-right',
                            onchange:function () {
                                //$('#dataTable').bootstrapTable('resetWidth');
                                // $('#dataTable').bootstrapTable('resetView');
                            }
                        })
/*************************************** 行编辑事件 ******************/
                        $(".cell-edit").off("blur").on("blur",function () {
                            var $this = $(this);
                            $this.attr("disabled","disabled")
                        })
                        $(".cell-edit").off("change").on("change",function () {
                            var $this = $(this);
                            var id = $this.data("id");
                            var feild = $this.attr("name");
                            var val = $this.val().trim();
                            if (feild=='name'){
                                if (val.length>100) {
                                    layer.msg("文字过长")
                                    return false;
                                }
                            } else if (feild != 'majorStatus') {
                                if (!Number(val)||val.indexOf(".")>-1) {
                                    layer.msg("请输入整数")
                                    return false;
                                }
                                if (val.length>8) {
                                    layer.msg("数值过大")
                                    return false;
                                }
                            }
                            var dataStr = `{"id":"${id}","isNewRecord":"false","${feild}":"${val}" }`
                            $.api.projectInfo.divde.edit.exec(JSON.parse(dataStr),function (res) {
                                if (res.success){
                                    layer.msg("保存成功！")
                                }else {
                                    layer.msg("操作错误！")
                                }
                                $('#dataTable').bootstrapTable("refresh")
                            })
                        })
                /****************************** 删除按钮事件 ************************************/
                $(".project-delete").off("click").on("click", function () {
                    var $this = $(this);
                    var id = $this.data("id");
                    layer.confirm("是否确认删除？", { icon: 3, title: '删除提示' },
                        function (index) {
                            $.api.projectInfo.divde.delete.exec({ids:[id]},function (res) {
                                layer.msg(res.msg)
                                $('#dataTable').bootstrapTable("refresh")
                            })
                            layer.close(index);
                        })


                })
                /****************************** 新增按钮事件 ************************************/
                        //新增
                        $(".project-add").off("click").on("click", function () {
                            var $this = $(this);
                            var to = $this.data("to")
                            var pId = $this.data("id") //父节点Id
                            var pointType = $this.data("point-type") //节点类型
                            var title = $this.data("title")
                            var param ={};
                            param.id=tools.getUUID();
                            param.pjId=pjId;
                            param.pointType=pointType;
                            param.pId=pId;
                            param.name="新增条目";
                            param.isNewRecord=true;
                            $.api.projectInfo.divde.edit.exec(param,function (res) {
                                    $('#dataTable').bootstrapTable("refresh")
                            })
                        })
/*
                        $(".project-add").off("click").on("click", function () {
                            var $this = $(this);
                            var to = $this.data("to")
                            var pId = $this.data("id") //父节点Id
                            var pointType = $this.data("point-type") //节点类型
                            var title = $this.data("title")
                            var url = "modules/projectinfo/iframs/project_part/project_part_form_"+to+".html";
                            var $html = _.template(getTempl(to))();
                            openForm(title, "add", url, $html,function (data) {
                                var names = data.name;
                                var namesLen = 0;
                                if (typeof (names)=='object') {
                                    namesLen = names.length
                                }
                                if (typeof (names)=='string') {
                                    namesLen = 1
                                }
                                var dyNos = data.dyNo;
                                var fbIpts = data.fbIpt;
                                var mark = 0;
                                var lastMsg="";

                                for (let i = 0; i < namesLen; i++) {
                                    var param = $.extend({}, data);
                                    param.name=typeof (names)=='string'?names:names[i];
                                    if (dyNos&&dyNos[i]) param.dyNo=typeof (names)=='string'?dyNos:dyNos[i];
                                    if (fbIpts&&fbIpts[i]) param.fbIpt=typeof (names)=='string'?fbIpts:fbIpts[i];

                                    param.id=tools.getUUID();
                                    param.pjId=pjId;
                                    param.pointType=pointType;
                                    param.pId=pId;
                                    param.isNewRecord=true;
                                    $.api.projectInfo.divde.edit.exec(param,function (res) {
                                        mark++;
                                        console.log("mark : ",mark,namesLen,mark==namesLen)
                                        if (res.success) {
                                        }else {
                                            lastMsg +=param.name +" 添加失败： " +res.msg;
                                        }
                                        if (mark==namesLen) {
                                            $('#dataTable').bootstrapTable("refresh")
                                            console.log(lastMsg)
                                            layer.closeAll()
                                            if (lastMsg){
                                                layer.msg(lastMsg)
                                            } else {
                                                layer.msg("操作成功！")
                                            }
                                        }

                                    })
                                }
                            })
                        })
*/
                    }
                    ,onDblClickCell :function(field, value, row, $element){
                        var pointType = row.pointType;
                        $(".cell-edit").attr("disabled","disabled")
                        $element.find(".cell-edit").removeAttr("disabled");
                        $element.find(".cell-edit").focus();
                    }
                });


/*********************** function ******************************/
                function getTempl(to) {
                    if (to=="dwgc") return templ_dwgc;
                    if (to=="fbgc") return templ_fbgc;
                }
                /**
                 *打开表单
                 * @param mark 标识
                 * @param title
                 * @param url
                 * @param $html
                 */
                function openForm(title, mark, url, $html,fun,obj) {
                    tools.handleModal({
                        eleId: '#form',
                        title: title,
                        url: url,
                        area: ['70%', '60%'],
                        template: $html,
                        param: {
                            data: obj,
                            mark:mark
                        },
                        btn: ['保存', '关闭'],
                        yes: function (obj, index, data) {
                            fun(data)
                        }
                    });
                }



            }
        }
        return page;
    });
