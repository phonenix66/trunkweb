define("modules/quality/dwgcys/fbgcys_add", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker"], function($, _, tools) {
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
            if(param.add){
                param = param.add;
                uuid = param.data.id;
                pjId = param.data.pjId;
                lv = param.data.lv;
                $("input[type='radio'][name='lv'][value='"+lv+"']").attr("checked",true);
                tools.setValueToInput(param.data);
                var fName = param.data._parent.name;
                $('#fName').val(fName);
                var dyGood = $('#dyGood').val();
                var iptGood = $('#iptGood').val();
                if (dyGood!=null && iptGood!=null){
                    if (param.data.dyNo != 0 &&  param.data.dyNo!=null) {
                        var dyGoodRate = (dyGood / param.data.dyNo* 100).toFixed(2) ;
                        $('#goodRate').val(dyGoodRate + "%");
                    } else {
                        $('#goodRate').val(0 + "%");
                    }
                    if (param.data.fbIpt != 0 && param.data.fbIpt!=null) {
                        var iptGoodRate = (iptGood / param.data.fbIpt* 100).toFixed(2) ;
                        $('#iptGoodRate').val(iptGoodRate + "%");
                    } else {
                        $('#iptGoodRate').val(0 + "%");
                    }
                }else {
                    $('#goodRate').val(0 + "%");
                    $('#iptGoodRate').val(0 + "%");
                }
            }else if(param.loginName != loginName){ //不是管理员
                $('form').hideFrom();
                $('#input-id').removeAttr('disabled');
            }


                 //单元工程优良率
                 $('#dyGood').blur(function () {
                     var dyGood = $('#dyGood').val();
                     if (param.data.dyNo != 0) {
                         var dyGoodRate = (dyGood / param.data.dyNo).toFixed(2) * 100;
                         $('#goodRate').val(dyGoodRate + "%");
                     } else {
                         $('#goodRate').val(0 + "%");
                     }
                 });

                //重要隐蔽单元工程优良率
                $('#iptGood').on("blur",function () {
                    var iptGood = $('#iptGood').val();
                    if (param.data.fbIpt != 0) {
                        var iptGoodRate = (iptGood / param.data.fbIpt).toFixed(2) * 100;
                        $('#iptGoodRate').val(iptGoodRate + "%");
                    } else {
                        $('#iptGoodRate').val(0 + "%");
                    }
                });


            //上传附件
            var settings = {
                "fileTypeArr":[]
            };
            tools.initFileInput("nygcqd", uuid, "QA","F_NYGCLQD",pjId,settings);
            tools.loadFilesHtml("#nygcqdDiv",uuid,"F_NYGCLQD");

            tools.initFileInput("fbgczlpd", uuid, "QA","F_FBGCZLPD",pjId,settings);
            tools.loadFilesHtml("#fbgczlpdDiv",uuid,"F_FBGCZLPD");

            tools.initFileInput("dygczlpd", uuid, "QA","F_DYGCZLPD",pjId,settings);
            tools.loadFilesHtml("#dygczlpdDiv",uuid,"F_DYGCZLPD");

            tools.initFileInput("gcsgzljy", uuid, "QA","F_GCSGZLJY",pjId,settings);
            tools.loadFilesHtml("#gcsgzljyDiv",uuid,"F_GCSGZLJY");
            /**
             * 表单校验
             */
            $('form').bootstrapValidator({
                fields: {
                    spdDate: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    lv: {
                        trigger:'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    dyPass: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                                regexp: /^[0-9]*$/,
                                message: '请输入正取的数字'
                            }
                        }
                    },
                    dyGood: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                                regexp: /^[0-9]*$/,
                                message: '请输入正取的数字'
                            }
                        }
                    },
                    iptPass: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                                regexp: /^[0-9]*$/,
                                message: '请输入正取的数字'
                            }
                        }
                    },
                    iptGood: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                                regexp: /^[0-9]*$/,
                                message: '请输入正取的数字'
                            }
                        }
                    }
                }
            });

        }
    };

    return page;
});
