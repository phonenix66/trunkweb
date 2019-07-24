/*项目前期资料*/
define("modules/projectinfo/early_material",
    ["jquery", "layer", "page/tools", "modules/projectinfo/utils", "bootstrap-datepicker", "bootstrap-table", "bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css", "bootstrapvalidator"
    ],
    function ($, layer, tools) {
        var page = function () {};
        page = {
            init: function (request) {
                tools.setNavData(1)
                var projectData = getProjectData()
                if (projectData.project == null) {
                    loadingPage()
                }
                $('.datepicker').datepicker({
                    zIndexOffset: 1200
                });
                var isNewRecord = false;
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                var pjName = projectData.project.pjName;
                //数据回显
                $(".pjName").val(pjName)
                var docType = "1";
                $("#tab li").on("click", function () {
                    docType = $(this).data("doctype");
                    fillForm()
                })

                //回显数据
                function fillForm() {
                    $.api.projectInfo.earlierStage.find.exec({
                        docType: docType,
                        pjId: pjId,
                    }, function (re) {
                        if (re.success) {
                            var uuid;
                            if (re.data) {
                                uuid = re.data.id
                                autoFillForm(re.data, "#form_" + docType)
                            } else {
                                uuid = tools.getUUID();
                                $("#form_" + docType + " [name='id']").val(uuid)
                                isNewRecord = true;
                            }
                            //上传附件
                            var settings = {
                                "fileTypeArr": []
                            }
                            tools.initFileInput("backfile_" + docType, uuid, "PM", "F_ORG_DOC", pjId, settings);
                            tools.initFileInput("partfile_" + docType, uuid, "PM", "F_APPROVAL_DOC", pjId, settings);
                            tools.loadFilesHtml("#backfile_" + docType + "Div", uuid, "F_ORG_DOC")
                            tools.loadFilesHtml("#partfile_" + docType + "Div", uuid, "F_APPROVAL_DOC")

                            /**
                             * 表单校验
                             */
                            $("#form_" + docType).bootstrapValidator({
                                fields: {
                                    madeDate: {
                                        validators: {
                                            callback: {
                                                message: "必须早于批复时间",
                                                callback: function (value) {
                                                    var planEndDate = $("#form_" + docType + " [name='approvalDate']").val()
                                                    if (!planEndDate) return true;
                                                    return value < planEndDate
                                                }
                                            },
                                        }
                                    },
                                    approvalDate: {
                                        validators: {
                                            callback: {
                                                message: "必须晚于完成时间",
                                                callback: function (value) {
                                                    var planStartDate = $("#form_" + docType + " [name='madeDate']").val()
                                                    if (!planStartDate) return true;
                                                    return value > planStartDate
                                                }
                                            },
                                        }
                                    },
                                }
                            })
                            addAllNotemptyValidator("#form_" + docType)
                        } else {
                            layer.msg(re.msg)
                        }
                    })

                }
                $('.datepicker').on("blur", function () {
                    $("#form_" + docType).data('bootstrapValidator')
                        .updateStatus("madeDate", 'NOT_VALIDATED', null)
                        .validateField("madeDate");
                    $("#form_" + docType).data('bootstrapValidator')
                        .updateStatus("approvalDate", 'NOT_VALIDATED', null)
                        .validateField("approvalDate");
                })
                fillForm()
                //保存按钮
                $(".save").on("click", function () {
                    if (validateForm("#form_" + docType)) {
                        var data = dataFormObj("#form_" + docType)
                        data.pjId = pjId;
                        data.isNewRecord = isNewRecord;
                        $.api.projectInfo.earlierStage.update.exec(data, function (re) {
                            if (re.success) isNewRecord = false;
                            layer.msg(re.msg)
                        })
                    }
                })


                /*tools.initFileInput("backfile_b", uuid, "F_ORG_DOC",settings);
                tools.initFileInput("partfile_b", uuid, "F_APPROVAL_DOC",settings);
                tools.loadFilesHtml("#backfile_bDiv",uuid,"F_ORG_DOC")
                tools.loadFilesHtml("#partfile_bDiv",uuid,"F_APPROVAL_DOC")

                tools.initFileInput("backfile_d", uuid, "F_ORG_DOC",settings);
                tools.initFileInput("partfile_d", uuid, "F_APPROVAL_DOC",settings);
                tools.loadFilesHtml("#backfile_dDiv",uuid,"F_ORG_DOC")
                tools.loadFilesHtml("#partfile_dDiv",uuid,"F_APPROVAL_DOC")*/

            }
        }
        return page;
    });