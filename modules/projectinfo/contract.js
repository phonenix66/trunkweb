/*合同管理*/
define("modules/projectinfo/contract",
    ["jquery","layer","page/tools","underscore",
        "text!modules/projectinfo/iframs/contract/form.html",
        "bootstrap-table","bootstrap-fileinput-locale-zh",
    "modules/projectinfo/utils",
    "css!/css/projectinfo.css"
], function ($,layer,tools,_,templ) {
    var page = function () {
    };
    page = {
        init: function (request) {
            tools.setNavData(1)
            var projectData = getProjectData()
            if (projectData.project==null) {
                loadingPage()
            }
            // var pjId = "d29cb5c9605b442d822c64eff934b58b";
            var pjId = projectData.project.id;
            tools.getDictValue(dictTypeIdEnum.cType,"cType")
            //上传附件
            function buildTable(){
                var param = dataFormObj("#search_form")
                param.pjId=pjId,
                    $.api.projectInfo.contract.dataList.exec(param,function (res) {
                        buildSampleTable($("#dataTable")
                                .html('<table id="table"></table>').find('table'),res.data,
                            [
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
                                {field: "cType", title: "合同类型",
                                    formatter: function (value, row, index) {
                                        return fitDictName(dictTypeIdEnum.cType,value)
                                    }
                                },
                                {field: "cName", title: "合同名称"
                                },
                                {field: "signinger", title: "合同签订单位"
                                },
                                {field: "money", sortable: true, title: "合同金额(万元)",align:"right"
                                    ,formatter: function (value) {
                                        return value.toFixed(2);
                                    }
                                },
                                {field: "remark", title: "备注说明"},
                            ]
                        ,null,{
                            onClickRow:function (row) {
                                openRow(row)
                            }
                            })
                    })
            }
            buildTable()
            /*****************table结束****************/
            /*增加*/
            $("#btn_add").on("click", function () {
                var title = "新增合同信息";
                var $html = _.template(templ)();
                openForm(title,$html,function (data) {
                    data.pjId=pjId,
                    data.isNewRecord=true,
                    // data.money=data.money,
                    $.api.projectInfo.contract.edit.exec(data,function (res) {
                        if (res.success){
                            layer.closeAll()
                            buildTable()
                        }
                        layer.msg(res.msg)
                    })
                });
            });
            /*查看*/
            $("#btn_view").on("click", function () {
                var obj = tableHasOneChoose($("#table"))
                if (!obj) return;
                var title = "查看合同信息";
                var $html = _.template(templ)();
                /*openForm(title,$html,function (data) {
                },obj);*/
                tools.handleModal({
                    title:title,
                    template:$html,
                    url:"modules/projectinfo/iframs/contract/form.html",
                    eleId:"#form",
                    param: {
                        row: obj,
                        view:true
                    },
                    btn:["确定","关闭"],
                    yes:function(obj, index, data){
                        layer.closeAll()
                    }
                })
            });
            /*修改*/
            $("#btn_edit").on("click", function () {
                var obj = tableHasOneChoose($("#table"))
                if (!obj) return;
                var title = "修改合同信息";
                var $html = _.template(templ)();
                console.log(obj)
                openForm(title,$html,function (data) {
                    data.pjId=pjId,
                    data.isNewRecord=false,
                    // data.money=data.money*10000,
                    $.api.projectInfo.contract.edit.exec(data,function (res) {
                        if (res.success){
                            layer.closeAll()
                            buildTable()
                        }
                        layer.msg(res.msg)
                    })
                },obj);
            });
            function openRow(row){
                var view = false;
                var obj = row;
                if (!obj) return;
                var title = "合同信息";
                var $html = _.template(templ)();
                console.log(obj)
                openForm(title,$html,function (data) {
                    data.pjId=pjId,
                        data.isNewRecord=false,
                        // data.money=data.money*10000,
                        $.api.projectInfo.contract.edit.exec(data,function (res) {
                            if (res.success){
                                layer.closeAll()
                                buildTable()
                            }
                            layer.msg(res.msg)
                        })
                },obj,view);
            }
            /*删除*/
            $("#btn_delete").on("click", function () {
                deleteConfirm($("#table"),function (objs) {
                    var ids = []
                    for (var obj of objs){
                        ids.push(obj.id)
                    }
                    $.api.projectInfo.contract.delete.exec({ids:ids},function (res) {
                        if (res.success){
                            buildTable()
                        }
                        layer.msg(res.msg)
                    })
                })
            });
            $("#btn_down").on("click", function () {
                var obj = tableHasChoose($table)
                if (!obj) return;

            });

            /*条件搜索*/
            $("#btn_search").on("click", function () {
                buildTable()
            });

            /**
             * 弹窗
             * @param title 标题
             * @param $html 模板
             * @param fun(data) 回调
             */
            function openForm(title,$html,fun,row,view) {
                var view = view||false;
                tools.handleModal({
                    title:title,
                    template:$html,
                   // area:["70%","50%"],
                    url:"modules/projectinfo/iframs/contract/form.html",
                    eleId:"#form",
                    param: {
                        row: row,
                        view: view,
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