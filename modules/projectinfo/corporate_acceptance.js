/*法人验收计划*/
define("modules/projectinfo/corporate_acceptance",
    ["jquery", "layer", "page/tools","underscore",
        "text!modules/projectinfo/iframs/acceptance/form.html",
        "text!modules/projectinfo/iframs/acceptance/form_b.html",
        "bootstrap-table", "bootstrap-fileinput-locale-zh","bootstrap-datepicker",
        "css!/css/projectinfo.css"
    ],
    function ($, layer, tools,_,templ,templ_b) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                var projectData = getProjectData()
                if (projectData.project==null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                //上传附件
                tools.initFileInput("fFrysjhfj", pjId, "PM","F_FRYSJH",pjId);
                tools.loadFilesHtml("#filesDiv",pjId,"F_FRYSJH")
                tools.initFileInput("F_ZFYSJH", pjId, "PM","F_ZFYSJH",pjId);
                tools.loadFilesHtml("#filesDivZF",pjId,"F_ZFYSJH")
            }
        }
        return page;
    });
