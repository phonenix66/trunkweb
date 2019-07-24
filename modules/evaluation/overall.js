/*总体考核*/
define("modules/evaluation/overall",
    ["jquery","layer","page/tools","underscore",
        "text!modules/evaluation/overallData.json",
        "text!modules/evaluation/table-temp.html",
        "bootstrap-table",
        "modules/projectinfo/utils"
    ], function ($,layer,tools,_,overallData,tableTemp) {
        var page = function () {
        };
        page = {
            init: function (request) {
                console.log("总体考核")
                var data = JSON.parse(overallData)
                var table_html = _.template(tableTemp)(data)
                $("#ul").prepend(table_html)

            }
        }
        return page;
    });