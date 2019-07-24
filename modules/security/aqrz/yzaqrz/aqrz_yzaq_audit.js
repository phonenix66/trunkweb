define("modules/security/aqrz/yzaqrz/aqrz_yzaq_audit", ["jquery", "underscore", "page/tools", "bootstrap", "Handsontable", "bootstrap-table", "bootstrap-table-x-editable", "bootstrap-select4", "bootstrap-datepicker", 'serializeJSON', 'jstree', 'layer', "bootstrap-fileinput", "bootstrap-fileinput-locale-zh"], function($, _, tools, Handsontable) {
    var page = function() {};
    var roleResourceUrl = `${tools.API_URL}/aqgl/aqrz`;
    page = {
        init: function(request) {
            $('input[name="aaDate"]').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN'
            });
            var param = request.param;
            if (request.param) {
                //			var data = self.findHtgl(request.param.id);
                mainData = param.edit;

                tools.processTemplate({
                    processKey: "aqrz_yzaq",
                    businessId: mainData.id,
                    procInstId: mainData.procInsId
                });
            }
            if (param.add) { //新增
                var id = tools.getUUID();
                $('#id').val(id);
                // tools.initFileInput("uploadDoc1",id, 1);
            } else { //修改
                tools.setValueToInput(param.edit);
                showSpr(param.edit);
                if (param.edit.show) {
                    $('input').attr('disabled', 'disabled');
                    $('textarea').attr('disabled', 'disabled');
                    $('select').attr('disabled', 'disabled');
                    //              	console.log(param.edit.id);
                    //			        var data = {processKey:"qygllist",businessId:param.edit.id};
                    //					tools.processTemplate(data);
                }
            }
            var self = this;

            function showSpr(d) {

                var data = {
                    id: d.id
                }


                $.ajax({
                    url: `${roleResourceUrl}/findSpr`,
                    data: data,
                    async: false,
                    type: 'get',
                    contentType: "application/json;charset=UTF-8",
                    success: function(data) {
                        debugger;
                        //刷新数据  $("#test1").parent();
                        if (data != null) {
                            $('#spr').val(data);
                        }
                    }
                });


            }
            //bsvalid();
            $('form').bootstrapValidator({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {

                    saDate: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            }
                        }
                    },

                    saWeather: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            }
                        }
                    },
                    saProtect: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            },
                            stringLength: {
                                min: 0,
                                max: 20,
                                message: '长度不能超过20位'
                            }
                        }
                    },
                    saPeople: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            },
                            stringLength: {
                                min: 0,
                                max: 20,
                                message: '长度不能超过20位'
                            }
                        }
                    },
                    saAqyh: {
                        validators: {
                            stringLength: {
                                min: 0,
                                max: 800,
                                message: '长度不能超过800位'
                            }
                        }
                    },
                    saHsb: {
                        validators: {
                            stringLength: {
                                min: 0,
                                max: 800,
                                message: '长度不能超过800位'
                            }
                        }
                    },
                    saBz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saGrwz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saSgyd: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saFhss: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saPjyh: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saGkzl: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saHz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saZyhj: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saJtaq: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saWmsg: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    saBao: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    }
                }
            })
        }
    }
    return page;
});
