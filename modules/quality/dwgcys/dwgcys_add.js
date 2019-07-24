define("modules/quality/dwgcys/dwgcys_add", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker"], function($, _, tools) {
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
            }else if(param.loginName != loginName){ //不是管理员
                    $('form').hideFrom();
                    $('#input-id').removeAttr('disabled');
                }


            //上传附件
            var settings = {
                "fileTypeArr":[]
            };
            tools.initFileInput("gcjsglbg", uuid, "QA","F_GCJSGLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsglbgDiv",uuid,"F_GCJSGLBG");

            tools.initFileInput("gcjsjlbg", uuid, "QA","F_GCJSJLBG",pjId,settings);
            tools.loadFilesHtml("#gcjsjlbgDiv",uuid,"F_GCJSJLBG");

            tools.initFileInput("gcsjbg", uuid, "QA","F_GCSJGZBG",pjId,settings);
            tools.loadFilesHtml("#gcsjbgDiv",uuid,"F_GCSJGZBG");

            tools.initFileInput("gcsgglbg", uuid, "QA","F_GCSGGLBG",pjId,settings);
            tools.loadFilesHtml("#gcsgglbgDiv",uuid,"F_GCSGGLBG");

            tools.initFileInput("dwgczlpd", uuid, "QA","F_DWGCZLPD",pjId,settings);
            tools.loadFilesHtml("#dwgczlpdDiv",uuid,"F_DWGCZLPD");

            tools.initFileInput("gcwgzlpd", uuid, "QA","F_GCWGZLPD",pjId,settings);
            tools.loadFilesHtml("#gcwgzlpdDiv",uuid,"F_GCWGZLPD");

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
                    }
                }
            });

        }
    };

    return page;
});
