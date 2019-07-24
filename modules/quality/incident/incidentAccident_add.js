define("modules/quality/incident/incidentAccident_add", [
    "jquery", "layer", "page/tools",
    "bootstrap-datepicker",
    "bootstrap-fileinput-locale-zh",
    "bootstrapvalidator"], function ($, _, tools, layer) {
    var page = function () { };
    page = {
        init: function (request) {
            var param = request.param;
            var loginName = tools.getLoginName();

            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });


            var uuid = "";
            if(param.add) { //新增
                       param = param.add;
                       uuid = param.uuid;
                }else if(param.show){ //查看
                           param = param.show;
                           uuid = param.data.id;
                           $('form').hideFrom();
                           $('.box-body').find('.fileDel').hide();
                    }else if(param.loginName != loginName){ //不是管理员
                                $('form').hideFrom();
                                $('#input-id').removeAttr('disabled');
            }

            var settings = {
                "fileTypeArr":[]
            };
            tools.initFileInput("incidentDoc", uuid, "QA","F_INCIDENT_DOC",null,settings);
            tools.loadFilesHtml("#incidentDocDiv",uuid,"F_INCIDENT_DOC",param.show);
            /**
             * 表单校验
             */
            $('#qualityForm').bootstrapValidator({
                fields: {
                    incdName: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 200,
                                message: '输入字数超限制'
                            }
                        }
                    },
                    occurrenceSite: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 200,
                                message: '输入字数超限制'
                            }
                        }
                    },
                    incdDetail: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max:500,
                                message: '输入字数超限制'
                            }
                        }
                    },
                    incdType: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    reportDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    processDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    isPrcs: {
                        trigger: 'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }

                        }
                    }
                }
            });

        }
    }

    return page;
});
