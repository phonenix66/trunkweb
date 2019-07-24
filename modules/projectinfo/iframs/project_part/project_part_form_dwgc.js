/*单位工程录入*/
define("modules/projectinfo/iframs/project_part/project_part_form_dwgc",
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
                var mark= param.mark;
                if (row){
                    autoFillForm(row,"#form")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $("#form").find("input,textarea,select").attr("disabled","disabled")
                    }
                }
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
                                stringLength: {
                                    min: 0,
                                    max: 100,
                                    message: '数据过长'
                                }
                            }
                        }
                    }
                })
                addAllNotemptyValidator("#form")

                $("#pjName").val(getProjectData().project.pjName)
            }
        }

        return page;
    });