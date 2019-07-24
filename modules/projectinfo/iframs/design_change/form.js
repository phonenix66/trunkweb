/*重大设计变更*/
define("modules/projectinfo/iframs/design_change/form",
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
                //触发时间输入框的时间检查
                dateValidator($form)
                $("#to-more").on("click",function () {
                    $("#more").toggle()
                })
                var row = param.row;
                var uuid ;
                if (row){
                    uuid = row.id
                    autoFillForm(row,"#form")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $form.find("input,textarea,select").attr("disabled","disabled")
                    }
                }else {
                    uuid = tools.getUUID()
                    $("input[name='id']").val(uuid)
                }
                //上传附件
                /*var settings = {
                    "fileTypeArr": ["zip"]
                }*/

                tools.initFileInput("file_bg", uuid, "PM","F_DC",pjId);
                tools.loadFilesHtml("#file_bgDiv",uuid,"F_DC",param.view)
                tools.initFileInput("file_sc", uuid, "PM","F_CHECK",pjId);
                tools.loadFilesHtml("#file_scDiv",uuid,"F_CHECK",param.view)

                /**
                 * 表单校验
                 */
                $("#form").bootstrapValidator({
                    fields: {
                        content: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 800,
                                    message: '最大800个字符'
                                },
                            }
                        },
                        workstatus: {
                            validators: {
                                stringLength: {
                                    min: 0,
                                    max: 1000,
                                    message: '最大1000个字符'
                                },
                            }
                        },
                    }
                })
                addAllNotemptyValidator("#form")

            }
        }

        return page;
    });