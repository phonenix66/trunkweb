/*资金计划*/
define("modules/projectinfo/fund_plan",
    ["jquery", "layer", "page/tools","underscore",
        "text!modules/projectinfo/iframs/acceptance/form.html",
        "text!modules/projectinfo/iframs/acceptance/form_b.html",
        "bootstrap-table", "bootstrap-fileinput-locale-zh","bootstrap-datepicker",
        "css!/css/projectinfo.css"
    ],
    function ($, layer, tools,_,templ,templ_b) {
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
                function buildSampleTable($el, data,columns) {
                    $el.bootstrapTable({
                        height:$("body").height()-250,
                        sortable: true,
                        sortOrder: "desc",
                        columns: columns,
                        data: data,
                        clickToSelect: false,
                        pageSize: 50,
                        pageNumber: 1,
                        pageList: "[5,10, 25, 50, 100,ALL]",
                        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: true, //是否显示分页（*）
                        sidePagination: "client",//前端分页
                        onDblClickCell :function(field, value, row, $element){
                            $(".cell-edit").attr("disabled","disabled")
                            $element.find(".cell-edit").removeAttr("disabled");
                            $element.find(".cell-edit").focus();
                        }
                    })
                    $(".cell-edit").off("blur").on("blur",function () {
                        var $this = $(this);
                        $this.attr("disabled","disabled")
                    })
                    $(".cell-edit").off("change").on("change",function () {
                        var $this = $(this);
                        var mark = $this.data("mark")||"a";
                        var id = $this.data("id");
                        var feild = $this.attr("name");
                        var val = $this.val().trim();
                        if (feild=='mName'&&val.length>50) {
                            layer.msg("文字过长")
                            return false;
                        }
                        if (feild=='percent') {
                            if (!/^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/.test(val)) {
                                layer.msg("请输入最大两位小数数值")
                                return false;
                            }
                            if (val*1>100) {
                                layer.msg("数值过大")
                                return false;
                            }
                        }
                        if (feild=='remark'&&val.length>1000) {
                            layer.msg("文字过长")
                            return false;
                        }
                        if (feild=='remart'&&val.length>1000) {
                            layer.msg("文字过长")
                            return false;
                        }
                        if (feild=='money') {
                            if (!/^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/.test(val)) {
                                layer.msg("请输入最大两位小数数值")
                                return false;
                            }
                            if (val*1>9999999999) {
                                layer.msg("数值过大")
                                return false;
                            }
                        }

                        var dataStr = `{"id":"${id}","isNewRecord":"false","${feild}":"${val}" }`
                        console.log(JSON.parse(dataStr))
                        if (mark=="b"){
                            $.api.projectInfo.investPlan.edit.exec(JSON.parse(dataStr),function (res) {
                                if (res.success){
                                    layer.msg("保存成功！")
                                }else {
                                    layer.msg("操作错误！")
                                }
                                buildTable_b()
                            })
                        } else{
                            $.api.projectInfo.milestone.edit.exec(JSON.parse(dataStr),function (res) {
                                if (res.success){
                                    layer.msg("保存成功！")
                                }else {
                                    buildTable()
                                    layer.msg("操作错误！")
                                }
                            })
                        }

                    })
                    $(".datepicker").datepicker()
                }
                var totalInvestment = projectData.project.totalInvestment||0
                $("#totalInvestment").text(totalInvestment.toFixed(2))
                /***************************投资详情*************************/
               function buildTable_b(){
                   var param = dataFormObj("#b_form")
                   param.pjId=pjId,
                   $.api.projectInfo.investPlan.dataList.exec(param,function (res) {
                       var allUsed = 0
                       for (var pjPl of res.data) {
                           var m = pjPl.money||0
                           allUsed +=  m
                       }
                       var surplus = totalInvestment - allUsed;
                       if (surplus<0) {
                           layer.msg("资金分配已超出合同金额！")
                       }
                       $("#surplus").text(surplus.toFixed(2))
                       buildSampleTable($("#tableb")
                               .html('<table id="table_b"></table>').find('table'),res.data,
                           [
                               {field: "year", title: "年份",width:200,sortable:true
                                   ,formatter: function (value, row, index) {
                                       return value + "年";
                                   }
                               },
                               {field: "quarter", title: "季度",width:200
                                   ,formatter: function (value, row, index) {
                                       return `第 ${value} 季度`;
                                   }
                               },
                               {field: "fundsProvided", title: "资金来源类型",width:200,sortable:true,
                                   formatter:function (value, row, index) {
                                       return fitDictName(dictTypeIdEnum.fundsProvided,value)
                                   }
                               },
                               {field: "money", title: "计划资金(万元)",align:"right",width:100,sortable:true
                                   ,formatter: function (value, row, index) {
                                   value = value||0;
                                      return tools.fitTableEditCell("input","money",row.id,value.toFixed(2),null,"b","right");
                                   }
                               },
                               {field: "remart", title: "备注"
                                   ,formatter: function (value, row, index) {
                                       return tools.fitTableEditCell("input","remart",row.id,value,null,"b");
                                   }
                               }
                           ]
                       )
                   })
               }
                buildTable_b()
                var $html_b = _.template(templ_b)()
                $("#search_b").on("click",function () {
                    buildTable_b()
                })
                $("#btn_add_b").on("click",function () {
                    var data = {};
                        data.pjId=pjId,
                        data.isNewRecord=true,
                        data.id=tools.getUUID(),
                        $.api.projectInfo.investPlan.edit.exec(data,function (res) {
                            if (res.success){
                                buildTable_b()
                            }
                            layer.msg(res.msg)
                        })
                    /*openForm("新增投资详情信息",$html_b,function (data) {
                        data.pjId=pjId,
                            data.isNewRecord=true,
                            data.id=tools.getUUID(),
                            // data.money=data.money*10000,
                        $.api.projectInfo.investPlan.edit.exec(data,function (res) {
                            if (res.success){
                                buildTable_b()
                                layer.closeAll()
                            }
                            layer.msg(res.msg)
                        })

                    },null,"modules/projectinfo/iframs/acceptance/form_b.html","#form_b")*/
                })
                $("#btn_view_b").on("click",function () {
                    var obj = tableHasOneChoose($("#table_b"))
                    if (!obj) return;
                    openForm("查看投资详情信息",$html_b,function (data) {
                        layer.closeAll()
                    },obj,"modules/projectinfo/iframs/acceptance/form_b.html","#form_b",true)

                })
                $("#btn_edit_b").on("click",function () {
                    var obj = tableHasOneChoose($("#table_b"))
                    if (!obj) return;
                    openForm("修改投资详情信息",$html_b,function (data) {
                            data.pjId=pjId,
                            data.isNewRecord=false,
                            // data.money=data.money*10000,
                            $.api.projectInfo.investPlan.edit.exec(data,function (res) {
                                if (res.success){
                                    layer.closeAll()
                                    buildTable_b()
                                }
                                layer.msg(res.msg)
                            })
                    },obj,"modules/projectinfo/iframs/acceptance/form_b.html","#form_b")

                })
                $("#btn_delete_b").on("click",function () {
                    deleteConfirm($("#table_b"),function (objs) {
                        var ids_b = []
                        for (var obj of objs){
                            ids_b.push(obj.id)
                        }
                        $.api.projectInfo.investPlan.delete.exec({
                            ids:ids_b
                        },function (res) {
                            buildTable_b()
                            layer.msg(res.msg)
                        })
                    })
                })

                /**
                 * 弹窗
                 * @param title 标题
                 * @param $html 模板
                 * @param fun(data) 回调
                 */
                function openForm(title,$html,fun,row,url,eleId,view) {
                    url = url||"modules/projectinfo/iframs/acceptance/form.html"
                    eleId = eleId||"#form"
                    tools.handleModal({
                        title:title,
                        template:$html,
                        area:["70%","50%"],
                        url:url,
                        eleId:eleId,
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
