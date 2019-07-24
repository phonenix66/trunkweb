/*开工报备手续*/
define("modules/projectinfo/star_report_procedure",
    ["jquery","layer","page/tools","bootstrap-table","bootstrap-datepicker","bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css","bootstrapvalidator"
    ], function ($,layer,tools) {
    var page = function () {
    };
    page = {
        init: function (request) {
            tools.setNavData(1)
            var projectData = getProjectData()
            if (projectData.project==null) {
                loadingPage()
            }
            var uuid = projectData.project.id
            var projectRe ={} ;
            $.api.projectInfo.findById.exec({id:uuid},function (re) {
                if (re.success&&re.data){
                    projectRe = re.data;
                    var reportDate = projectRe.reportDate||"";
                    $("[name='reportDate']").val(reportDate.split(" ")[0])
                    var reportStarDate = projectRe.reportStarDate||"";
                    $("[name='reportStarDate']").val(reportStarDate.split(" ")[0])
                }else {
                    layer.msg("获取项目信息失败")
                }
            })
            //上传附件
            var settings = {
                "fileTypeArr":["zip"]
            }
            tools.initFileInput("f_kgbbsxfj", uuid, "PM","F_KGBBSX",pjId);
            tools.loadFilesHtml("#filesDiv",uuid,"F_KGBBSX")
            $('.datepicker').datepicker();
            /**
             * 表单校验
             */
            $("#form").bootstrapValidator({
                fields: {
                    reportDate: {
                        validators: {
                            callback: {
                                message: "备案时间不能晚于开工时间15个工作日",
                                callback: function (value) {
                                    var reportStarDate = $("[name='reportStarDate']").val()
                                    if (!reportStarDate) return true;
                                    return compareDate(value,reportStarDate)
                                }
                            }
                        }
                    },
                    reportStarDate: {
                        validators: {
                            callback: {
                                message: "备案时间不能晚于开工时间15个工作日",
                                callback: function (value) {
                                    var reportDate = $("[name='reportDate']").val()
                                    if (!reportDate) return true;
                                    return compareDate(reportDate,value)
                                }
                            }
                        }
                    }
                }
            })
            addAllNotemptyValidator("#form")
            //保存开工备案时间、开工时间
            $('.datepicker').off("change").on("change", function () {
                $("#form").data('bootstrapValidator')
                    .updateStatus("reportDate", 'NOT_VALIDATED', null);
                $("#form").data('bootstrapValidator')
                    .updateStatus("reportStarDate", 'NOT_VALIDATED', null);
                if (validateForm("#form")) {
                    projectRe.reportDate = $("#reportDate").val();
                    projectRe.reportStarDate = $("#reportStarDate").val();
                    $.api.projectInfo.update.exec(projectRe,function (re) {
                        if (re.success){
                            layer.msg("保存成功！")
                        } else {
                            layer.msg(re.msg)
                        }
                    })

                }
            })

        }
    }
    return page;
});