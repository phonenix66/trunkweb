/*总览form*/
define("modules/projectinfo/iframs/overview/form",
    ["jquery","page/tools","layer",
        "bootstrap-datepicker", "bootstrap-fileinput-locale-zh", "bootstrapvalidator",
        "css!/css/projectinfo.css"
    ],
    function ($,tools,layer ) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var param = request.param;
                $(".datepicker").datepicker()
                console.log(param.type)
                console.log(param.row)
                var formid = "#send_form";
                //流域下拉框
                tools.getDictValue(dictTypeIdEnum.watershed,"watershed",formid)
                //项目状态下拉框
                tools.getDictValue(dictTypeIdEnum.pjStatus,"pjStatus",formid)
                //项目类型下拉框
                tools.getDictValue(dictTypeIdEnum.pjType,"pjType",formid)
                //统计分类下拉框
                tools.getDictValue(dictTypeIdEnum.statistic,"statistic",formid)
                //建设性质下拉框
                tools.getDictValue(dictTypeIdEnum.nature,"nature",formid)
                //投资类型下拉框
                tools.getDictValue(dictTypeIdEnum.fundsProvided,"fundsProvided",formid)
                var uuid ;
                if (param.type=="add"){
                    //自动填充 项目所在地
                    uuid = tools.getUUID();
                    $("#id").val(uuid);
                    var userprofile = JSON.parse(sessionStorage.getItem("userprofile"))
                    var dpId = userprofile.user.deptId;
                    var url = `${API_URL}/orgnzation/sysDept/find/${dpId}`
                    $.getJSON(url,function (re) {
                        fitLocation(re,1)
                    })
                }
                if (param.type=="edit"){
                    //数据回显
                    var row = param.row;
                    uuid = row.id;
                    row.location = row.city+" -- "+ row.country;
                    var corporateId = row.corporateId ;
                    if (!corporateId){
                        //没有匹配法人的工程项目行要提醒
                        layer.msg("该项目未匹配法人，请注意！")
                    }
                    autoFillForm(row,"#send_form")
                    $("#pjStatus").attr("disabled","disabled")
                    if (param.view){
                        $(".layui-layer-btn0").hide()
                        $("#send_form").find("input,textarea,select").attr("disabled","disabled")
                    }

                }
                /**
                 * 表单校验
                 */
                $(formid).bootstrapValidator({
                    fields: {
                        totalInvestment: {
                            validators: regexp_validators_eum.money
                        },
                        period: {
                            validators: regexp_validators_eum.month
                        },
                        planStartDate: {
                            validators: {
                                callback: {
                                    message:"必须早于结束时间",
                                    callback:function(value){
                                        var planEndDate = $("[name='planEndDate']").val()
                                        if (!planEndDate) return true;
                                        return value < planEndDate
                                    }
                                },
                            }
                        },
                        planEndDate: {
                            validators: {
                                callback: {
                                    message:"必须晚于开始时间",
                                    callback:function(value){
                                        var planStartDate = $("[name='planStartDate']").val()
                                        if (!planStartDate) return true;
                                        return value > planStartDate
                                    }
                                },
                            }
                        },
                    }
                })
                addAllNotemptyValidator(formid)
                $(".to-more").on("click",function () {
                    $("#more").toggle();
                })
                //主管单位
                $("#departmentName").on("click",function () {
                    tools.chooseDeptTree($("#part"),function (obj) {
                        console.log(obj)
                        $("#departmentName").val(obj.sdName).change()
                        $("#departmentId").val(obj.id).change()
                        $("#sdFid").val(obj.sdFid).change()
                    },1,'1')
                })
                //项目所在地
                $("#location").on("click",function () {
                    tools.chooseDeptTree($("#part"),function (obj) {
                        console.log(obj)
                        fitLocation(obj)
                    },2)
                })
                function fitLocation(obj,noMsg) {
                    console.log(obj)
                    var all = obj.sdPathname.toString().split("/")
                    var zzq = all[0];
                    var city = all[1];
                    var country = all[2]||"全部";
                    var str ;
                    if (city){
                        str = city+" -- "+country;
                    } else {
                        if (!noMsg){
                            // layer.msg("所属地至少精确到市！")
                            str = zzq;
                        }else{
                            str = '';
                        }
                        // str = "西藏"
                    }
                    $("#location").val(str)
                    // if (!noMsg){
                        $("#location").change()
                    // }
                    $("#locationId").val(obj.id)

                    $("#projectCity").val(city)
                    $("#projectCountry").val(country)
                }

                //项目法人
                // $("#corporateName").on("click",function () {
                //     tools.choosePersonTable($("#part"),function (obj) {
                //         if (obj) {
                //             console.log(obj)
                //             $("#corporateId").val(obj.id)
                //             $("#corporateName").val(obj.name)
                //             $("#contact").val(obj.mobile)
                //             $("#legalEntity").val(obj.deptName)
                //         }
                //
                //     })
                // })
                // findTree();
                // //初始化树形结构
                // function findTree() {
                //     tools.loadTree({
                //         url: `${tools.API_URL}/orgnzation/sysDept/findList`, //请求链接地址
                //         data:{type:1},
                //         treeId: "js_tree", //id选择器名称
                //         id: "id", //数据的id名称
                //         parentId: "sdFid", //数据的父级id名称
                //         name: "sdName", //数据在树的显示字段
                //         shortName: "sdSort", //数据在树的排序字段
                //         showAll: true, //是否展开所有的树节点
                //         responseHandler: function(response) { //数据接收到之前回调
                //             return response.rows;
                //         },
                //         click: function(obj, e) { //树点击事件
                //             // 获取当前节点
                //             var currentNode = e.node;
                //             dsObj = currentNode.original.menu;
                //             var id = currentNode.id;
                //             var sdName = currentNode.text;
                //             $('#officeId').val(id);
                //             $('#officeName').val(sdName).change();
                //
                //         }
                //     })
                // }
                //选择法人单位
                $("#legalEntity").on("click",function () {
                    tools.chooseDeptTree($("#part"),function (obj) {
                        if(obj.sdName == '其他法人单位'){
                            layer.msg("不能选择其他法人单位！");
                        }else{
                            $("#legalEntity").val(obj.sdName).change()
                            $("#corporateName").val(obj.frName).change()
                            $("#contact").val(obj.frPhone).change()
                            $("#corporateId").val(obj.id)
                        }

                    },1)
                })


                //上传附件
                var settings = {
                    "fileTypeArr":['jpg', 'gif', 'png']
                }
                tools.initFileInput("fProjectPicture", uuid, "PM","F_PJPIC",uuid,settings);
                tools.loadFilesHtml("#filesDiv",uuid,"F_PJPIC",param.view)
                $(formid).bootstrapValidator({
                    fields: {
                        zyysnzj: {
                            totalInvestment: regexp_validators_eum.money
                        }
                    }
                });
                addAllNotemptyValidator(formid)
                // dateValidator($(formid))
                $('.datepicker').on("blur",function () {
                    $(formid).data('bootstrapValidator')
                        .updateStatus("planStartDate", 'NOT_VALIDATED',null)
                        .validateField("planStartDate");
                    $(formid).data('bootstrapValidator')
                        .updateStatus("planEndDate", 'NOT_VALIDATED',null)
                        .validateField("planEndDate");
                })


            }
        }

        return page;
    });
