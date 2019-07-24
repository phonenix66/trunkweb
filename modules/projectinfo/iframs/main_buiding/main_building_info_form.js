define("modules/projectinfo/iframs/main_buiding/main_building_info_form",
    ["jquery", "layer", "page/tools", "bootstrap-datepicker", "bootstrap-fileinput-locale-zh", "bootstrapvalidator",
        "css!/css/projectinfo.css","modules/projectinfo/utils"
    ],
    function ($, layer, tools ) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var param = request.param;
                var projectData = getProjectData()
                var project = projectData.project;
                console.log(param)
                $("#identity option").hide()
                $("#unitCategory").on("change", function () {
                    var unit ="unit_"+$(this).val();
                    $("#identity").val("").change()
                    $("#identity option").each(function () {
                        var flag = $(this).hasClass(unit);
                        if (flag) $(this).show()
                        else $(this).hide()
                    })
                })
                $("#unitCategory").val(param.data.unit).change()
                var unit = param.data.unit
                var $append = $("#append")
                function biddingInfo(bidType) {
                    var html = [`<div class="col-sm-4" style="text-align: center;"><span style="font-weight: bolder;">标段名称</span></div> 
                                <div class="col-sm-4"  style="text-align: center;"><span style="font-weight: bolder;">中标单位</span></div>
                                <div class="col-sm-4"  style="text-align: center;"><span style="font-weight: bolder;">中标金额（万元）</span></div>`]
                    var param ={};
                    param.pjId = project.id,
                        param.bidType = bidType,
                        $.api.projectInfo.bid.dataList.exec(param, function (res) {
                            if (!res.success) layer.msg(res.msg)
                            var data = res.data;
                            if (data){
                                for (const row of data) {
                                    html.push(`<div class="col-sm-4" style="text-align: center">${row.phaseName}</div> 
                                                <div class="col-sm-4" style="text-align: center" >${row.bidder}</div>
                                                <div class="col-sm-4" style="text-align: center" >${row.bidMoney}</div>`)
                                }
                                $append.html(html.join(""))
                            } else {
                                $append.html(`<div style=" font-size: medium; padding: 10px 16px;color: darkgray;"><span>没有找到招投标单位信息...</span></div>`)
                            }
                        })
                }
                switch (unit*1) {
                    case 1:
                        //施工单位：从招投标信息中带入标段信息和中标单位信息；
                        biddingInfo(3)
                        break;
                    case 2:
                        // 建设单位：从项目列表中带入法人单位；
                        var corporateDeptName = project.corporateDeptName||"该项目未录入法人"
                        var html = `<div style=" font-size: medium; padding: 10px 16px;"><span style="font-weight: bolder; padding-right: 5px;">建设单位:</span>${corporateDeptName}</div>`
                        $append.html(html)
                        break;
                    case 3:
                        // 监理单位：从招投标信息中带入标段信息和中标单位信息；
                        biddingInfo(2)
                        break;
                    case 4:
                        // 设计单位：从招投标信息中带入标段信息和中标单位信息；
                        biddingInfo(1)
                        break;
                    case 5:
                        // 监督单位：从项目列表中带入主管单位
                        var departmentName = project.departmentName||"该项目未录入主管单位"
                        var html = `<div style=" font-size: medium; padding: 10px 16px;"><span style="font-weight: bolder; padding-right: 5px;">监管单位:</span>${departmentName}</div>`
                        $append.html(html)
                        break;
                    default:
                        break;
                }
                $(".to-more").on("click",function () {
                    $("#more").toggle()
                })
                if (param.data.type=="add"){
                    var uuid = tools.getUUID()
                    $("input[name='id']").val(uuid)
                }
                if (param.data.type=="edit"||param.data.type=="view"){
                    //数据回显
                    var row = param.data.row
                    autoFillForm(row,"#form")
                    if (param.data.type=="view"){
                        $(".layui-layer-btn0").hide()
                        $("#form").find("input,textarea,select").attr("disabled","disabled")
                    }
                }
                /**
                 * 表单校验
                 */
                $("#form").bootstrapValidator({
                    fields: {
                        idCard: {
                            validators: {
                                regexp: {
                                    regexp: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                                        message: "请输入正确的身份证号码"
                                },
                                remote: {//ajax验证。server result:{"valid",true or false}
                                    url: `${API_URL}/project_info/mainBuilding/duplicationIdCard`,
                                    message: '人员身份证不能重复,请重新输入',
                                    delay: 300,//ajax刷新的时间是0.1秒一次
                                    type: 'POST',
                                    data: function(validator) {
                                        return {
                                            idCard : $("#form input[name='idCard']").val(),
                                            unitType : param.data.unit,
                                        }
                                    }
                                }
                             },
                        },
                    }
                })
                addAllNotemptyValidator("#form")
            }
        }

        return page;
    });