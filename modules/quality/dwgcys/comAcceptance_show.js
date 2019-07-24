define("modules/quality/dwgcys/comAcceptance_show", [
    "jquery", "layer", "page/tools",
    "bootstrap-datepicker",
    "bootstrap-fileinput-locale-zh",
    "bootstrapvalidator",
    "underscore",
    "jstree"], function($, layer, tools) {
    var page = function() {};
    page = {
        init: function(request) {
            var param = request.param;
            var loginName = tools.getLoginName();

            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });

            var uuid = "";
            var pjId = "";
            var qaGrade = "";
            var receiveStatus = "";
          if(param.show){
                param = param.show;
                uuid = param.data.id;
                pjId = param.data.pjId;
              qaGrade = param.data.qaGrade;
              receiveStatus = param.data.receiveStatus;
              $("input[type='radio'][name='qaGrade'][value='"+qaGrade+"']").attr("checked",true);
              $("input[type='radio'][name='receiveStatus'][value='"+receiveStatus+"']").attr("checked",true);
                tools.setValueToInput(param.data);
                $('form').hideFrom();
                $('.box-body').find('.fileDel').hide();
            }else if(param.loginName != loginName){ //不是管理员
                $('form').hideFrom();
                $('#input-id').removeAttr('disabled');
            }

            //上传附件
            var settings = {
                "fileTypeArr":[]
            };
            tools.initFileInput("gcxmsgzlpd", uuid, "QA","F_GCXMSGZLPD",pjId,settings);
            tools.loadFilesHtml("#gcxmsgzlpdDiv",uuid,"F_GCXMSGZLPD",param.show);

            tools.initFileInput("gcjsglbg", uuid, "QA","F_GCJSGLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsglbgDiv",uuid,"F_GCJSGLBG",param.show);

            tools.initFileInput("gcjsdsj", uuid, "QA","F_GCJSDSJ",pjId,settings);
            tools.loadFilesHtml("#gcjsdsjDiv",uuid,"F_GCJSDSJ",param.show);

            tools.initFileInput("jsyysbg", uuid, "QA","F_JSYYSBG",pjId,settings);
            tools.loadFilesHtml("#jsyysbgDiv",uuid,"F_JSYYSBG",param.show);

            tools.initFileInput("ysjdscg", uuid, "QA","F_YSJDSCG",pjId,settings);
            tools.loadFilesHtml("#ysjdscgDiv",uuid,"F_YSJDSCG",param.show);

            tools.initFileInput("dxfa", uuid, "QA","F_DXFA",pjId,settings);
            tools.loadFilesHtml("#dxfaDiv",uuid,"F_DXFA",param.show);

            tools.initFileInput("gcddyy", uuid, "QA","F_GCDDYY",pjId,settings);
            tools.loadFilesHtml("#gcddyyDiv",uuid,"F_GCDDYY",param.show);

            tools.initFileInput("gcjsjlbg", uuid, "QA","F_GCJSJLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsjlbgDiv",uuid,"F_GCJSJLBG",param.show);

            tools.initFileInput("gcsjbg", uuid, "QA","F_GCSJBG",pjId,settings);
            tools.loadFilesHtml("#gcsjbgDiv",uuid,"F_GCSJBG",param.show);

            tools.initFileInput("gcsgglbg", uuid, "QA","F_GCSGGLBG",pjId,settings);
            tools.loadFilesHtml("#gcsgglbgDiv",uuid,"F_GCSGGLBG",param.show);

            tools.initFileInput("yxglbg", uuid, "QA","F_YXGLBG",pjId,settings);
            tools.loadFilesHtml("#yxglbgDiv",uuid,"F_YXGLBG",param.show);

            tools.initFileInput("gczlhaqjdbg", uuid, "QA","F_GCZLHAQJDBG",pjId,settings);
            tools.loadFilesHtml("#gczlhaqjdbgDiv",uuid,"F_GCZLHAQJDBG",param.show);

            /**
             * 表单校验
             */
            $('form').bootstrapValidator({
                fields: {
                    ihId: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    ihgId: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    qctBrand: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    },
                    qctReportNo: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    },
                    qctOverallConclusions: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    },
                    qctCheckMan: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    },
                    qctCheckDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }

                        }
                    },
                    qctTestMan: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    },
                    qctBeginDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    qctEndDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    qctWitness: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message:'输入字数超限制'
                            }
                        }
                    }

                }
            });

        }
    };

    return page;
});
