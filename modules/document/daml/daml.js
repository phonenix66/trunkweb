/**
 * 资源目录维护
 */
define("modules/document/daml/daml", ["jquery", "underscore", "page/tools",  "jquery-treegrid", "bootstrap-table-treegrid"], function($, _, tools) {
    var page = function() {};
    var resourceUrl = `${tools.API_URL}/document/dmDocument`;
    var sysFileUrl  = `${tools.FILE_API_URL}/tools/file`
    page = {
        init: function(request) {
            //隐藏选择项目下拉框
            $('#projectNav').show();
            tools.setNavData(1);
            var loginName = tools.getLoginName();
            var showNum;
            var city = sessionStorage.getItem("selected");
            var cityEntity = JSON.parse(city);

            var projectId = '';
            var projectName = '';
            //设置项目id
            if(cityEntity !=null){
                if(cityEntity.project != null){
                    projectId = cityEntity.project.id;
                    projectName= cityEntity.project.pjName;
                }
            }

            $('#zlgdId').val("0");//父节点默认给0

            var column = [
                {
                    field: 'docName',
                    title: '名称',                    width: 200,

                    formatter: function(value, row, index) {
                        if(row.docName != null){
                             return row.docName;
                        }else{
                             return "-";
                        }
                        // return '<img style="width:70;height:30px;"  src="modules/document/300.ico" />'+ row.docName
                    },
                    editable: {
                        type: 'text',
                        title: '名称',
                        validate: function (v) {
                            if (!v) return '名称不能为空';
                            if(v.length>50){return '名称长度不能大于50位';}
                        }
                    }
                },
                {
                    field: 'status',
                    title: '操作',
                    width: 100,
                    align: 'center',
                    formatter: function (value, row, index) {

                        if(row._parent != null){
                            row.fName=  row._parent.docName;
                            row._parent=null;
                        }else{
                            row.fName= projectName;
                        }

                        var rowObj = JSON.stringify(row);
                            var temp_listbtn =
                                `
<!--<button type="button" class="btn btn-info zdy-btn-edit" data='${rowObj}'>编辑</button>&nbsp-->
                        <button type="button" class="btn btn-info zdy-btn-tjxj"  data='${rowObj}'>添加下级</button>&nbsp
                        <button type="button" class="btn btn-info zdy-btn-sc"  data='${rowObj}'>删除</button>`
                            return temp_listbtn;

                    }
                }
            ];

            $("#example-basic").bootstrapTable({
                method: "get",
                url: `${resourceUrl}/findList`,
                contentType: "application/x-www-form-urlencoded",
                //		      url: 'modules/tzgl/htgl/datas/treegrid.json',
                queryParams: function () { //请求服务器发送的参数
                    return {
                        pageSize: -1,
                        pjId:projectId
                    }
                },
                height: $('#content').height() - 100,
                striped: true,
                sidePagination: 'client',

                //这里是标志id  和 parentIdField有关系
                idField: 'iId',
                columns: column,
                //最主要的就是下面  定义哪一列作为展开项  定义父级标志 这里是pid
                //定义的列一定是要在表格中展现的  换言之就是上方有这个列 不然报错
                treeShowField: 'docName',
                parentIdField: 'fiId',
                onLoadSuccess: function (data) {
                    $("#example-basic").treegrid({
                        //initialState: 'stacked',
                        initialState: 'expanded',
                        saveState:true,
                        treeColumn: 0,
                        expanderExpandedClass: 'glyphicon glyphicon-triangle-bottom',
                        expanderCollapsedClass: 'glyphicon  glyphicon-triangle-right',
                        onChange: function () {
                            $("#example-basic").bootstrapTable('resetWidth');
                        }
                    });
                },
                onClickRow:function (row,$element) {
                    $('#zlgdId').val(row.id);
                    //样式
                    $('tr[class^="treegrid-"]').css("background-color","");
                    $element.css("background-color","rgb(226, 230, 234)");
                    var fileName = $('#scName').val();
                    $("#example").bootstrapTable('refresh', {
                        query: {
                            businessId:row.id,
                            fileName:fileName
                        }
                    });
                },
                onEditableSave: function (field, row, oldValue, $el) {
                  // alert("编辑成功");
                    var url = `${resourceUrl}/update`;
                    saveZlgd(row,url);
                }

                });

            /**
             * table显示
             */
            $('#example').bootstrapTable({
                url: `${sysFileUrl}/findFileList`,
                method: "get",
                toolbar: '', //工具按钮用哪个容器
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
                queryParams: function() { //请求服务器发送的参数
                    var businessId = $('#zlgdId').val();
                    return {
                        businessId : businessId
                    }
                },
                responseHandler: function(res) {
                    var data = res.body.sysFileList;
                    return data;
                },
                columns: [{
                    field: "fileName",
                    title: "文件名称"
                     },
                    {
                        field: "createDate",
                        title: "创建时间",
                        formatter: function(value, row, index) {
                            return (value !=null && value !="")?
                                new Date(value).format("yyyy-MM-dd"):value;
                        }
                    },
                    {
                        field: "3",
                        title: "操作",
                        formatter: function(value, row, index) {


                            var data = JSON.stringify(row);
                            var v =`<button type='button'  class='btn btn-info zdy-btn-dow' data='${data}'>下载</button>&nbsp
							        	<button type='button'  class='btn btn-info zdy-btn-delete' data='${data}'>删除</button>`;

                            return v;
                        }
                    }
                ]
            });


            $('.box-body').on("click", '.zdy-btn-dow', function () {
                var row = eval("("+$(this).attr("data")+")");
                window.location.href=tools.FILE_API_URL+'/tools/file/download/'+row.id;
            });


            $('.box-body').on("click", '.zdy-btn-delete', function () {
                var row = eval("("+$(this).attr("data")+")");
                    $.ajax({
                        url: tools.FILE_API_URL+"/tools/file/delete/"+row.id,
                        type: 'post',
                        async: false,
                        success: function (data) {
                            $("#example").bootstrapTable('refresh', {
                                query: {
                                    pageSize: -1,
                                    businessId:$('#zlgdId').val()
                                }
                            });
                        }
                    });
            });

            /**
             * 新增归档信息
             */
            $("#daml_add").on("click", function() {
                //弹窗
                var data = {fId:'0',
                    docName:'节点名称'};
                var url = `${resourceUrl}/save`
                saveZlgd(data,url);
                // tools.toDialog({
                //     name: "新增归档信息",
                //     url: "modules/document/daml/daml_add.html",
                //     btn: ['保存','关闭'],
                //     param : {
                //         add: {
                //            fiId : 0,
                //            projectName : projectName
                //         }
                //     },
                //     success: function(obj, index) {
                //
                //     },
                //     yes: function(obj, index, data) {
                //         var url = `${resourceUrl}/save`
                //         saveZlgd(data,url);
                //     }
                //
                // });
            });

            /**
             * 新增文件
             */
            $('#affix_add').on("click", function () {
                var zlgdId= $('#zlgdId').val();
                if(zlgdId == null || zlgdId == '0'){
                   layer.msg("请选择资料");
                    return;
                }
                //弹窗
                tools.toDialog({
                    name: "新增文件",
                    area:['40%', '40%'],
                    url: "modules/document/daml/affix_add.html",
                    btn: ['关闭'],
                    param : {
                        id: zlgdId,
                        projectId:projectId
                    },
                    success: function(obj, index) {

                    },
                    yes: function(obj, index, data) {
                        layer.closeAll();
                        $("#example").bootstrapTable('refresh', {
                            query: {
                                pageSize: -1,
                                businessId:$('#zlgdId').val()
                            }
                        });
                    }

                });
            });

            /**
             * 模糊查询
             */
            $('#query').on("click", function () {
               var scName = $('#scName').val();
                $("#example").bootstrapTable('refresh', {
                    query: {
                        pageSize: -1,
                        fileName: scName
                    }
                });
            });

            /**
             * 保存或修改
             * @param data
             * @param url
             */
            function saveZlgd(data,url) {
                data.pjId = projectId;
                $.ajax({
                    type: "post",
                    url: url,
                    data: data,
                    async: true
                }).then(function(data) {
                    layer.closeAll();
                    $("#example-basic").bootstrapTable('refresh', {
                        query: {
                            pageSize: -1
                        }

                    });
                }, function() {
                    console.log("请求错误");
                });
            }

            /**
             * 编辑类目名称
             */
            $('.box-body').on("click", '.zdy-btn-edit', function () {
                var row = eval("("+$(this).attr("data")+")");

                //弹窗
                tools.toDialog({
                    name: "新增归档信息",
                    url: "modules/document/daml/daml_add.html",
                    btn: ['保存','关闭'],
                    param : row,
                    success: function(obj, index) {

                    },
                    yes: function(obj, index, data) {
                        var url = `${resourceUrl}/update`;
                        saveZlgd(data,url);
                    }

                });
            });

            /**
             * 添加下级
             */
            $('.box-body').on("click", '.zdy-btn-tjxj', function () {
                var row = eval("("+$(this).attr("data")+")");
                var url = `${resourceUrl}/save`
                //         fId : row.id,
                //         fName : row.docName
                var data = {fId:row.id,
                            fName : row.docName,
                            docName:'节点名称'};
                saveZlgd(data,url);
                // var row = eval("("+$(this).attr("data")+")");
                // tools.toDialog({
                //     name: "新增归档信息",
                //     url: "modules/document/daml/daml_add.html",
                //     btn: ['保存','关闭'],
                //     param : {
                //         fId : row.id,
                //         fName : row.docName
                //     },
                //     success: function(obj, index) {
                //
                //     },
                //     yes: function(obj, index, data) {
                //         var url = `${resourceUrl}/save`
                //         saveZlgd(data,url);
                //     }
                //
                // });
            });

            /**
             * 删除
             */
            $('.box-body').on("click", '.zdy-btn-sc', function () {
                    var row = eval("("+$(this).attr("data")+")");
                    if(row._nodes.length>0){
                        layer.msg('有子节点');
                    }else{
                        layer.confirm("确定要删除此清单项目？", {
                            title: '提示'
                        }, function (index) {
                            var data = {id: row.id };

                            $.api.doc.daml.delet.exec(data,function (res) {
                                if (res.success){
                                    $("#example-basic").bootstrapTable('refresh', {
                                        query: {
                                            pageSize: -1
                                        }
                                    });
                                    layer.closeAll();
                                    layer.msg('操作成功');
                                }
                                layer.msg(res.msg)
                            });

                        })
                    }

            });



        }
    }
    return page;
});
