define("modules/quality/dwgcys/fbgcys_show", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker"], function($, _, tools) {
    var page = function() {};
    page = {
        init: function (request) {
            var param = request.param;
            var loginName = tools.getLoginName();

            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });
            var uuid = "";
            var pjId ="";
            var lv = "";
            if (param.show) {
                param = param.show;
                uuid = param.data.id;
                pjId = param.data.pjId;
                lv = param.data.lv;
                $("input[type='radio'][name='lv'][value='"+lv+"']").attr("checked",true);
                tools.setValueToInput(param.data);
                var fNames = param.data._parent.name;
                $('#fName').val(fNames);
                //单元工程优良率
                    if (param.data.dyNo != 0) {
                        var dyGood = $('#dyGood').val();
                        var dyGoodRate = (dyGood / param.data.dyNo).toFixed(2) * 100;
                        $('#goodRate').val(dyGoodRate + "%");
                    } else {
                        $('#goodRate').val(0 + "%");
                    }
                //重要隐蔽单元工程优良率
                    if (param.data.fbIpt != 0) {
                        var iptGood = $('#iptGood').val();
                        var iptGoodRate = (iptGood / param.data.fbIpt).toFixed(2) * 100;
                        $('#iptGoodRate').val(iptGoodRate + "%");
                    } else {
                        $('#iptGoodRate').val(0 + "%");
                    }
                $('form').hideFrom();
                $('.box-body').find('.fileDel').hide();
            } else if (param.loginName != loginName) { //不是管理员
                $('form').hideFrom();
                $('#input-id').removeAttr('disabled');
            }

            //上传附件
            var settings = {
                "fileTypeArr":[]
            };
            tools.initFileInput("nygcqd", uuid, "QA","F_NYGCLQD",pjId,settings);
            tools.loadFilesHtml("#nygcqdDiv",uuid,"F_NYGCLQD",param.show);

            tools.initFileInput("fbgczlpd", uuid, "QA","F_FBGCZLPD",pjId,settings);
            tools.loadFilesHtml("#fbgczlpdDiv",uuid,"F_FBGCZLPD",param.show);

            tools.initFileInput("dygczlpd", uuid, "QA","F_DYGCZLPD",pjId,settings);
            tools.loadFilesHtml("#dygczlpdDiv",uuid,"F_DYGCZLPD",param.show);

            tools.initFileInput("gcsgzljy", uuid, "QA","F_GCSGZLJY",pjId,settings);
            tools.loadFilesHtml("#gcsgzljyDiv",uuid,"F_GCSGZLJY",param.show);

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
