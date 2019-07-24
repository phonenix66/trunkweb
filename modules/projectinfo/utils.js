try {
    var pjId = getProjectData().project.id
} catch (e) {
    console.log(e)
}
var regexp_validators_eum = {
    /*身份证*/
    idCard: {
        regexp: {
            regexp: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            message: "请输入正确的身份证号码"
        }
    },
    /*金额*/
    money: {
        regexp: {
            regexp: /^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/,
            message: "请输入正确金额，最多两位小数"
        },
        callback: {
            message: "数值过大",
            callback: function (value) {
                if(value*1){
                    return value*1 <= 9999999999
                }
                return true;
            }
        },
    },
    /*百分比*/
    percent: {
        regexp: {
            regexp: /^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/,
            message: "最多两位小数"
        },
        callback: {
            message: "不能大于100",
            callback: function (value) {
                return value <= 100
            }
        },
    },
    /*月个数*/
    month: {
        regexp: {
            regexp: /^[0-9]+([.]{1}[0-9]{0,1}){0}$/,
            message: "请输入正整数"
        },
        callback: {
            message: "数值过大",
            callback: function (value) {
                return value*1 <= 99999
            }
        },
    }
}

/**
 * 添加所有非空校验  ,附带字符串长度校验，默认限定50
 * dom元素添加 notEmpty 属性
 * @param formId
 */
function addAllNotemptyValidator(formId) {
    $(formId + " [notEmpty]").each(function () {
        var fieldName = this.name
        var message = this.getAttribute("notEmpty") + "不能为空";
        $(formId).bootstrapValidator("addField", fieldName, {
            validators: {
                notEmpty: {
                    message: message
                },
            }
        });
    })
    try {
        addAllStringLengthValidator(formId)
    } catch (e) {
        console.error(e)
    }
}
/**
 * 添加字段长度校验 默认50
 * dom元素添加 stringLength 设置长度
 * @param formId
 */
function addAllStringLengthValidator(formId) {
    $(formId + " input,textarea").each(function () {
        if (this.type != "file" && this.type != "hidden") {
            var fieldName = this.name
            // console.log(formId,"fieldName ",fieldName,this)
            var max = this.getAttribute("stringLength") || 50;
            $(formId).bootstrapValidator("addField", fieldName, {
                validators: {
                    stringLength: {
                        min: 0,
                        max: max,
                        message: '数据超长: ' + max
                    },
                }
            });
        }
    })
}

/**
 * 添加自定义校验
 * @param formId
 * @param fieldName
 * @param msg 不通过提示
 * @param fun 判断逻辑
 */
function addCallbackValidator(formId, fieldName, msg, fun) {
    $(formId).bootstrapValidator("addField", fieldName, {
        trigger: "change",
        validators: {
            callback: {
                message: msg,
                callback: function (value) {
                    return fun(value)
                }
            },
        }
    });
}
/**
 * 是否启用字段校验
 * @param formId
 * @param fieldNames
 * @param boolean
 */
function enableFieldValidator(formId, fieldNames, boolean) {
    var bootstrapValidator = $(formId).data('bootstrapValidator');
    for (var fieldName of fieldNames) {
        bootstrapValidator.updateStatus(fieldName, "NOT_VALIDATED");
        bootstrapValidator.enableFieldValidators(fieldName, boolean);
    }
}
/**
 * 校验指定字段
 * @param formId
 * @param fieldNames
 */
function validatorFields(formId, fieldNames) {
    var flag = true;
    for (var fieldName of fieldNames) {
        var bootstrapValidator = $(formId).data('bootstrapValidator');
        bootstrapValidator.revalidateField(fieldName);
        if (flag) {
            flag = bootstrapValidator.isValidField(fieldName);
        }
    }
    return flag;
}
/**
 * bootstrapValidator
 * @param formid 表单id
 * @returns {*|Boolean|boolean|jQuery}
 */
function validateForm(formid) {
    var bootstrapValidator = $(formid).data('bootstrapValidator');
    bootstrapValidator.validate();
    return bootstrapValidator.isValid();
}

/**
 * 触发时间输入框的时间检查
 */
function dateValidator($form) {
    $('.datepicker').on("blur", function () {
        var filedName = $(this).attr("name")
        try {
            $form.data('bootstrapValidator')
                .updateStatus(filedName, 'NOT_VALIDATED', null)
                .validateField(filedName);
        } catch (e) {
            console.log(" " + e)
        }

    })
}
/**
 *
 * @param name input控件name
 * @param checkValArr 选中的值 数组
 */
function setCheckBoxValue(name, checkValArr) {
    for (var i = 0; i < checkValArr.length; i++) {
        $("input[name='" + name + "']").each(function () {
            if ($(this).val() == checkValArr[i]) {
                $(this).attr("checked", "checked");
            }
        })
    }
}
/**
 * 填充 form 表单,根据 row 数据的key确定控件 name
 * @param row 数据行
 * @param formid 表单#id
 */
function autoFillForm(row, formid) {
    for (var key in row) {
        var value = row[key];
        var $form_control = [];
        if (formid) {
            $form_control = $(formid + " [name='" + key + "']");
        } else {
            $form_control = $("[name='" + key + "']");
        }
        if (!$form_control[0]) continue;
        if ($form_control.length > 1) {
            //多个，说明是复选框或单选框
            setCheckBoxValue(key, value.split(","))
        } else {
            if ($form_control.hasClass("datepicker") && value) {
                //意思是，时间2019-02-02 00:00:00等格式不要消失数
                value = value.split(" ")[0]
            }
            $form_control.val(value)
        }

    }
}
/**
 * 清空 form 表单 重置
 * @param formid 表单id
 */
function clearForm(formid) {
    $(formid + " button[type='reset']").click()
}

/**
 * 提取 form 表单数据
 * @param formid 表单id
 * @returns string $(formid).serialize();
 */
function dataForm(formid) {
    return $(formid).serialize();
}
/**
 * 提取 form 表单数据
 * @param formid 表单id
 * @returns string json字符串，复选框值“,”连接;
 */
function dataFormJson(formid) {
    return JSON.stringify(dataFormObj(formid));
}

function dataFormObj(formid) {
    var objs = $(formid).serializeArray();
    var retObj = {};
    for (obj of objs) {
        var reKey = obj["name"];
        var reVal = retObj[reKey];
        if (reVal && reVal.length > 0) {
            reVal = reVal + "," + obj["value"].trim()
        } else {
            reVal = obj["value"].trim()
        }
        retObj[reKey] = reVal
    }
    return retObj;
}

/**
 * 指定滚动条滚到哪里
 * @param $content 滚动条属于哪个box
 * @param id 要滚去哪里
 */
function scrollTo($container, $scrollTo) {
    var topx = $scrollTo.offset().top - $container.offset().top + $container.scrollTop();
    // $container.scrollTop(topx);
    $container.animate({
        scrollTop: topx
    }, 500);
}

/**
 * 创建简单列表表格
 * 无分页 或 前端分页
 * @param $el 表格jq对象
 * @param data 数据列
 * @param columns 标题列
 * @param height 高度
 * @param methods 事件方法们 onClickRow(row)
 */
function buildSampleTable($el, data, columns, height,methods) {
    var h = height || 500;
    $el.bootstrapTable({
        height: h,
        sortable: true,
        sortOrder: "desc",
        columns: columns,
        data: data,
        clickToSelect: false,
        pageSize: 10,
        pageNumber: 1,
        pageList: "[5,10, 25, 50, 100,ALL]",
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        sidePagination: "client", //前端分页
        onClickRow:function (row) {
            if (methods&&methods.onClickRow) {
                methods.onClickRow(row)
            }

        }
    })
}

/**
 * * 获取表格选中项
 * 没有返回false 有返回数据
 * @param $table 表格对象
 * @returns {jQuery|*|value|boolean}
 */
function tableHasChoose($table) {
    var obj = $table.bootstrapTable("getSelections");
    if (!obj || obj.length == 0) {
        layer.msg('请选择要操作的数据！');
        return false;
    }
    return obj;
}

/**
 *
 * 获取表格一个选中项
 * 非 者返回false 是 返回数据
 * @param $table 表格对象
 * @returns {jQuery|*|value|boolean}
 */
function tableHasOneChoose($table) {
    var obj = tableHasChoose($table)
    if (!obj || obj.length != 1) {
        layer.msg('请选择一条数据！');
        return false;
    }
    return obj[0];
}

/**
 * 是否 数组内包含目标
 * @param arr 数组
 * @param tar 目标
 * @returns {boolean}
 */
function arrHasOne(arr, tar) {
    for (var one of arr) {
        if (one == tar) return true;
    }
    return false;
}


/**
 * 获取 项目选择
 * @returns {any}
 * {
 * "city":{"name":"那曲市","code":542400},
 * "county":{"name":"尼玛县","code":542430},
 * "project":{"name":"XXXX西藏自治区水利项目","id":"123"}
 * }
 */
function getProjectData() {
    var selected = sessionStorage.getItem("selected")
    return JSON.parse(selected)

}

/***
 * 提示先选择项目
 */
function loadingPage() {
    var msg = "请先选择项目！";
    layer.msg(msg)
    return;
}

/**
 * 删除按钮询问框
 * @param $table 数据列表对象
 * @param fun(objs) 确认后回调(选中的数据们)
 */
function deleteConfirm($table, fun) {
    var obj = tableHasChoose($table)
    if (!obj) return;
    layer.confirm("您已选中<span style='color:red;padding:0 5px;font-weight:bold;'>" + obj.length + "</span>条，是否删除？", {
            icon: 3,
            title: '删除提示'
        },
        function (index) {
            fun(obj)
            //$table.bootstrapTable('refresh');
            layer.close(index);
        })
}
//字典类型枚举
var dictTypeIdEnum = {
    //流域
    watershed: "203",
    //项目状态
    pjStatus: "202",
    //项目类型
    pjType: "204",
    //投资类型
    fundsProvided: "209",
    //建设性质
    nature: "207",
    //统计分类
    statistic: "208",
    //招标办法
    bidWay: "211",
    //合同种类
    cType: "212",
}
/**
 * 字典根据velue获取label
 * @param value
 * @returns {string|*}
 */
function fitDictName(dictTypeId, value) {
    /**
     * 传数据字典类型和input的name传值
     */
    var dictsList = JSON.parse(sessionStorage.getItem('dictsList'));
    var dicts = dictsList[dictTypeId]["dicts_" + dictTypeId + "_" + value];
    return dicts || "未知"
}

function fitDateStr(dateStr) {
    if (dateStr) {
        return dateStr.toString().split(" ")[0]
    }
    return "--"
}
/**
 * reportDate 备案时间不能晚于 reportStarDate开工时间15个工作日
 * @param reportDate
 * @param reportStarDate
 * @returns {boolean} 符合true 不符合false
 */
function compareDate(reportDate,reportStarDate) {
    var reportStarDateT = new Date(reportStarDate).getTime()
    var reportDateT = new Date(reportDate).getTime()
    var oneDay = 1000*60*60*24;//1天毫秒数
    var past = (reportDateT-reportStarDateT)/oneDay//过去天数
    var weekEndCount = (past+1) / 7 * 2;//双休天数

    if ((past-weekEndCount)<15){
        //不到15天
        return true;
    }else{ //大于15天，看看减去节假日时间
        //计算两个的工作日之差(算上节假日)

        var workNum = 0;
        var holidaysStor = sessionStorage.getItem("pjInfo_holidays")
        var holidays ;
        if (!holidaysStor){
            $.ajax({
                type: 'get',
                url: 'http://timor.tech/api/holiday/year/',
                dataType: 'json',
                async: false,
                success: function (data) {
                    console.log('success', data.holiday)
                    holidays = data.holiday
                    if (holidays){
                        sessionStorage.setItem("pjInfo_holidays",JSON.stringify(holidays))
                    }
                },
                error: function (xhr, textstatus, error) {
                    console.log('调用节假日API失败', textstatus, error)
                    return true;
                }
            })
        }else {
            holidays=JSON.parse(holidaysStor);
        }
        if (holidays){
            for (var i = 0; i <= past; i++) {
                //遍历每一天
                var dateTime = reportStarDateT+oneDay*i;
                var date = new Date(dateTime);
                var dayOfWeek = date.getDay();//6 | 0 周六周末
                var dayForMD = date.format("MM-dd");//月日字符串
                var isHoliday = false;//法定节假日
                var isWeekday = dayOfWeek==0||dayOfWeek==6;//周末
                for (var key in holidays) {
                    if (dayForMD==key&&holidays[key].holiday) {
                        //法定节假日
                        console.log("法定节假日",key)
                        isHoliday=true;
                        break;
                    }
                    if (dayForMD==key&&!holidays[key].holiday&&isWeekday) {
                        //法定节假日周末调休，算上班，不是周末
                        console.log("法定节假日周末调休",key)
                        isWeekday=false;
                        break;
                    }
                }
                if (!isHoliday&&!isWeekday){
                    //非法定且非周末
                    workNum++;
                }
            }
            console.log("workNum",workNum)
            if (workNum>15){
                //晚于15个工作日
                return false;
            } else {
                return true;
            }
        }else {
            //没获取到节假日数据
            return true;
        }

    }

    return false;
}