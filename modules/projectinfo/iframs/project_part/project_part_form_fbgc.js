/*分部工程录入*/
define("modules/projectinfo/iframs/project_part/project_part_form_fbgc",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", "bootstrap-fileinput-locale-zh", "bootstrapvalidator",
        "css!/css/projectinfo.css"
    ],
    function ($, _, tools, layer) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var param = request.param;
                var row= param.data;
                if (row){
                    autoFillForm(row,"#form")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $("#form").find("input,textarea,select").attr("disabled","disabled")
                    }
                }
                var mark= param.mark;
                if (mark=='add') {
                    $(".bu").show()
                    $("#form").on("click",".add-one",function () {
                        var oneHtml = $(this).parents(".one").prop("outerHTML");
                        $(this).parents(".one").after(oneHtml)
                        addAllNotemptyValidator("#form")
                        validateForm("#form")
                    })
                    $("#form").on("click",".delete-one",function () {
                        $(this).parents(".one").remove();
                    })
                }else {
                    $(".inp").removeClass("col-sm-10")
                    $(".inp").addClass("col-sm-12")
                }
                /**
                 * 表单校验
                 */
                $('#form').bootstrapValidator({
                    fields: {
                        name: {
                            validators: {
                                notEmpty: {
                                    message:"不能为空"
                                }
                            }
                        },
                        dyNo: {
                            validators: {
                                notEmpty: {
                                    message:"不能为空"
                                },
                                digits: {
                                    message: '请输入正整数。'
                                },
                                stringLength: {
                                    min: 1,
                                    max: 7,
                                    message: '数据超长：7'
                                }
                            }
                        },
                        fbIpt: {
                            validators: {
                                notEmpty: {
                                    message:"不能为空"
                                },
                                digits: {
                                    message: '请输入正整数。'
                                },
                                stringLength: {
                                    min: 1,
                                    max: 7,
                                    message: '数据超长：7'
                                }
                            }
                        }
                    }
                })

            }
        }

        return page;
    });