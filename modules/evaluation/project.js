/*项目考核*/
define("modules/evaluation/project",
    ["jquery","layer","page/tools","underscore",
        "text!modules/evaluation/projectData.json",
        "text!modules/evaluation/project2_templ.html",
        "bootstrap-table",
        "modules/projectinfo/utils"
    ], function ($,layer,tools,_,projectData,tableTemp) {
        var page = function () {
        };
        page = {
            init: function (request) {
                var data = JSON.parse(projectData)
                var table_html = _.template(tableTemp)(data)
                $("#ul").prepend(table_html)

            }
        }
        return page;
    });
