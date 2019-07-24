/*计划投资资金详情*/
define("modules/projectinfo/iframs/acceptance/form_b",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", /*"bootstrap-fileinput-locale-zh",*/ "bootstrapvalidator",
        "css!/css/projectinfo.css",
        "modules/projectinfo/utils"
    ],
    function ($, _, tools, layer) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var project = getProjectData().project
                //计划开始时间
                // var yearStart = 1994
                var yearStart = project.planStartDate.toString().split("-")[0]
                // //计划竣工时间
                var yearEnd = project.planEndDate.toString().split("-")[0]
                // var yearEnd = 2022
                var opentionHtml = []
                for (let i = yearStart; i <= yearEnd; i++) {
                    opentionHtml.push(`<option value="${i}">${i}年</option>`)
                }
                //年份选择框
                $("#form_b select[name='year']").html(opentionHtml)
                var param = request.param;
                var row = param.row;
                console.log(param,row)
                if (row){
                    // row.money=row.money/10000
                    autoFillForm(row,"#form_b")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $("#form_b").find("input,textarea,select").attr("disabled","disabled")
                    }
                }

                /**
                 * 表单校验
                 */
                $("#form_b").bootstrapValidator({
                    fields: {
                        money: {
                            validators: regexp_validators_eum.money
                        }
                    }
                });
                addAllNotemptyValidator("#form_b")
            }
        }

        return page;
    });