/*首页*/
define("modules/index/index",
    ["jquery", "page/tools", "underscore",
        "text!modules/projectinfo/iframs/overview/form.html"
    ],
    function ($, tools, _, templ) {
        var page = function () {

        };
        page = {
            init: function (request) {
                $("#contentTop").css({height:"50px",backgroundColor: "#FFFFFF"})



            }
        }


        return page;

    });