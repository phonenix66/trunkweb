define("modules/security/aqrz/jlaqrz/aqrz_jlaq_audit", ["jquery", "underscore", "page/tools", "bootstrap", "Handsontable", "bootstrap-table", "bootstrap-table-x-editable", "bootstrap-select4", "bootstrap-datepicker", 'serializeJSON', 'jstree', 'layer', "bootstrap-fileinput", "bootstrap-fileinput-locale-zh"], function($, _, tools, Handsontable) {
    var page = function() {};
    var roleResourceUrl = `${tools.API_URL}/aqgl/aqrzJlaq`;
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
                    processKey: "aqrz_jlaq",
                    businessId: mainData.id,
                    procInstId: mainData.procInsId,

                });
            }
            if (param.add) { //新增
                var id = tools.getUUID();
                $('#id').val(id);
                // tools.initFileInput("uploadDoc1",id, 1);
            } else { //修改\
                //查询签字数据

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
            //bsvalid();

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

            $('form').bootstrapValidator({
                framework: 'bootstrap',
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {

                    sajDate: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            }
                        }
                    },

                    sajWeather: {
                        validators: {
                            notEmpty: {
                                message: '这是必填字段'
                            }
                        }
                    },
                    sajProtect: {
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
                    sajPeople: {
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
                    sajAqyh: {
                        validators: {
                            stringLength: {
                                min: 0,
                                max: 800,
                                message: '长度不能超过800位'
                            }
                        }
                    },
                    sajHsb: {
                        validators: {
                            stringLength: {
                                min: 0,
                                max: 800,
                                message: '长度不能超过800位'
                            }
                        }
                    },
                    sajBz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajGrwz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajSgyd: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajFhss: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajPjyh: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajGkzl: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajHz: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajZyhj: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajJtaq: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajWmsg: {
                        validators: {

                            stringLength: {
                                min: 0,
                                max: 300,
                                message: '长度不能超过300位'
                            }
                        }
                    },
                    sajBao: {
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
