/*合同信息*/
define("modules/projectinfo/iframs/contract/form",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", "bootstrap-fileinput-locale-zh", "bootstrapvalidator",
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
                tools.getDictValue(dictTypeIdEnum.cType,"cType","#form")
                //触发时间输入框的时间检查
                // dateValidator($form)
                var row = param.row;
                var uuid ;
                if (row){
                    uuid = row.id
                    autoFillForm(row,"#form")
                    // $("[name='money']").val(row.money/10000)

                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $form.find("input,textarea,select").attr("disabled","disabled")
                    }

                }else {
                    uuid = tools.getUUID()
                    $("[name='id']").val(uuid)
                }
                var settings = {
                    "fileTypeArr":['zip']
                }
                tools.initFileInput("file_1", uuid, "PM","F_CONTRACT_DOC",pjId);
                tools.loadFilesHtml("#fHtfjDiv",uuid,"F_CONTRACT_DOC",param.view)
                /**
                 * 表单校验
                 */
                $form.bootstrapValidator({
                    fields: {
                        money: {
                            validators: regexp_validators_eum.money
                        }
                    }
                });
                addAllNotemptyValidator("#form")
            }
        }

        return page;
    });