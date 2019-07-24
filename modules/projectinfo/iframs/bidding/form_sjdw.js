/*设计*/
define("modules/projectinfo/iframs/bidding/form_sjdw",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", "bootstrap-fileinput-locale-zh", "bootstrapvalidator",
        "css!/css/projectinfo.css"
    ],
    function ($, _, tools, layer) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var param = request.param;
                $("input[name='projectName']").val(getProjectData().project.pjName)
                $('.datepicker').datepicker();
                tools.getDictValue(dictTypeIdEnum.bidWay,"bidWay","#form")
                var row = param.row;
                console.log(row)
                var uuid ;
                if (row){
                    uuid=row.id,
                    autoFillForm(row,"#form")
                    $("[name='bidMoney']").val(row.bidMoney)
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $("#form").find("input,textarea,select").attr("disabled","disabled")
                    }
                }else{
                    uuid = tools.getUUID()
                }
                $("[name='id']").val(uuid)
                /*var settings = {
                    "fileTypeArr": ["zip"]
                }*/
                tools.initFileInput("file_a", uuid, "PM","F_BID_DOC",pjId);
                tools.loadFilesHtml("#filesDiv",uuid,"F_BID_DOC",param.view)
                /**
                 * 表单校验
                 */
                $('form').bootstrapValidator({
                    fields: {
                        bidMoney: {
                            validators: regexp_validators_eum.money
                        }

                    }
                });
                addAllNotemptyValidator("#form")

            }
        }

        return page;
    });