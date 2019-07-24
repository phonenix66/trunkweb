/*项目划分*/
define("modules/projectinfo/project_partition",
    ["jquery", "layer", "page/tools",
        "text!modules/projectinfo/iframs/project_part/project_part_form_dwgc.html",
        "text!modules/projectinfo/iframs/project_part/project_part_form_fbgc.html",
        "modules/projectinfo/utils", "jstree", "bootstrap-table-zh-CN","bootstrap-fileinput-locale-zh",
        "css!/css/projectinfo.css",
    ],
    function ($, layer, tools, templ_dwgc, templ_fbgc) {
        var page = function () {
        };
        page = {
            init: function (request) {
                tools.setNavData(1)
                var sessionid= sessionStorage.getItem("sessionid")
                var projectData = getProjectData()
                var data = [];
                if (projectData.project==null) {
                    loadingPage()
                }
                // var pjId = "d29cb5c9605b442d822c64eff934b58b";
                var pjId = projectData.project.id;
                //点击节点id
                var pId = pjId
                //点击节点 节点类型（1、项目名称 、2、单位工程、3、分部工程）
                var pointType = 2
                //初始化树形结构
                var to = "dwgc";
                var to_str = "单位工程";
                var uuid = pjId
                //上传附件
                var settings = {
                    "fileTypeArr":["zip"]
                }
                tools.initFileInput("f_spwjfj", uuid, "PM","F_APPROVE",pjId);
                tools.loadFilesHtml("#filesDiv",uuid,"F_APPROVE")
                /**
                 * columnss
                 */
                var columns_dw = [
                    {
                        field: 'name',
                        title: '单位工程名称',
                    },
                    {
                        field: 'count',
                        title: '分部工程数量',
                    },
                    {
                        field: 'm',
                        title: '操作',
                        formatter: function (value, row, index) {
                            var v = ['<button data-title="修改单位工程" data-to="dwgc" data-id= "', row.id, '" type=\'button\' class=\'btn btn-info zdy-btn-edit project-edit\' >修改</button>'];
                            v.push('<button data-title="删除单位工程" data-to="fbgc" data-id="', row.id, '" type="button" class="btn btn-info zdy-btn-edit project-delete" >删除</button>');
                            return v.join("")
                        }
                    }
                ];
                /*单位工程名称、是否主要分部工程、分部工程名称、分部工程编号、单元工程数量*/
                var columns_fb = [
                    {
                        field: 'name',
                        title: '分部工程名称',
                    },
                    {
                        field: 'dyNo',
                        title: '单元工程个数',
                    },
                    {
                        field: 'fbIpt',
                        title: '重要隐蔽单元工程个数',
                    },
                    {
                        field: 'm',
                        title: '操作',
                        formatter: function (value, row, index) {
                            /*本级*/
                            var v = ['<button data-title="修改分部工程" data-to="fbgc" data-id= "', row.id, '" type=\'button\' class=\'btn btn-info zdy-btn-edit project-edit\' >修改</button>'];
                            v.push('<button data-title="删除分部工程" data-to="fbgc" data-id= "', row.id, '" type=\'button\' class=\'btn btn-info zdy-btn-edit project-delete\' >删除</button>');
                            return v.join("")
                        }
                    }
                ];


                var treeData = [];
                buildTree();//树
                $("#serVal_tree").on("change",function () {
                   var serVal = $("#serVal_tree").val().trim()
                    $("#js_tree").jstree("hide_all")
                    if (serVal&&serVal!="") {
                        for (var row of treeData){
                            if (row.name&&row.name.toString().indexOf(serVal)!=-1){
                                    $("#js_tree").jstree("show_node",pjId) //根
                                    $("#js_tree").jstree("show_node",row.parent) //他的父级
                                    $("#js_tree").jstree("show_node",row.id) //自己
                            }
                        }
                    }else {
                        $("#js_tree").jstree("show_all")
                    }
                })
                //搜索项目
                $("#searchTable").on("click",function () {
                   var serVal = $("#serVal_table").val().trim()
                    var searchData=[]
                    for (var one of data){
                        if (one.name&&one.name.indexOf(serVal)>-1)
                            searchData.push(one)
                    }
                    buildTable($("#dataTable").html('<table id="table"></table>').find('table'), searchData);//数据列表
                })

                function buildTree() {
                    tools.loadTree({
                        url: `${API_URL}/project_info/divde/dataList?pjId=${pjId}&sessionid=${sessionid}`, //请求链接地址
                        treeId: "js_tree", //id选择器名称
                        id: "id", //数据的id名称
                        parentId: "parentId", //数据的父级id名称
                        name: "name", //数据在树的显示字段
                        shortName: "sort", //数据在树的排序字段
                        showAll: true, //是否展开所有的树节点
                        transformation:false,//是否需要格式化数据
                        responseHandler: function (response) { //数据接收到之前回调
                                treeData = response.data;
                                data=[];
                            for (var i = 0; i < treeData.length; i++) {
                                var row = treeData[i];
                                if (row.parent == pId) {
                                    data.push(row);//根
                                }
                            }
                            console.log("数据列表 初始化 "+treeData,data)
                            //
                            buildTable($("#dataTable").html('<table ></table>').find('table'), data);
                            return treeData;
                        },
                        click: function (obj, e) { //树点击事件
                            // 获取当前节点
                            var currentNode = e.node.original;
                            console.log(currentNode)
                            var id = currentNode.id;
                            var this_pointType = currentNode.pointType;
                            if (this_pointType==1) {
                                $("#files").show()
                            }else {
                                $("#files").hide()
                            }

                            pId = id;
                            pointType = this_pointType*1+1

                            if (this_pointType==3) {
                                layer.msg("后面没有了！")
                                return;
                            }
                            if (pointType==2){to = "dwgc";to_str="单位工程"}
                            if (pointType==3){to = "fbgc";to_str="分部工程"}

                            var sdName = currentNode.text;
                            data = [];
                            for (var i = 0; i < treeData.length; i++) {
                                var row = treeData[i];
                                if (row.parent == id) {
                                    //下级数据
                                    data.push(row);
                                }

                            }

                            buildTable($("#dataTable").html('<table id="table"></table>').find('table'), data, 1);

                        }
                    })
                }

                /**
                 *
                 * @param param
                 * @returns {Array|number}
                 */
                function getColums(param) {
                    var re = [];
                    if (pointType==2) re.push(columns_dw);
                    if (pointType==3) re.push(columns_fb);
                    console.log("pointType  "+pointType )
                    return re;
                }
                /*table*/
                var detailView = false;//是否展示 + 号
                function buildTable($el, data, openView) {
                    var columns = getColums()
                    if (to=="dwgc") {
                        //统计分部工程数量
                        for (var row of data){
                            var count=0;
                            for (var j = 0; j < treeData.length; j++) {
                                if (row.id==treeData[j].pid){
                                    count++;
                                }
                            }
                            row.count = count;
                        }
                    }
                    $el.bootstrapTable({
                        height:500,
                        sortable: true,
                        sortOrder: "desc",
                        columns: columns,
                        data: data,
                        clickToSelect: true,
                        pageSize: 5,
                        pageNumber: 1,
                        pageList: "[5,10, 25, 50, 100,ALL]",
                        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                        pagination: true, //是否显示分页（*）
                        sidePagination: "client"//前端分页
                    })
                    //新增
                    $("#btn_add").off("click").on("click", function () {
                        var $this = $(this);
                        var title = "新增 "+to_str
                        var url = "modules/projectinfo/iframs/project_part/project_part_form_"+to+".html";
                        var $html = _.template(getTempl(to))();
                        openForm(title, "add", url, $html,function (data) {
                            var names = data.name;
                            var namesLen = 0;
                            if (typeof (names)=='object') {
                                namesLen = names.length
                            }
                            if (typeof (names)=='string') {
                                namesLen = 1
                            }
                            var dyNos = data.dyNo;
                            var fbIpts = data.fbIpt;
                            var mark = 0;
                            var lastMsg="";

                            for (let i = 0; i < namesLen; i++) {
                                var param = $.extend({}, data);
                                param.name=typeof (names)=='string'?names:names[i];
                                if (dyNos&&dyNos[i]) param.dyNo=typeof (names)=='string'?dyNos:dyNos[i];
                                if (fbIpts&&fbIpts[i]) param.fbIpt=typeof (names)=='string'?fbIpts:fbIpts[i];

                                param.id=tools.getUUID();
                                param.pjId=pjId;
                                param.pointType=pointType;
                                param.pId=pId;
                                param.isNewRecord=true;
                                $.api.projectInfo.divde.edit.exec(param,function (res) {
                                    mark++;
                                    console.log("mark : ",mark,namesLen,mark==namesLen)
                                    if (res.success) {
                                    }else {
                                        lastMsg +=param.name +" 添加失败： " +res.msg;
                                    }
                                    if (mark==namesLen) {
                                        buildTree()
                                        console.log(lastMsg)
                                        layer.closeAll()
                                        if (lastMsg){
                                            layer.msg(lastMsg)
                                        } else {
                                            layer.msg("操作成功！")
                                        }
                                    }

                                })
                            }
                        })
                    })
                    $("#dataTable").off("click",".project-edit").on("click",".project-edit", function () {
                        var $this = $(this);
                        // var title = $this.data("title") //约定命名规范
                        var title = "修改 "+to_str
                        var id = $this.data("id");
                        var url = "modules/projectinfo/iframs/project_part/project_part_form_"+to+".html";
                        var $html = _.template(getTempl(to))();
                        var obj = findRowById(id)
                        openForm(title, "", url, $html,function (data) {
                            data.pjId=pjId;
                            data.pointType=pointType;
                            data.pId=pId;
                            data.isNewRecord=false;
                            $.api.projectInfo.divde.edit.exec(data,function (res) {
                                if (res.success) {
                                    buildTree()
                                    layer.closeAll()
                                }
                                layer.msg(res.msg)
                            })
                        },obj)
                    })
                    $("#dataTable").off("click",".project-delete").on("click",".project-delete", function () {
                        var $this = $(this);
                        var id = $this.data("id");
                        // var title = $this.data("title") //约定命名规范
                        var title = "删除 "+to_str
                        layer.confirm("是否确认删除？", { icon: 3, title: '删除提示' },
                            function (index) {
                                $.api.projectInfo.divde.delete.exec({ids:[id]},function (res) {
                                    layer.msg(res.msg)
                                    buildTree()
                                })
                                layer.close(index);
                            })


                    })
                    function getTempl(to) {
                        if (to=="dwgc") return templ_dwgc;
                        if (to=="fbgc") return templ_fbgc;
                    }
                }

                /**
                 *打开表单
                 * @param mark 标识
                 * @param title
                 * @param url
                 * @param $html
                 */
                function openForm(title, mark, url, $html,fun,obj) {
                    tools.handleModal({
                        eleId: '#form',
                        title: title,
                        url: url,
                        area: ['70%', '60%'],
                        template: $html,
                        param: {
                            data: obj,
                            mark:mark
                        },
                        btn: ['保存', '关闭'],
                        yes: function (obj, index, data) {
                            fun(data)
                        }
                    });
                }


                function findRowById(id) {
                    for (var i = 0; i < treeData.length; i++) {
                        var row = treeData[i];
                        if (row.id == id) {
                            return row;
                        }
                    }
                }

            }
        }
        return page;
    });