/*法人验收节点*/
define("modules/projectinfo/iframs/acceptance/form",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", /*"bootstrap-fileinput-locale-zh",*/ "bootstrapvalidator",
        "css!/css/projectinfo.css"
    ],
    function ($, _, tools, layer) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var param = request.param;
                var $form= $('#form')
                $('.datepicker').datepicker()
                //触发时间输入框的时间检查
                dateValidator($form)
                var row = param.row;
                if (row){
                    autoFillForm(row,"#form")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $form.find("input,textarea,select").attr("disabled","disabled")
                    }
                }
                /**
                 * 表单校验
                 */
                $form.bootstrapValidator({
                    fields: {
                        percent: {
                            validators: regexp_validators_eum.percent
                        }

                    }
                });
                addAllNotemptyValidator("#form")
            }
        }

        return page;
    });