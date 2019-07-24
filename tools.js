define("page/tools",
    ["jquery", "underscore", 'backbone', "router",
        "layer", "bootstrap-table-zh-CN", "jstree"
    ],
    function ($, _, Backbone, router) {
        //页面跳转设置导航
        var setNavData = function (data) {
            Backbone.trigger('set:nav', data);
        }
        //保存，修改，删除项目监听
        var handleNavData = function () {
            Backbone.trigger('handle:nav');
        }
        /**
         * 日期格式化
         */
        Date.prototype.format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        $.fn.serializeObject = function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        /**
         * 页面字段隐藏
         * @param {Object} arry 页面name的数组 [a,b,c]
         * @param {Object} flag
         */
        $.fn.hideFrom = function (arry, flag) {
            flag = flag == undefined ? true : flag;
            if (arry) {
                $(this).find(':input').each(function () {
                    if ($.inArray($(this).attr("name"), arry) >= 0 && flag) {
                        $(this).attr("disabled", true);
                    } else if ($.inArray($(this).attr("name"), arry) < 0 && !flag) {
                        $(this).attr("disabled", true);
                    } else {
                        $(this).removeAttr("disabled");
                    }
                })
                return;
            }
            $(this).find(':input').attr("disabled", true);

        };


        /**
         * 获得登陆名
         */
        var getLoginName = function () {
            var userprofile = sessionStorage.getItem('userprofile');
            var user = JSON.parse(userprofile);
            return user.userid;

        };


        /**
         * 获得登陆名
         */
        var getEwindUser= function () {
            var userprofile = sessionStorage.getItem('userprofile');
            var user = JSON.parse(userprofile);
            return user;

        };

        /**
         * 获取uuid
         */
        var getUUID = function () {
            /*var uuid = "";
            $.ajaxSettings.async = false;
            $.get(`${API_URL}/sys/user/uuid`, function (res) {
                uuid = res.uuid
            });
            return uuid;*/
            return guid();
        };
        // Generate four random hex digits.
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        // Generate a pseudo-GUID by concatenating random hexadecimal.
        function guid() {
            return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
        };
        /**
         * 加载checkbox树
         *
         */
        var loadCheckboxTree = function (param) {
            var tree = $('#' + param.treeId);
            tree.jstree({
                "checkbox": {
                    "keep_selected_style": false
                },
                "plugins": ["checkbox", "types", "themes"],
                "themes": {
                    "stripes": true
                },
                "types": {
                    "default": {
                        "icon": false // 关闭默认图标
                    },
                },
                "core": {
                    "data": param.datas
                }
            });
            $('#' + param.treeId).on('changed.jstree', function (e, data) {
                param.selected(e, data);
            })
        };
        /**
         * 加载树
         */
        var loadTree = function (param) {
            $.ajax({
                url: param.url,
                data: param.data || {},
                type: param.type || "GET",
                async: param.async || false,
                dataType: param.dataType || 'json',
                success: function (dataTree) {
                    //接收参数后是否处理
                    dataTree = param.responseHandler ? param.responseHandler(dataTree) : dataTree;
                    //debugger
                    //不存在转换成tree格式的json数据，存在的话无需转换格式数据
                    if (param.transformation || param.transformation == undefined) {
                        dataTree = treeData(dataTree, param.id, param.parentId, param.name, param.shortName, param.getIcon);
                    }

                    var tree = $('#' + param.treeId);
                    var plugins = ["dnd", "search", "types", "wholerow"];
                    plugins = param.plugins ? plugins.concat(param.plugins) : plugins;
                    tree.jstree(true).destroy ? tree.jstree(true).destroy(false) : "";
                    try {
                        tree.jstree({
                            'core': {
                                'data': dataTree
                            },
                            "check_callback": true,
                            "checkbox": {
                                "keep_selected_style": false
                            },
                            "plugins": plugins
                        }).on("loaded.jstree", function (obj, e) { //树加载事件
                            //是否展开树
                            param.showAll ? e.instance.open_all() : "";
                            if (param.level) {
                                var arr = [];
                                var getnode = function (data, arr, level, i) {
                                    var _i = i || 1;
                                    for (var s of data) {
                                        arr.push(s.id);
                                        if (s.clist && _i < level) {
                                            getnode(s.clist, arr, level, _i + 1);
                                        }
                                    }
                                }
                                if (e.instance.settings != null) {
                                    if (e.instance.settings.core.data.length > 0) {
                                        var data = [e.instance.settings.core.data[0].menu];
                                        getnode(data, arr, param.level);
                                        e.instance.open_node(arr);
                                    }
                                }

                            }

                        }).on('changed.jstree', function (obj, e) {
                            param.changed ? param.changed(obj, e) : "";
                        }).on("activate_node.jstree", function (obj, e) { //树点击事件
                            param.click ? param.click(obj, e) : "";
                        }).on("dblclick_node.jstree", function (obj, e) { //树双击事件
                            param.dblclick ? param.dblclick(obj, e) : "";
                        })
                    } catch (e) {}

                    //显示
                    /*tree.jstree(true).settings.core.data = dataTree;
                    tree.jstree(true).refresh();
                    tree.jstree(true).show_all();*/
                    //数据加载完后是否需要回调，返回tree格式的json数据
                    param.endCallback ? param.endCallback(dataTree) : "";
                },
                error: param.error || function (xhr, status, error) {
                    console.error("id为:" + param.treeId + "的tree树组件出现了错误！," + error)
                }
            });

        };

        /**
         *
         * 菜单树数据 前端解析级调用
         * @param {Object} data            json对象
         * @param {Object} id            对象的id名称
         * @param {Object} fid            对象的父级id名称
         * @param {Object} name        对象的节点名称
         * @param {Object} shortName    排序字段
         * @param {Object} getIcon        图标
         */
        var treeData = function (data, id, fid, name, shortName, getIcon) {
            //先把所有的一级节点排序(0为一级节点)
            data = _.sortBy(data, fid);
            var lsData = []; //需要删除的下标
            data.forEach(function (obj, index) {
                obj.id = obj[id];
                obj.text = obj[name];
                obj.parent = obj[fid] == undefined || obj[fid] == 0 ? "#" : obj[fid];
                obj.clist = [];
                data.forEach(function (sobj, sindex) {
                    if (obj[id] == sobj[fid]) {
                        sobj.id = sobj[id];
                        sobj.text = sobj[name];
                        sobj.parent = sobj[fid];
                        obj.clist.push(sobj); //添加子节点
                        lsData.push(sindex);
                    }
                })
            });

            /**
             * 删除重复的同级数据，整理树形结构
             */
            lsData.forEach(function (objIndex, index) {
                data.splice(objIndex, lsData.length); //删除外层节点
            });

            /**
             * 数据排序
             * @param {Object} list
             */
            if (shortName != undefined) {
                var getSortBy = function (list, objName) {
                    _.each(list, function (item) {
                        if (item.clist.length > 0) {
                            item.clist = _.sortBy(item.clist, objName);
                            getSortBy(item.clist, objName);
                        }
                    });
                };
                var shortNameArr = shortName.split(",");
                shortNameArr.forEach(function (objName, index) {
                    getSortBy(data, objName);
                })

            }

            /**
             * 数据图标
             * @param {Object} list
             */
            if (getIcon && typeof (getIcon) == 'function') {
                var setIcons = function (list) {
                    _.each(list, function (item) {
                        item.icon = getIcon(item);
                        if (item.clist && item.clist.length > 0) {
                            setIcons(item.clist);
                        }
                    });
                };
                setIcons(data);
            } else { //默认图标
                var setdefaultIcons = function (list, num) {

                    _.each(list, function (item) {
                        let s = num;
                        item.icon = `images/tree-default-icons/${s}.png`
                        if (item.clist && item.clist.length > 0) {
                            setdefaultIcons(item.clist, s + 1);
                        }
                    });
                };
                setdefaultIcons(data, 0)
            }

            //data = eval("(" + JSON.stringify(data, ["id", "parent", "text", "clist"]) + ")");
            //return getPListCheck(data);
            return getPList(data);
        };

        /**
         *
         * 菜单树数据 前端解析级调用
         * @param {Object} data            json对象
         * @param {Object} id            对象的id名称
         * @param {Object} fid            对象的父级id名称
         * @param {Object} name        对象的节点名称
         * @param {Object} shortName    排序字段
         */
        var treeDataSchedule = function (data, id, fid, name, shortName) {
            //先把所有的一级节点排序(0为一级节点)
            data = _.sortBy(data, fid);
            var lsData = []; //需要删除的下标
            data.forEach(function (obj, index) {
                obj.id = obj[id];
                obj.text = obj[name];
                obj.parent = obj[fid] == undefined || obj[fid] == 0 ? "#" : obj[fid];
                obj.clist = [];
                data.forEach(function (sobj, sindex) {
                    if (obj[id] == sobj[fid]) {
                        sobj.id = sobj[id];
                        sobj.text = sobj[name];
                        sobj.parent = sobj[fid];
                        obj.clist.push(sobj); //添加子节点
                        lsData.push(sindex);
                    }
                })
            });

            /**
             * 删除重复的同级数据，整理树形结构
             */
            lsData.forEach(function (objIndex, index) {
                data.splice(objIndex, lsData.length); //删除外层节点
            });

            /**
             * 数据排序
             * @param {Object} list
             */
            if (shortName != undefined) {
                var getSortBy = function (list) {
                    _.each(list, function (item) {
                        if (item.clist.length > 0) {
                            item.clist = _.sortBy(item.clist, shortName);
                            getSortBy(item.clist);
                        }
                    });
                };
                getSortBy(data);
            }
            //data = eval("(" + JSON.stringify(data, ["id", "parent", "text", "clist"]) + ")");
            //return getPListCheck(data);
            return getPListSchedule(data);
        };

        /**
         * 菜单树方法
         * @param {Object} list
         */
        var getPListSchedule = function (_list) {
            var data = [];
            var getData = function (list) {
                _.each(list, function (item) {
                    data.push({
                        "id": item.id,
                        "parent": item.parent,
                        "scName": item.text,
                        "scSdate": item.scSdate == undefined ? "" : item.scSdate,
                        "scEdate": item.scEdate == undefined ? "" : item.scEdate,
                        "scTotal": item.scTotal == undefined ? "" : item.scTotal,
                        "scUnit": item.scUnit == undefined ? "" : item.scUnit,
                        "scMemo": item.scMemo == undefined ? "" : item.scMemo,
                        "scType": item.scType == undefined ? "" : item.scType,
                        "menu": item
                    });
                    if (item.clist.length > 0) {
                        getData(item.clist);
                    }
                });
            };
            getData(_list);
            return data;
        };

        /**
         * 截取path名称
         * @param {Object} sdPathname
         */
        var getTreeName = function (sdPathname, index) {
            var objs = sdPathname.split("/");
            return objs.length - index >= 0 ? objs[objs.length - index] : "";
        };

        /**
         * 显示下拉框组件
         * @param {Object} param
         */
        var loadSelect = function (param) {
            var _select = function (response) {
                //先初始化
                $('#' + param.selectId).html("");
                //接收参数后是否处理
                response = param.responseHandler ? param.responseHandler(response) : response;
                var initValue = param.initValue;

                //获取第一个option标签 文本显示属性内容
                var initText = param.initText;

                var arr = [];
                if (initValue != undefined || initText != undefined) {
                    initValue = initValue != undefined ? initValue : "";
                    initText = initText != undefined ? initText : initValue;
                    arr.push("<option value='" + initValue + "'>" + initText + "</option>");
                }

                for (var index in response) {
                    var dataObj = response[index];
                    //有该属性则按照形式，没有则返回当前序列化后的对象
                    var value = param.valueField ? dataObj[param.valueField] : JSON.stringify(dataObj);
                    arr.push("<option data='" + JSON.stringify(dataObj) + "' value='" + value + "' >" + dataObj[param.textField] + "</option>");
                }
                $('#' + param.selectId).html(arr.join(""));
                if (param.change) {
                    $('#' + param.selectId).on("change", function () {
                        var data = $('#' + param.selectId).find("option:selected").attr("data");
                        if (data) {
                            data = JSON.parse(data);
                        }
                        param.change(data, this);
                    })
                }
                //完成后是否需要回调
                param.endCallback ? param.endCallback(response) : "";
            }
            if (param.url) {
                //获取第一个option标签  value属性内容
                $.ajax({
                    url: param.url,
                    data: param.data || {},
                    type: param.type || "GET",
                    async: param.async || false,
                    dataType: param.dataType || 'json',
                    success: function (response) {
                        _select(response);
                    },
                    error: param.error || function (xhr, status, error) {
                        console.error("id为:" + param.selectId + "的下拉框组件出现了错误！," + error)
                    }
                });
            } else {
                _select(param);
            }
        };

        /**
         * 菜单树方法
         * @param {Object} list
         */
        var getPList = function (_list) {
            var data = [];
            var getData = function (list) {
                _.each(list, function (item) {
                    var thisData = {
                        "id": item.id,
                        "parent": item.parent,
                        "text": item.text,
                        "icon": item.icon || "",
                        "menu": item
                    }
                    if (item.state) {
                        thisData.state = item.state
                    }
                    data.push(thisData);
                    if (item.clist.length > 0) {
                        getData(item.clist);
                    }
                });
            };
            getData(_list);
            return data;
        };
        /**
         * 获取菜单树  web.config.js var menuList
         */
        var getMenuList = function () {
            var data = [];

            _.each(menuList, function (item1) {
                data.push({
                    "id": item1.id,
                    "parent": "#",
                    "text": item1.name,
                    "menu": item1
                });
                _.each(item1.clist, function (item2) {
                    data.push({
                        "id": item2.id,
                        "parent": item1.id,
                        "text": item2.name,
                        "menu": item1
                    });
                    _.each(item2.clist, function (item3) {
                        data.push({
                            "id": item3.id,
                            "parent": item2.id,
                            "text": item3.name,
                            "menu": item1
                        });
                    });
                });
            });
            return data;
        };

        var moduleName = function (url) {
            return url.substring(0, url.lastIndexOf("."));
        };

        var initModule = function (moduleName, menu) {
            require([moduleName], function (mpage) {
                if (mpage && mpage.init) {
                    mpage.init(menu);
                    fixContentHeight();
                }
            });
        };

        /**
         * 模板工具类
         * @param {Object} temphtml
         * @param {Object} obj
         */
        var template = function (temphtml, obj) {
            return _.template(temphtml)(obj);
        };

        var getTemplateString = function (url) {
            return $.ajax({
                url: url,
                async: false
            }).responseText;
        };

        getSelectedProject = function () {
            return $("#selectproject").val();
        };

        /**
         * 页面跳转工具类
         * @param {Object} menu
         */
        var toDivPage = function (menu) {
            var mname = moduleName(menu.href);
            $.get(menu.href, function (data) {
                var html = [];
                html.push(data);
                html.push('<script src="' + mname + '.js" type="text/javascript" charset="utf-8"></script>');
                layer.open({
                    title: menu.title || menu.name,
                    type: 0,
                    skin: menu.skin || 'layui-layer-rim',
                    shade: menu.shade || 0.8,
                    area: menu.area || ['70%', '80%'],
                    content: html.join(""),
                    success: menu.success,
                    end: menu.end,
                    btn: menu.btn || [],
                    yes: menu.yes
                });
                initModule(mname, menu);
            });
        };

        /**
         * 截取path名称
         * @param {Object} sdPathname
         */
        function getName(sdPathname) {
            var objs = sdPathname.split("/");
            return objs.length - 2 >= 0 ? objs[objs.length - 2] : "";
        }

        /**
         * 页面跳转工具类
         * @param {Object} menu
         */
        var handleModal = function (params) {
            var layerOpts = {
                title: params.title || params.name,
                type: 1,
                skin: params.skin || 'layui-layer-rim',
                shade: params.shade || 0.8,
                area: params.area || ['70%', '80%'],
                content: params.template,
                success: function (obj, index) {
                    //初始化页面js模块
                    //mName模块名
                    var mName = moduleName(params.url);
                    initModule(mName, {
                        moduleName: mName,
                        href: params.url,
                        param: params.param
                    });
                },
                end: params.end,
                btn: params.btn || [],
                yes: function (index, obj) {
                    //保存 确认回调
                    if (!params.param.data || !params.param.data.show) {
                        var data = $(params.eleId).serializeObject();
                        $(params.eleId).data('bootstrapValidator').validate();
                        var flag = $(params.eleId).data('bootstrapValidator').isValid();
                        if (!flag) return;
                    }
                    if (params.yes) {
                        data.sessionid = sessionStorage.getItem('sessionid')
                        params.yes(obj, index, data);
                    }
                },
                btn2: params.btn2,
                btn3: params.btn3
            }
            layer.open(layerOpts);
        }
        var toDialog = function (parameter) {
            var layerFunction = {
                id : parameter.id,
                title: parameter.title || parameter.name,
                type: 2,
                skin: parameter.skin || 'layui-layer-rim',
                shade: parameter.shade || 0.8,
                area: parameter.area || ['70%', '80%'],
                content: "dialog.html",
                success: function (obj, index) {
                    var dwindow = $(obj).find('iframe')[0].contentWindow;
                    dwindow.menu = parameter;
                    if (parameter.success) {
                        parameter.success(obj, index);
                    }
                },
                end: parameter.end,
                btn: parameter.btn || [],
                yes: function (index, obj) {
                    //返回jquery 弹框body dom对象
                    var _obj = $(obj).find('iframe').contents().find('body');
                    try {
                        //如果有校验处理就执行，没有就处理异常保证逻辑正常
                        var dwindow = $(obj).find('iframe')[0].contentWindow;
                        dwindow.$(_obj).find('form').data('bootstrapValidator').validate();
                        var flag = dwindow.$(_obj).find('form').data('bootstrapValidator').isValid();
                        if (!flag) {
                            return false;
                        }
                    } catch (e) {}
                    var data = $(_obj).find('form').serializeObject(); // 返回参数''
                    if (parameter.yes) {
                        data.sessionid = sessionStorage.getItem('sessionid')
                        return parameter.yes(_obj, index, data, dwindow.menu.page);
                    }
                },
                btn2: parameter.btn2,
                btn3: function (index, obj) {
                    //返回jquery 弹框body dom对象
                    var _obj = $(obj).find('iframe').contents().find('body');
                    try {
                        //如果有校验处理就执行，没有就处理异常保证逻辑正常
                        var dwindow = $(obj).find('iframe')[0].contentWindow;
                        dwindow.$(_obj).find('form').data('bootstrapValidator').validate();
                        var flag = dwindow.$(_obj).find('form').data('bootstrapValidator').isValid();
                        if (!flag) {
                            return false;
                        }
                    } catch (e) {}
                    var data = $(_obj).find('form').serializeObject(); // 返回参数''
                    if (parameter.btn3) {
                        data.sessionid = sessionStorage.getItem('sessionid')
                        return parameter.btn3(_obj, index, data, dwindow.menu.page);
                    }
                }
            }
            if (parameter.top) {
                top.layer.open(layerFunction);
            } else {
                layer.open(layerFunction);
            }

        };

        /**
         * 页面跳转工具类
         * @param {Object} menu
         */
        var toPage = function (menu) {
            var mname = moduleName(menu.href);
            $.get(menu.href, function (data) {
                var html = [];
                html.push(data);
                var timestap = new Date().valueOf();
                html.push('<script src="' + mname + '.js?time=' + timestap + '" type="text/javascript" charset="utf-8"></script>');
                $("#content").html(html.join(""));
                initModule(mname, menu);
            });
        };

        /**
         * 菜单跳转渲染右边导航
         * @param {Object} menu
         */
        var toMenuPage = function (menu) {
            console.log(menu);
            toPage(menu);
        };

        /**
         * 当前选中菜单
         */
        var currentSideMenuSelector = null;

        /* var initMenu = function (param) {
            var userprofile = JSON.parse(sessionStorage.getItem('userprofile'));
            var user = userprofile.user;
            var roleId = userprofile.role;
            $.ajax({
                type: "get",
                url: param.url,
                data: {
                    userId: user.id,
                    roleId: roleId
                },
                async: false,
                success: function (json) {
                    initNavbar(json.menuList, userprofile);
                }
            });

            $(window).on('resize', function () {
                fixContentHeight();
            });
        }; */

        var fixContentHeight = function () {
            var minHeight = $('.content-wrapper').css('min-height');
            $('.content-wrapper').css('height', minHeight);
        };

        /**
         * 编辑页面自动为input赋值
         * @param {Object} data
         */
        var setValueToInput = function (data) {
            var inputDom = $(".box-body input[type='text'],input[type='hidden']");
            var selectDom = $(".box-body select");
            var textareaDom = $(".box-body textarea");
            //下拉
            if (selectDom.length > 0) {
                selectDom.each(function (index, _this) {
                    var thisName = $(_this).attr("name");
                    var selectOption = $(_this).children();
                    selectOption.each(function (index, _this) {
                        var optionValue = $(_this).attr("value");
                        if (data[thisName] != undefined && data[thisName] == optionValue) {
                            $(_this).attr("selected", "true");
                        }
                    })
                })
            }
            //文本
            var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1]))?$/;
            var regExp = new RegExp(reg);
            inputDom.each(function (index, _this) {
                var thisName = $(_this).attr("name");
                $("input[name=" + thisName + "]").val(data[thisName]);

                if (regExp.test(data[thisName])) {
                    $("input[name=" + thisName + "]").datepicker("setDate", data[thisName]);
                }
            });
            //文本域
            textareaDom.each(function (index, _this) {
                var thisName = $(_this).attr("name");
                $("textarea[name=" + thisName + "]").val(data[thisName]);
            });
            //附件
            var html = "";
            if (data.sysAffixList) {
                if (data.sysAffixList.length > 0) {
                    var fileList = [];
                    $.extend(fileList, data.sysAffixList);
                    fileList.forEach(function (_this, index, arr) {
                        html += `<div class="col-sm-3">
						<a href = "${FILE_API_URL}/tools/file/download/${_this.id}">${_this.fileName}</a>
						<a href="javascript:;" class="fileDel" data_id="${_this.id}" ><i class="fa fa-fw fa-times"></i></a>
						</div>`
                    });
                    $("#fileDiv").append(html);
                }
            }
            if (data.sysAffixList1) {
                html = "";
                if (data.sysAffixList1.length > 0) {
                    var fileList = [];
                    $.extend(fileList, data.sysAffixList1);
                    fileList.forEach(function (_this, index, arr) {
                        html += `<div class="col-sm-3">
						<a href = "${FILE_API_URL}/tools/file/download/${_this.id}">${_this.fileName}</a>
						<a href="javascript:;" class="fileDel" data_id="${_this.id}" ><i class="fa fa-fw fa-times"></i></a>
						</div>`
                    });
                    $("#fileDiv1").append(html);
                }
            }
            if (data.sysAffixList2) {
                html = "";
                if (data.sysAffixList2.length > 0) {
                    var fileList = [];
                    $.extend(fileList, data.sysAffixList2);
                    fileList.forEach(function (_this, index, arr) {
                        html += `<div class="col-sm-3">
						<a href = "${FILE_API_URL}/tools/file/download/${_this.id}">${_this.fileName}</a>
						<a href="javascript:;" class="fileDel" data_id="${_this.id}" ><i class="fa fa-fw fa-times"></i></a>
						</div>`
                    });
                    $("#fileDiv2").append(html);
                }
            }
            if (data.sysAffixList3) {
                html = "";
                if (data.sysAffixList3.length > 0) {
                    var fileList = [];
                    $.extend(fileList, data.sysAffixList3);
                    fileList.forEach(function (_this, index, arr) {
                        html += `<div class="col-sm-3">
						<a href = "${FILE_API_URL}/tools/file/download/${_this.id}">${_this.fileName}</a>
						<a href="javascript:;" class="fileDel" data_id="${_this.id}" ><i class="fa fa-fw fa-times"></i></a>
						</div>`
                    });
                    $("#fileDiv3").append(html);
                }
            }
            //风场图片
            if (data.sysProjectImgList && data.sysProjectImgList.length > 0) { //风场图片存在
                html = "";
                var fileList = [];
                $.extend(fileList, data.sysProjectImgList);
                fileList.forEach(function (_this, index, arr) {
                    html += `<div class="col-sm-4">
				<a class="thumbnail"><img  height="200" src="${FILE_API_URL}/tools/affix/download/${_this.id}"  alt="${_this.spiName}"/></a>
				<a href="javascript:;" class="fileDel" data_id="${_this.id}" ><i class="fa fa-fw fa-times"></i></a>
				</div>`;
                });
                $("#fileDiv").append(html);
            }


            $(".fileDel").on("click", function () {
                var obj = $(this);
                var id = obj.attr("data_id");
                $.get(`${FILE_API_URL}/tools/file/delete/${id}`, function (result) {
                    if (result.success) {
                        obj.parent('div').remove();
                    } else {
                        layer.msg(result.msg, {
                            icon: 5
                        })
                    }
                })
            })
        };

        /**
         * 文件上传
         * @param {Object} ctrlName 附件input框id
         * @param {Object} businessId        业务id(当前业务id)
         * @param {Object} moduleCode 附件所属模块
         * @param {Object} fileType 附件文件类型
         * @param {Object} projectId 项目id
         * @param {json} settings 初始化参数
         *
         */
        var initFileInput = function (ctrlName, businessId, moduleCode, fileType, projectId, settings) {
            /*String businessId, String fileType, String projectId, String moduleCode,*/
            var fileTypeArr = ['zip', 'dwg', 'jpg','jpeg', 'gif', 'png', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'];
            if (settings) {
                if (fileTypeArr && fileTypeArr.length > 0) {
                    fileTypeArr = settings.fileTypeArr;
                }
            }
            var control = $('#' + ctrlName);

            var footerTemplate = '<div class="file-thumbnail-footer" style ="height:94px">\n' +
                '   <input class="caption-input form-control input-sm form-control-sm text-center" value="{caption}" placeholder="请输入标题">\n' +
                '   <div class="small" style="margin:15px 0 2px 0">{size}</div> {progress}\n{indicator}\n{actions}\n' +
                '</div>';

            control.fileinput({
                language: 'zh', //设置语言
                // uploadUrl: `${FILE_API_URL}/tools/affix/upload`, //上传的地址
                uploadUrl: `${FILE_API_URL}/tools/file/upload`, //上传的地址
                layoutTemplates: {
                    footer: footerTemplate
                },
                allowedFileExtensions: fileTypeArr, //接收的文件后缀
                maxFilesNum: 5, //上传最大的文件数量
                uploadExtraData: {
                    "moduleCode": moduleCode,
                    "fileType": fileType,
                    "businessId": businessId,
                    "projectId": projectId
                },
                uploadAsync: true, //默认异步上传
                showUpload: true, //是否显示上传按钮
                showRemove: false, //显示移除按钮
                showPreview: true, //是否显示预览
                // showCaption: true, //是否显示标题
                browseClass: "btn btn-primary", //按钮样式
                dropZoneEnabled: false, //是否显示拖拽区域
                // minImageWidth: 50, //图片的最小宽度
                // minImageHeight: 50,//图片的最小高度
                // maxImageWidth: 1000,//图片的最大宽度
                // maxImageHeight: 1000,//图片的最大高度
                maxFileSize: 51200, //单位为kb，上传文件最大为5M
                // minFileCount: 0,
                // maxFileCount: 10, //表示允许同时上传的最大文件个数
                enctype: 'multipart/form-data',
                validateInitialCount: true,
                msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
                preferIconicPreview: true,
                previewFileIconSettings: { // configure your icon file extensions
                    'doc': '<i class="fa fa-file-word-o text-primary"></i>',
                    'docx': '<i class="fa fa-file-word-o text-primary"></i>',
                    'xls': '<i class="fa fa-file-excel-o text-success"></i>',
                    'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
                    'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                    'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
                    'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
                    'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
                    'txt': '<i class="fa fa-file-text-o text-info"></i>',
                    'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
                    'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
                    'jpg': '<i class="fa fa-file-photo-o text-danger"></i>',
                    'gif': '<i class="fa fa-file-photo-o text-muted"></i>',
                    'png': '<i class="fa fa-file-photo-o text-primary"></i>'
                },

                // uploadExtraData: function () { // callback example
                // 	// var out = {}, idx = 0;
                // 	// $('.caption-input').each(function() {
                // 	//     $el = $(this);
                // 	//     out[idx++] = $el.val();
                // 	// });
                // 	// //TODO: update file database
                // 	// return out;
                // }

            }).on('filepreupload', function (event, data, previewId, index) { //上传中
                var form = data.form,
                    files = data.files,
                    extra = data.extra,
                    response = data.response,
                    reader = data.reader;
                console.log('文件正在上传');
            }).on("fileuploaded", function (event, data, previewId, index) { //一个文件上传成功
                $('#' + previewId + ' .kv-file-remove').remove();
                sessionStorage.removeItem("fileListData_" + businessId)
                console.log('文件上传成功！' + data.ids);
                // $('.caption-input').find(idx);
                //TODO: update file database
                // $.ajax.put()
            }).on('fileerror', function (event, data, msg) { //一个文件上传失败
                console.log('文件上传失败！' + data.id);
            })

        };

        /**
         * 传数据字典类型和input的name传值
         */
        var dictObject = {};
        var getDictValue = function (dictTypeId, name, formid) {
            var data = {
                "dictTypeId": dictTypeId
            };
            var dicts;
            $.ajax({
                url: `${API_URL}/sys/dict/getDictValue`,
                data: data,
                async: false,
                type: 'get',
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    dicts = data.rows;

                }
            });
            if (dicts != null) {
                dictObject[dictTypeId] = {};
                for (var i = 0; i < dicts.length; i++) {
                    //sessionStorage.setItem("dicts_" + dictTypeId + "_" + dicts[i].id, dicts[i].label)
                    dictObject[dictTypeId]["dicts_" + dictTypeId + "_" + dicts[i].id] = dicts[i].label;
                    var html = '<option value="' + dicts[i].id + '">' + dicts[i].label + '</option>';
                    if (name) {
                        if (formid) {
                            $(formid + ' select[name="' + name + '"]').append(html);
                        } else {
                            $('select[name="' + name + '"]').append(html);
                        }
                    }
                }
                sessionStorage.setItem("dictsList", JSON.stringify(dictObject));
            }

        }
        var getDictCbs = function (sdType, name) {
            var data = {
                "sdType": sdType
            };
            var dicts;
            $.ajax({
                url: `${API_URL}/datadictionary/sysDict/getDictValue`,
                data: data,
                async: false,
                type: 'get',
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    dicts = data;
                }
            });
            if (dicts != null) {
                for (var i = 0; i < dicts.length; i++) {
                    var html = '<option value="' + dicts[i].id + '">' + dicts[i].sdLabel + '</option>';
                    $('select[name="' + name + '"]').append(html);
                }
            }
        }

        /**
         * 传数据字典类型查数据字典数据
         */
        var getDicts = function (dictTypeId) {
            var data = {
                "dictTypeId": dictTypeId
            };
            var dicts;
            $.ajax({
                url: `${API_URL}/sys/dict/getDictValue`,
                data: data,
                async: false,
                type: 'get',
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    dicts = data.rows;
                }
            });
            return dicts;
        }

        var verificationJudge = function (data, name, type, num) {
            if (type == '1') {
                if (data == null || data == '') {
                    layer.msg(name + "不能为空");
                    return true;
                } else {
                    return false;
                }
            } else if (type == '2') {
                if (isNaN(data)) {
                    layer.msg(name + "不是数字");
                    return true;
                } else {
                    return false;
                }
            } else if (type == '3') {
                var boo = true;
                if (data == null || data == '') {
                    layer.msg(name + "不能为空");
                    boo = true;
                } else {
                    $.ajax({
                        url: API_URL + '/tzgl/htgl/findCount/' + data,
                        type: 'post',
                        async: false,
                        dataType: "json",
                        contentType: "application/json",
                        success: function (data) {
                            if (data != '0') {
                                layer.msg(name + "已存在");
                                boo = true;
                            } else {
                                boo = false;
                            }
                        },
                        error: function (returndata) {
                            layer.msg('操作失败');
                            boo = true;
                        }
                    });
                }
                return boo;
            } else if (type == '4') {
                if (data == null || data == '') {
                    return false;
                }
                if (data.length > num) {
                    layer.msg(name + "长度不能大于" + num);
                    return true;
                } else {
                    return false;
                }
            }
        }

        var verificationfklx = function (upper, lower) {
            var m = new Map();
            m.set("预付款", 1);
            m.set("进度款", 2);
            m.set("投料款", 2);
            m.set("结算款", 3);
            m.set("到货款", 3);
            m.set("质保金", 4);
            m.set("验收款", 5);
            if (m.get(upper[0]) > m.get(lower[0])) {
                return true;
            };
            return false;
        }

        /*
         * 导出excel表格
         * @param data 查询条件
         * @param url 接口路径
         */
        var outputExcel = function (data, url) {
            let form = $("<form></form>"); //创建form标签

            form.attr("style", "display:none");
            form.attr("method", "post"); //设置请求方式
            form.attr("action", url); //action属性设置请求路径
            $("body").append(form); //页面添加form标签
            for (item in data) {
                for (key in data[item]) {
                    let input1 = $("<input>") //创建input标签
                    input1.attr("type", "hidden") //设置隐藏域
                    input1.attr("name", key) //设置发送后台数据的参数名
                    input1.attr("value", data[item][key]);
                    form.append(input1);
                }
            }
            form.submit(); //表单提交即可下载！
            form.remove();
        }

        var getSysDict = function (dictTypeId) {
            var data = {};
            var dicts;
            $.ajax({
                url: `${API_URL}/datadictionary/sysDict/find/` + dictTypeId,
                data: data,
                async: false,
                type: 'get',
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    dicts = data;
                }
            });
            if (dicts != null) {
                $('#ihdCommunication').val(dicts.ihdCommunication);
                $('#ihdBank').val(dicts.ihdBank);
                $('#ihdBankNumber').val(dicts.ihdBankNumber);
                $('#ihdTaxNumber').val(dicts.ihdTaxNumber);
                $('#runDepartment').val(dicts.runDepartment);
                $('#runPeople').val(dicts.runPeople);
                $('#ihdPhons').val(dicts.ihdPhons);
                $('#ihdFax').val(dicts.ihdFax);
            }
        }

        var getSysDictByLabel = function (label) {
            var data = {};
            var dicts;
            $.ajax({
                url: `${API_URL}/datadictionary/sysDict/getDictByName/` + label,
                data: data,
                async: false,
                type: 'get',
                contentType: "application/json;charset=UTF-8",
                success: function (data) {
                    dicts = data;
                }
            });
            if (dicts != null) {
                $('#js_ihdCommunication').val(dicts.ihdCommunication);
                $('#js_ihdBank').val(dicts.ihdBank);
                $('#js_ihdBankNumber').val(dicts.ihdBankNumber);
                $('#js_ihdTaxNumber').val(dicts.ihdTaxNumber);
                $('#js_runDepartment').val(dicts.runDepartment);
                $('#js_runPeople').val(dicts.runPeople);
                $('#js_ihdPhons').val(dicts.ihdPhons);
                $('#js_ihdFax').val(dicts.ihdFax);
            }
        }


        var datedifference = function (sDate1, sDate2) {
            var dateSpan,
                tempDate,
                iDays;
            sDate1 = Date.parse(sDate1);
            sDate2 = Date.parse(sDate2);
            dateSpan = sDate2 - sDate1;
            dateSpan = Math.abs(dateSpan);
            iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
            return iDays
        };

        /**
         * 加载组织部门&城市地县
         * @param $treeDiv 放树的div对象
         * @param yesFun (obj:选择的那一条数据)确认后回调
         * @param type 1:主管单位   2:地区  默认 1
         */
        var chooseDeptTree = function ($treeDiv, yesFun, type,jlType) {
            if (!type) type = 1;
            if(!jlType) jlType = 0;
            var temp = `<form style="padding: 5px;" action="javascript:void (0)" class="form-inline col-sm-12">
                <label class="control-label">名称：</label>
                <input type="text" id="serVal_tree" placeholder="输入名称查询">
            </form>
            <div id="chooseDeptTree"></div>`
            var treeData = []
            var chooseObj = '';
            $treeDiv.html(temp)
            loadTree({
                url: `${API_URL}/orgnzation/sysDept/findList?type=` + type+`&jlType=`+jlType, //请求链接地址
                treeId: "chooseDeptTree", //id选择器名称
                id: "id", //数据的id名称
                parentId: "sdFid", //数据的父级id名称
                name: "sdName", //数据在树的显示字段
                shortName: "sdSort", //数据在树的排序字段
                showAll: false, //是否展开所有的树节点
                responseHandler: function (response) { //数据接收到之前回调
                    treeData = response.rows;
                    return response.rows;
                },
                click: function (obj, e) { //树点击事件
                    // 获取当前节点
                    var currentNode = e.node;
                    chooseObj = currentNode.original.menu;
                    var id = currentNode.id;
                    var sdName = currentNode.text;
                }
            })
            $treeDiv.show()
            $("#serVal_tree").on("change", function () {
                var serVal = $("#serVal_tree").val().trim()
                $("#chooseDeptTree").jstree("hide_all")
                if (serVal && serVal != "") {
                    for (var row of treeData) {
                        if (row.sdName.toString().indexOf(serVal) != -1) {
                            console.log(row)
                            var pathId = row.sdPathid;
                            for (var id of pathId.toString().split("/")) {
                                $("#chooseDeptTree").jstree("show_node", id) //他的父级们
                                $("#chooseDeptTree").jstree("show_node", row.id) //自己
                            }
                            var clist = row.clist;
                            if (clist) {
                                for (var next of clist) {
                                    $("#chooseDeptTree").jstree("show_node", next.id) //下级
                                }
                            }
                        }
                    }
                    $("#chooseDeptTree").jstree("open_all")
                } else {
                    $("#chooseDeptTree").jstree("show_all")
                    $("#chooseDeptTree").jstree("close_all")
                }

            })

            layer.open({
                type: 1,
                title: "请选择",
                area: ["300px", "420px"],
                content: $treeDiv,
                btn: ["确定", "取消"],
                btn1: function (index, layero) {
                    if (!chooseObj) {
                        layer.msg("请选择一个")
                        return;
                    }
                    yesFun(chooseObj)
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    layer.close(index);
                }
            });
        }
        /**
         * 加载 法人 人员信息
         * @param $tableDiv 放树的div对象
         * @param yesFun (obj:选择的那一条数据)确认后回调
         */
        var choosePersonTable = function ($tableDiv, yesFun) {
            var temp = `<form id="choosePersonTable_searchForm" action="javascript:void (0)" style="padding: 5px;" class="form-inline col-sm-12">
                <label class="control-label">姓名：</label>
                <input type="text" id="serVal_table" placeholder="输入姓名查询">
            </form>
            <table class="col-sm-12"  id="choosePersonTable"></table>`
            var url = `${API_URL}/ewindsys/ewindUser/data`
            var allData = []
            var chooseObj = '';
            $tableDiv.html(temp)
            $tableDiv.show()
            $('#choosePersonTable').bootstrapTable({
                url: url,
                method: "get",
                toolbar: '', //工具按钮用哪个容器
                clickToSelect: true,
                singleSelect: true,
                striped: true, //是否显示行间隔色
                pageSize: 10,
                pageNumber: 1,
                dataType: "json",
                cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
                pagination: true, //是否显示分页（*）
                sortable: false, //是否启用排序
                sortOrder: "asc", //排序方式
                uniqueId: "id",
                sidePagination: "client", //分页方式：client 客户端分页，server服务端分页（*）
                queryParams: function (params) { //请求服务器发送的参数

                    var searchParam = {
                        name: $("#serVal_table").val(),
                        sessionid: sessionStorage.getItem("sessionid"),
                    };
                    searchParam.isPage = "1";
                    searchParam.pageNo = params.limit === undefined ? "1" : params.offset / params.limit + 1;
                    searchParam.pageSize = params.limit === undefined ? -1 : params.limit;
                    searchParam.orderBy = params.sort === undefined ? "" : params.sort + " " + params.order;
                    return searchParam;
                },
                responseHandler: function (res) {
                    var data = res.rows;
                    var fitrows = [];
                    //获取法人
                    for (var row of data) {
                        if (row.frId) fitrows.push(row);
                    }
                    console.log(fitrows)
                    return fitrows;
                },
                columns: [
                    /*{
                    field: "loginName",
                    title: "账号"
                },*/
                    {
                        title: "",
                        checkbox: true,
                        visible: true
                    },
                    {
                        field: "loginName",
                        title: "用户名"
                    },
                    {
                        field: "name",
                        title: "姓名"
                    },
                    {
                        field: "deptName",
                        title: "部门"
                    },
                    {
                        field: "dutyName",
                        title: "职务"
                    },
                    /*{
                        field: "phone",
                        title: "手机"
                    },*/
                ]
            });
            $("#serVal_table").on("change", function () {
                $('#choosePersonTable').bootstrapTable("refresh")
            })

            layer.open({
                type: 1,
                title: "请选择",
                area: ["600px", "80%"],
                content: $tableDiv,
                btn: ["确定", "取消"],
                btn1: function (index, layero) {
                    chooseObj = $('#choosePersonTable').bootstrapTable("getSelections")[0] || false
                    if (!chooseObj) {
                        layer.msg("请选择一个")
                        return;
                    }
                    yesFun(chooseObj)
                    layer.close(index);
                },
                btn2: function (index, layero) {
                    layer.close(index);
                }
            });
        }
        /**
         *
         *附件控件上面的那排回显
         *进入方法有调用示例
         * @param id 存放文件文本的DIV id 例如 "#filesDiv" ：<div class="col-sm-12" id="filesDiv" > </div>
         * @param businessId  业务数据id  即 initFileInput 中的 uuid
         * @param fileType  文件类型 不传查询出所有业务id的文件
         * @param isview  是否是 查看 ,如果是则不能删除只能下载，默认false
         */
        var loadFilesHtml = function (id, businessId, fileType, isview) {
            try {
                var url = FILE_API_URL + '/tools/file/findFileListByBusinessId/' + businessId
                var filesStor = sessionStorage.getItem("fileListData_" + businessId)
                var files = [];
                if (filesStor) files = JSON.parse(filesStor);
                if (files && files.length > 0) {
                    buidingHtml(id, businessId, files, fileType, isview)
                    return;
                }
                $.getJSON(url, {}, function (res) {
                    if (res.success) {
                        files = res.body.sysFileList
                        sessionStorage.setItem("fileListData_" + businessId, JSON.stringify(files))
                        buidingHtml(id, businessId, files, fileType, isview)
                    }
                })

            } catch (e) {
                console.error(e)
            }
        }

        /**
         * 渲染html
         */
        function buidingHtml(id, businessId, files, fileType, isview) {
            var $filesDiv = $(id)
            var html = [];
            for (var file of files) {
                if (fileType && file.fileType != fileType) continue;
                var disp = 'none';
                console.log(file.fileName,file.fileName.length,file.fileName.toString().indexOf("png"),istupian(file.fileName))
                if (istupian(file.fileName)) {
                    disp = '';
                }
                var temp = `<div class="files-span col-xs-12 col-sm-6 ">
                                ${file.fileName}<i title="下载" data-id="${file.id}" class="down-file glyphicon glyphicon-arrow-down"></i>
                                &nbsp;<i title="删除" data-id="${file.id}" class="delete-file glyphicon glyphicon-trash"></i>
                                &nbsp;<i title="预览图片" style="display: ${disp};" class="view-img glyphicon glyphicon-search"></i>
                                <img style="width: 100%;display: none;" src="${FILE_API_URL}/tools/file/download/${file.id}" />
                            </div>`;
                html.push(temp)
            }
            $filesDiv.html(html.join(""))

            bondingLoadFilesEvent(id, businessId, isview)
        }

        /**
         * 判断 o 是否 是图片后缀
         */
        function istupian(o) {
            var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
            if (o){
                var spstr = o.toString().split(".");
                return strFilter.indexOf(spstr[spstr.length-1].toLowerCase())>-1
            }
            return false;
        }
        /**
         * 绑定文件下载，删除事件
         */
        function bondingLoadFilesEvent(id, businessId, isview) {
            $(id + " .view-img").on("click", function () {
                $(this).parent(".files-span").find("img").slideToggle(200)
            })
            $(id + " .down-file").on("click", function () {
                var file_id = $(this).data("id")
                /*公共文件下载链接*/
                var url = FILE_API_URL + '/tools/file/download/' + file_id
                window.open(url)
            })

            $(id + " .delete-file").on("click", function () {
                if (isview) {
                    layer.msg("查看状态，不能删除附件！")
                    return;
                }
                var $this = $(this)
                var file_id = $this.data("id")
                /*公共文件删除链接*/
                var url = FILE_API_URL + '/tools/file/delete/' + file_id;
                $.getJSON(url, {}, function (res) {
                    layer.msg(res.msg)
                    if (res.success) {
                        $this.parent("div").remove();
                        sessionStorage.removeItem("fileListData_" + businessId);
                    }
                })

            })
        }


        /**
         * 获取年份，用于年份选择下拉框
         */
        function showYear() {
            var myDate = new Date();
            var year = myDate.getFullYear(); // 年份
            var startYear = myDate.getFullYear(); //起始年份 这个可以自定义前后多少年。
            var endYear = myDate.getFullYear() - 10; //结束年份
            var obj = document.getElementsByClassName('select_time');
            var o;
            for (o = 0; o < obj.length; o++) {
                for (var i = startYear; i >= endYear; i--) {
                    if (obj[o].options != null) {
                        obj[o].options.add(new Option(i));
                    }
                }
                //  设置选中当前月
                $(obj[o]).find("option").each(function() {
                    if ($(this).val() === year) {
                        $(this).attr("selected", true)
                    }
                });
            }
        }

        /**
         * 行编辑控件
         * @param type  input|date|textare|select
         * @param field 字段
         * @param id 数据主键
         * @param value 值
         * @param options select值
         * @param mark 标识作用
         * @param align input文字 text-align   默认 left
         * @returns {string} html
         */
        var fitTableEditCell = function (type,field,id,value,options,mark,align) {
            var value = value||"";
            var align = align||"left";
            switch (type) {
                case "input":
                    var input_html =`
                      <div style="display: inline-flex;width: inherit;">
                        <input data-mark="${mark}" name="${field}" value="${value}" data-id="${id}" class="cell-edit form-control" title="双击可编辑：${value}" style="cursor: pointer;text-align:${align};display:inline;background-color: white;border: 0px;" disabled="disabled"/>
                    </div>`;
                    return input_html;
                case "date":
                    var date_html =`
                        <div class="input-group date">
                            <input data-mark="${mark}" name="${field}" type="text" data-id="${id}" value="${value}" style="cursor: auto;display:inline;background-color: white;border: 0px;"
                                   class="cell-edit form-control pull-right datepicker"
                                   title="选择时间" disabled="disabled" > 
                        </div>
                        `;
                    return date_html;
                case "textare":
                    var textare_html =`
                        <textarea data-mark="${mark}" name="${field}" data-id="${id}" class="cell-edit form-control" title="双击编辑" style="cursor: auto;display:inline;background-color: white;border: 0px;" disabled="disabled">${value}</textarea>
                        `;
                    return textare_html;
                case "select":
                    var html =[`<div style="display: none"><select data-mark="${mark}" name="${field}" data-id="${id}" class="cell-edit cell-edit-se form-control" style="cursor: auto;display:inline;background-color: white;border: 0px;" disabled="disabled">`];
                    html.push(`<option value="">请选择</option>`)
                    var selected = '请选择';
                    for (var o of options){
                        if (o.value==value){
                            html.push(`<option value="${o.value}" selected="selected">${o.text}</option>`)
                            selected = o.text;
                        } else {
                            html.push(`<option value="${o.value}">${o.text}</option>`)
                        }
                    }
                    html.push(`</select></div>`)
                    html.push(`<div style="cursor: pointer;width: 100%;border: 0px;text-align:${align};" class="input form-control" title="双击编辑">${selected}</div>`)
                    html.push(`<script>
                        $(".input").off("dblclick").on("dblclick",function() {
                            $(this).prev("div").show()
                            $(this).hide()
                            $(".cell-edit-se").off("blur").on("blur",function() {
                                $(this).parent("div").next(".input").show()
                                $(this).parent("div").hide()
                            })
                        })
                        
                        
                        </script>`)
                    return html.join("");
                default:
                    return "";
            }
        }
        return {
            toPage: toPage,
            toDivPage: toDivPage,
            toDialog: toDialog,
            getPList: getPList,
            handleModal: handleModal,
            //initMenu: initMenu,
            API_URL: API_URL,
            FILE_API_URL: FILE_API_URL,
            getUUID: getUUID,
            //getSpData: getSpData,
            getLoginName: getLoginName,
            getEwindUser:getEwindUser,
            verificationJudge: verificationJudge,
            verificationfklx: verificationfklx,
            showYear:showYear,
            //startAct: startAct,
            //findFc: findFc,
            //completeAct,
            getDictValue: getDictValue,
            getDictCbs: getDictCbs,
            getDicts: getDicts,
            getTreeName: getTreeName,
            treeData: treeData,
            treeDataSchedule: treeDataSchedule,
            loadSelect: loadSelect,
            loadTree: loadTree,
            loadCheckboxTree: loadCheckboxTree,
            getMenuList: getMenuList,
            initFileInput: initFileInput,
            setValueToInput: setValueToInput,
            template: template,
            getTemplateString: getTemplateString,
            //_: _,
            //getSpCode: getSpCode,
            //getSeq: getSeq,
            //processTemplate: processTemplate,
            //gxzljyUtils: gxzljyUtils,
            outputExcel: outputExcel,
            datedifference: datedifference,
            getSysDict: getSysDict,
            getSysDictByLabel: getSysDictByLabel,
            setNavData: setNavData,
            handleNavData: handleNavData,
            chooseDeptTree: chooseDeptTree,
            loadFilesHtml: loadFilesHtml,
            choosePersonTable: choosePersonTable,
            fitTableEditCell: fitTableEditCell
            //toDialogProcessUser
        }
    });
