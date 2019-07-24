define("modules/security/aqrz/yzaqrz/aqrz_yzaq_add", ["jquery", "underscore", "page/tools", "bootstrap", "Handsontable", "bootstrap-table", "bootstrap-table-x-editable", "bootstrap-select4", "bootstrap-datepicker", 'serializeJSON', 'jstree', 'layer', "bootstrap-fileinput", "bootstrap-fileinput-locale-zh"], function($, _, tools, Handsontable) {
    var page = function() {};
    var roleResourceUrl = `${tools.API_URL}/aqgl/aqrz`;
    page = {
        init: function(request) {

            $('input[name="saDate"]').datepicker({
                format: 'yyyy-mm-dd',
                language: 'zh-CN'
            });
            var param = request.param;
            if (param.add) { //新增
                var id = tools.getUUID();
                $('#id').val(id);
                // tools.initFileInput("uploadDoc1",id, 1);
            } else { //修改
                // var data = findSpecialFacility(param.edit.id);
                tools.setValueToInput(param.edit);
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
            $('#saDate').on('change', function() {
                var saDate = $('#saDate').val();
                showTime(saDate);
            });
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
                                // notEmpty: {
                                //     message: '这是必填字段'
                                // }
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
                        saBc: {
                            validators: {
                                notEmpty: {
                                    message: '这是必填字段'
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
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saSgyd: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saFhss: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saPjyh: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saGkzl: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saJxsh: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saHz: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saZyhj: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saJtaq: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saWmsg: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        },
                        saBao: {
                            validators: {

                                stringLength: {
                                    min: 0,
                                    max: 2,
                                    message: '长度不能超过2位'
                                },
                                numeric: {
                                    message: '请输入数字'
                                }
                            }
                        }
                    }
                })
                // var week1 = String(saDate.getDay()).replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六")

            function showTime(date) {
                var show_day = new Array('一', '二', '三', '四', '五', '六', '日');
                var time = new Date(date);
                // var time = new Date();
                var year = time.getYear();
                var month = time.getMonth();
                var date = time.getDate();
                var day = time.getDay();
                var hour = time.getHours();
                var minutes = time.getMinutes();
                var second = time.getSeconds();
                month < 10 ? month = '0' + month : month;
                month = month + 1;
                hour < 10 ? hour = '0' + hour : hour;
                minutes < 10 ? minutes = '0' + minutes : minutes;
                second < 10 ? second = '0' + second : second;
                // var now_time = '当前时间：' + year + '年' + month + '月' + date + '日' + ' ' + show_day[day - 1] + ' ' + hour + ':' + minutes + ':' + second;
                // document.getElementById('showtime').innerHTML = now_time;
                // setTimeout("showTime();", 1000);
                $('#saWeek').val(show_day[day - 1]);
            }
        }
    }
    return page;
});
