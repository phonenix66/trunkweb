define("modules/quality/test/quality_add", [
    "jquery", "layer", "page/tools",
    "bootstrap-datepicker",
    "bootstrap-fileinput-locale-zh",
    "bootstrapvalidator"], function ($, layer, tools) {
    var page = function () { };
    page = {
        init: function (request) {
            var param = request.param;
            var loginName = tools.getLoginName();

            var  items = new Object();
            items.stgczljc = ['土方填筑压实度（相对密度）','土方渗透系数','混凝土强度（取芯）','混凝土抗渗（取芯）','混凝土回弹（强度）','灌浆工程（透水率）','其他'];
            items.ycjzljc = ['水泥','钢筋','粉煤灰','外加剂','砂、石骨料','石料','混凝土拌和物','混凝土试件','砂浆拌和物及试件','混凝土预制件（块）'];


            showitem();
             $('#qaTestType').change(function () {
                 showitem();
             });
            function showitem(){
                var data = [];
                var str = '';
                var qaTextType = $('#qaTestType').val();
                if(qaTextType == '实体工程质量检测'){
                    data = items.stgczljc;
                }else if(qaTextType == '原材料质量检测'){
                    data = items.ycjzljc;
                }
                for (var i = 0;i<data.length;i++){
                    str+='<option value="'+data[i]+'">'+data[i]+'</option>';
                }
                $('#item').html(str);
            }

            showComp();
            function showComp(){
                var str='';
                var sdFid = '34cdab9ecb6542b2839404d6225a2c20';
                var data = {
                    sdFid:sdFid
                }
                $.ajax({
                    type: "post",
                    url:`${tools.API_URL}/orgnzation/sysDept/findList`,
                    data: data,
                    async: false
                }).then(function(res) {
                   $('#comp').empty();
                   var data = res.rows;
                    for (var i = 0;i<data.length;i++){
                        str+='<option value="'+data[i].id+'">'+data[i].sdName+'</option>';
                    }
                    $('#comp').append(str);
                }, function() {
                    console.log("请求错误");
                });
            }



            $('.datepicker').datepicker({
                autoclose: true,
                dateFormat: 'yy-mm-dd'
            });

            var uuid = "";
            if(param.add) { //新增
                param = param.add;
                uuid = param.uuid;

                 }  else if(param.show){ //查看

                param = param.show;
                uuid = param.data.id;
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
            tools.initFileInput("testDoc", uuid, "QA","F_TEST_DOC",null,settings);
            tools.loadFilesHtml("#testDocDiv",uuid,"F_TEST_DOC",param.show);
            /**
             * 表单校验
             */
            $('#qualityForm').bootstrapValidator({
                fields: {
                    item: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    testDate: {
                        trigger: 'change',
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }

                        }
                    },
                    comp: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 32,
                                message: '输入字数超限制'
                            }
                        }
                    },
                    tester: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 20,
                                message: '输入字数超限制'
                            }
                        }
                    },
                    conclusion: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            }
                        }
                    },
                    suggestion: {
                        validators: {
                            notEmpty: {
                                message: '不能为空'
                            },
                            stringLength: {
                                max: 500,
                                message: '输入字数超限制'
                            }
                        }
                    }

                }
            });

        }
    }

    return page;
});
