define("modules/schedule/schedule_add", ["jquery", "underscore", "page/tools",
    "bootstrap", "Handsontable", "bootstrap-table", "bootstrap-table-x-editable", "bootstrap-select4", "bootstrap-datepicker", 'serializeJSON', 'jstree', 'layer', "bootstrap-fileinput", "bootstrap-fileinput-locale-zh", "echarts"
], function($, _, tools, echarts, Handsontable) {
    var page = function() {};
    page = {
        init: function(request) {

            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);
            var project = cityEntity.project;
            tools.getDictValue(202, "pjState");

            var resourceUrl = `${tools.API_URL}/schedule/scheduleManagement`; //页面url地址
            var param = request.param;
            if (param.add) {
                $('#pjId').val(param.projectId);
                var id = tools.getUUID();
                $('#id').val(id);
                //查询项目信息，将状态赋值
                // project_info/find

                $.ajax({
                    type: "post",
                    url: API_URL + "/project_info/find",
                    data: { id: project.id },
                    async: false,

                    success: function(data) {
                        //刷新数据
                        $('#pjState').val(data.data.pjStatus);
                    }
                });

                tools.initFileInput("gclhsqd", id, "SCD", "F_FUND", param.projectId, settings);
                tools.initFileInput("jssqd", id, "SCD", "F_ACCOUNT_APPLY", param.projectId, settings);
                tools.initFileInput("zjbfdj", id, "SCD", "F_PJLIST", param.projectId, settings);
            } else if (param.edit) {
                var data = null;
                //查询数据包括文档数据
                $.ajax({
                    url: `${resourceUrl}/find/` + param.edit.id,
                    data: data,
                    type: 'get',
                    async: false,
                    success: function(res) {
                        data = res;
                    },
                    error: function(err) {

                    }
                })
                $('#pjId').val(data.pjId);
                tools.setValueToInput(data);
                tools.initFileInput("gclhsqd", data.id, "SCD", "F_FUND", data.pjId, settings);
                tools.initFileInput("jssqd", data.id, "SCD", "F_ACCOUNT_APPLY", data.pjId, settings);
                tools.initFileInput("zjbfdj", data.id, "SCD", "F_PJLIST", data.pjId, settings);
            } else if (param.show) {
                var data = null;
                //查询数据包括文档数据
                $.ajax({
                    url: `${resourceUrl}/find/` + param.show.id,
                    data: data,
                    type: 'get',
                    async: false,
                    success: function(res) {
                        data = res;
                    },
                    error: function(err) {

                    }
                })
                $('#pjId').val(data.pjId);
                tools.setValueToInput(data);
                tools.initFileInput("gclhsqd", data.id, "SCD", "F_FUND", data.pjId, settings);
                tools.initFileInput("jssqd", data.id, "SCD", "F_ACCOUNT_APPLY", data.pjId, settings);
                tools.initFileInput("zjbfdj", data.id, "SCD", "F_PJLIST", data.pjId, settings);

                $("#sAppropriate").attr("readOnly", true);
                $("#sSettlement").attr("readOnly", true);
                $("#pjState").attr("readOnly", true);
                $("#reportingDate").attr("readOnly", true);
                // $("#gclhsqd").attr("readOnly", true);
                // $("#jssqd").attr("readOnly", true);
                // $("#zjbfdj").attr("readOnly", true);
            }



            var loginName = tools.getLoginName();
            $('input[name="reportingDate"]').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN'
            });
            var settings = {
                "fileTypeArr": ["zip"]
            }

            // 上传附件
            var settings = {
                "fileTypeArr": []
            }

            // tools.initFileInput("gclhsqd", "业务数据id", 1, settings);
            // tools.initFileInput("jssqd", "业务数据id", 1, settings);
            // tools.initFileInput("zjbfdj", "业务数据id", 1, settings);
            $('form').bootstrapValidator({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    sAppropriate: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            },
                            regexp: {
                                regexp: param.reg || /^([0-9]\d{0,13}([.]{1}[0-9]{1,2})?)$/,
                                message: '请按规范输入'
                            }

                        }
                    },
                    sSettlement: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            },
                            // stringLength: {
                            //     min: 0,
                            //     max: 5,
                            //     message: '长度不能超过5位'
                            //     // regexp: param.reg || /^([0-9]\d{0,13}([.]{1}[0-9]{1,2})?)$/,

                            // },
                            regexp: {
                                regexp: param.reg || /^([0-9]\d{0,13}([.]{1}[0-9]{1,2})?)$/,
                                message: '请按规范输入'
                            }

                        }
                    },
                    pjState: {
                        validators: {
                            stringLength: {
                                min: 0,
                                max: 20,
                                message: '长度不能超过20位'
                            }
                        }
                    },
                    reportingDate: {
                        trigger: "change",
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            }
                        }
                    }
                }
            })
        }
    }

    return page;
});