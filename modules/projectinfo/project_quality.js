/*工程质量*/
define("modules/projectinfo/project_quality",
    ["jquery","layer","page/tools","bootstrap-table","bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css"],
    function ($,layer,tools) {
    var page = function () {
    };
    page = {
        init: function (request) {
            tools.setNavData(1)
            var projectData = getProjectData()
            if (projectData.project==null) {
                loadingPage()
            }
            $('.datepicker').datepicker();

            var uuid = projectData.project.id
            var projectRe ={} ;
            $.api.projectInfo.findById.exec({id:uuid},function (re) {
                if (re.success&&re.data){
                    projectRe = re.data;
                   var safetyDirector = projectRe.safetyDirector||"";
                    $("[name='safetyDirector']").val(safetyDirector)
                }else {
                    layer.msg("获取项目信息失败")
                }
            })
            $("[name='safetyDirector']").on("change",function () {
                projectRe.safetyDirector = $(this).val();
                $.api.projectInfo.update.exec(projectRe,function (re) {
                    if (re.success){
                        layer.msg("修改安全责任人成功！")
                    } else {
                        layer.msg(re.msg)
                    }
                })
            })
            //上传附件
            var settings = {
                "fileTypeArr":[]
            }
            tools.initFileInput("xmfrzjzl", uuid, "PM","F_FRZJZL",pjId,settings);
            tools.loadFilesHtml("#xmfrzjzlDiv",uuid,"F_FRZJZL")
            tools.initFileInput("xmfrzlzrzszzl", uuid, "PM","F_FRZLZRZSZ",pjId,settings);
            tools.loadFilesHtml("#xmfrzlzrzszzlDiv",uuid,"F_FRZLZRZSZ")
            tools.initFileInput("xmfrzlglzd", uuid, "PM","F_FRZLGLZD",pjId,settings);
            tools.loadFilesHtml("#xmfrzlglzdDiv",uuid,"F_FRZLGLZD")
            tools.initFileInput("jljgslzl", uuid, "PM","F_JLJGSL",pjId,settings);
            tools.loadFilesHtml("#jljgslzlDiv",uuid,"F_JLJGSL")
            tools.initFileInput("jlzlkzzdhtxwj", uuid, "PM","F_JLZLKZZDHTX",pjId,settings);
            tools.loadFilesHtml("#jlzlkzzdhtxwjDiv",uuid,"F_JLZLKZZDHTX")
            tools.initFileInput("jlghzl", uuid, "PM","F_JLGHZL",pjId,settings);
            tools.loadFilesHtml("#jlghzlDiv",uuid,"F_JLGHZL")
            tools.initFileInput("xtssxz", uuid, "PM","F_XTSSXZ",pjId,settings);
            tools.loadFilesHtml("#xtssxzDiv",uuid,"F_XTSSXZ")
            tools.initFileInput("jlyb", uuid, "PM","F_JLYB",pjId,settings);
            tools.loadFilesHtml("#jlybDiv",uuid,"F_JLYB")
            tools.initFileInput("sggljgjl", uuid, "PM","F_SGGLJGJL",pjId,settings);
            tools.loadFilesHtml("#sggljgjlDiv",uuid,"F_SGGLJGJL")
            tools.initFileInput("sgzlglzd", uuid, "PM","F_SGZLGLZD",pjId,settings);
            tools.loadFilesHtml("#sgzlglzdDiv",uuid,"F_SGZLGLZD")
            tools.initFileInput("zxsgfa", uuid, "PM","F_ZXSGFA",pjId,settings);
            tools.loadFilesHtml("#zxsgfaDiv",uuid,"F_ZXSGFA")
            tools.initFileInput("sggyfa", uuid, "PM","F_SGGYSYFA",pjId,settings);
            tools.loadFilesHtml("#sggyfaDiv",uuid,"F_SGGYSYFA")
            tools.initFileInput("zxjcfabzjcg", uuid, "PM","F_ZXJCFA",pjId,settings);
            tools.loadFilesHtml("#zxjcfabzjcgDiv",uuid,"F_ZXJCFA")
            tools.initFileInput("zlsgyjfa", uuid, "PM","F_ZLSGYJYA",pjId,settings);
            tools.loadFilesHtml("#zlsgyjfaDiv",uuid,"F_ZLSGYJYA")
            tools.initFileInput("xgyxclyytg", uuid, "PM","F_XGYXCL",pjId,settings);
            tools.loadFilesHtml("#xgyxclyytgDiv",uuid,"F_XGYXCL")
            tools.initFileInput("xmfrdwgczlzszrcrs", uuid, "PM","F_XMFRDWCNS",pjId,settings);
            tools.loadFilesHtml("#xmfrdwgczlzszrcrsDiv",uuid,"F_XMFRDWCNS")
            tools.initFileInput("sjdwgczlzszrcrs", uuid, "PM","F_SJCNS",pjId,settings);
            tools.loadFilesHtml("#sjdwgczlzszrcrsDiv",uuid,"F_SJCNS")
            tools.initFileInput("kcdwgczlzszrcrs", uuid, "PM","F_KCSJCNS",pjId,settings);
            tools.loadFilesHtml("#kcdwgczlzszrcrsDiv",uuid,"F_KCSJCNS")
            tools.initFileInput("sgdwgczlzszrcrs", uuid, "PM","F_SGCNS",pjId,settings);
            tools.loadFilesHtml("#sgdwgczlzszrcrsDiv",uuid,"F_SGCNS")
            tools.initFileInput("zljcdwgczlzszrcrs", uuid, "PM","F_ZLJCCNS",pjId,settings);
            tools.loadFilesHtml("#zljcdwgczlzszrcrsDiv",uuid,"F_ZLJCCNS")
            tools.initFileInput("yjxzrbp", uuid, "PM","F_YJXZRBSP",pjId,settings);
            tools.loadFilesHtml("#yjxzrbpDiv",uuid,"F_YJXZRBSP")


            tools.initFileInput("f_zljds", uuid, "PM","F_ZLJDS",pjId,settings);
            tools.loadFilesHtml("#fZljds",uuid,"F_ZLJDS")


            tools.initFileInput("f_aqscgljg", uuid, "PM","F_AQSCGLJG",pjId,settings);
            tools.loadFilesHtml("#fAqscgljg",uuid,"F_AQSCGLJG")
            tools.initFileInput("f_lsaqsczrz", uuid, "PM","F_LSAQSCZRZ",pjId,settings);
            tools.loadFilesHtml("#fLsaqsczrz",uuid,"F_LSAQSCZRZ")
            tools.initFileInput("f_aqscjypxglzd", uuid, "PM","F_AQJYPX",pjId,settings);
            tools.loadFilesHtml("#fAqscjypxglzd",uuid,"F_AQJYPX")
            tools.initFileInput("f_aqscjczd", uuid, "PM","F_AQJC",pjId,settings);
            tools.loadFilesHtml("#fAqscjczd",uuid,"F_AQJC")
            tools.initFileInput("f_aqscjsjdzd", uuid, "PM","F_AQJSJD",pjId,settings);
            tools.loadFilesHtml("#fAqscjsjdzd",uuid,"F_AQJSJD")
            tools.initFileInput("f_ydaqglzd", uuid, "PM","F_YDAQ",pjId,settings);
            tools.loadFilesHtml("#fYdaqglzd",uuid,"F_YDAQ")
            tools.initFileInput("f_xfaqglzd", uuid, "PM","F_XFAQ",pjId,settings);
            tools.loadFilesHtml("#fXfaqglzd",uuid,"F_XFAQ")
            tools.initFileInput("f_gkzyaqfhzd", uuid, "PM","F_GKZYAQ",pjId,settings);
            tools.loadFilesHtml("#fGkzyaqfhzd",uuid,"F_GKZYAQ")
            tools.initFileInput("f_bqaqhdzd", uuid, "PM","F_BQAQ",pjId,settings);
            tools.loadFilesHtml("#fBqaqhdzd",uuid,"F_BQAQ")
            tools.initFileInput("f_lgzydhgclglzd", uuid, "PM","F_LGZYAQ",pjId,settings);
            tools.loadFilesHtml("#fLgzydhgclglzd",uuid,"F_LGZYAQ")
            tools.initFileInput("f_fhfbglzd", uuid, "PM","F_FHFBGL",pjId,settings);
            tools.loadFilesHtml("#fFhfbglzd",uuid,"F_FHFBGL")
            tools.initFileInput("f_aqsgclbgzd", uuid, "PM","F_AQSGCL",pjId,settings);
            tools.loadFilesHtml("#fAqsgclbgzd",uuid,"F_AQSGCL")
            tools.initFileInput("f_aqjfzd", uuid, "PM","F_AQJFZD",pjId,settings);
            tools.loadFilesHtml("#fAqjfzd",uuid,"F_AQJFZD")
        }
    }
    return page;
});