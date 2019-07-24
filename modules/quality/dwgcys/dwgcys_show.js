define("modules/quality/dwgcys/dwgcys_show", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker"], function($, _, tools) {
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
            var lv = "";
           if(param.show){
                param = param.show;
                uuid = param.data.id;
                pjId = param.data.pjId;
                lv = param.data.lv;
               $("input[type='radio'][name='lv'][value='"+lv+"']").attr("checked",true);
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
            tools.initFileInput("gcjsglbg", uuid, "QA","F_GCJSGLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsglbgDiv",uuid,"F_GCJSGLBG",param.show);

            tools.initFileInput("gcjsjlbg", uuid, "QA","F_GCJSJLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsjlbgDiv",uuid,"F_GCJSJLBG",param.show);

            tools.initFileInput("gcsjbg", uuid, "QA","F_GCSJGZBG",pjId,settings);
            tools.loadFilesHtml("#gcsjbgDiv",uuid,"F_GCSJGZBG",param.show);

            tools.initFileInput("gcsgglbg", uuid, "QA","F_GCSGGLBG",pjId,settings);
            tools.loadFilesHtml("#gcsgglbgDiv",uuid,"F_GCSGGLBG",param.show);

            tools.initFileInput("dwgczlpd", uuid, "QA","F_DWGCZLPD",pjId,settings);
            tools.loadFilesHtml("#dwgczlpdDiv",uuid,"F_DWGCZLPD",param.show);

            tools.initFileInput("gcwgzlpd", uuid, "QA","F_GCWGZLPD",pjId,settings);
            tools.loadFilesHtml("#gcwgzlpdDiv",uuid,"F_GCWGZLPD",param.show);

            /**
             * 表单校验
             */
            $('form').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
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
