/*重大设计变更*/
define("modules/projectinfo/design_change",
    ["jquery","layer","page/tools",
        "underscore",
        "text!modules/projectinfo/iframs/design_change/form.html",
        "modules/projectinfo/utils","bootstrap-datepicker","bootstrap-table","bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css"],
    function ($,layer,tools,_,templ) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                $('.datepicker').datepicker();
                var projectData = getProjectData()
                if (projectData.project==null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                /*标题列*/
                var clumns = [
                    {
                        title: "全选",
                        checkbox: true,
                        visible: true
                    },
                    {
                        title: '序号',
                        field: '',
                        formatter: function (value, row, index) {
                            return index + 1;
                        }
                    },
                    {field: "applyComp", title: "申请单位"
                    },
                    {field: "content", title: "变更内容"
                    },
                    {field: "dcDate", title: "变更时间",sortable:true,
                        formatter: function (value, row, index) {
                            return fitDateStr(value)
                        }
                    },
                    {field: "dcNo", title: "变更文号"
                    },
                    {field: "dcUnit", title: "审查单位"
                    },
                    {field: "checkNo", title: "审查文号"
                    },
                    {field: "checkUnit", title: "审批单位"
                    },
                    {field: "workable", title: "落实责任人"
                    },
                    {field: "workstatus", title: "落实情况"
                    }
                ]
                function buildTable(){
                    var param = dataFormObj("#search_form")
                    param.pjId=pjId;
                    $.api.projectInfo.designChange.dataList.exec(param,function (res) {
                        var data = res.data;
                        buildSampleTable($("#dataTable").html('<table id="table"></table>').find('table'),data, clumns,null,{
                            onClickRow:function (row) {
                                openRow(row)
                            }
                        })
                    })
                }
                buildTable()
                $("#btn_search").on("click",function () {
                    buildTable()
                })

                var $html = _.template(templ)()
                $("#btn_add").on("click",function () {
                    openForm("新增设计变更信息",$html,function (data) {
                        data.pjId=pjId;
                        data.isNewRecord=true;
                        $.api.projectInfo.designChange.edit.exec(data,function (res) {
                            if (res.success){
                                layer.closeAll()
                                buildTable()
                            }
                            layer.msg(res.msg)
                        })
                    })
                })
                $("#btn_edit").on("click",function () {
                    var obj = tableHasOneChoose($("#table"))
                    if (!obj) return;
                    openForm("修改设计变更信息",$html,function (data) {
                        data.pjId=pjId;
                        data.isNewRecord=false;
                        $.api.projectInfo.designChange.edit.exec(data,function (res) {
                            if (res.success){
                                layer.closeAll()
                                buildTable()
                            }
                            layer.msg(res.msg)
                        })
                    },obj)

                })
                function openRow(row){
                    var view = false;
                    var obj = row;
                    if (!obj) return;
                    openForm("设计变更信息",$html,function (data) {
                        data.pjId=pjId;
                        data.isNewRecord=false;
                        $.api.projectInfo.designChange.edit.exec(data,function (res) {
                            if (res.success){
                                layer.closeAll()
                                buildTable()
                            }
                            layer.msg(res.msg)
                        })
                    },obj,view)
                }
                $("#btn_view").on("click",function () {
                    var obj = tableHasOneChoose($("#table"))
                    if (!obj) return;
                    openForm("查看设计变更信息",$html,function (data) {
                                layer.closeAll()
                    },obj,true)

                })
                $("#btn_delete").on("click",function () {
                    deleteConfirm($("#table"),function (objs) {
                        var ids = []
                        for (var obj of objs){
                            ids.push(obj.id)
                        }
                        $.api.projectInfo.designChange.delete.exec({ids:ids},function (res) {
                            if (res.success){
                                buildTable()
                            }
                            layer.msg(res.msg)
                        })
                    })

                })
                $("#btn_down1").on("click",function () {
                    var obj = tableHasChoose($("#table"))
                    if (!obj) return;

                })
                $("#btn_down2").on("click",function () {
                    var obj = tableHasChoose($("#table"))
                    if (!obj) return;

                })
                /**
                 * 弹窗
                 * @param title 标题
                 * @param $html 模板
                 * @param fun(data) 回调
                 */
                function openForm(title,$html,fun,row,view) {
                    tools.handleModal({
                        title:title,
                        template:$html,
                        //area:["70%","50%"],
                        url:"modules/projectinfo/iframs/design_change/form.html",
                        eleId:"#form",
                        param: {
                            row: row,
                            view:view
                        },
                        btn:["保存","关闭"],
                        yes:function(obj, index, data){
                            fun(data)
                            layer.closeAll()
                        }
                    })
                }


            }
        }
        return page;
    });