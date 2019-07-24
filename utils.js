define("page/utils", ["jquery", "underscore", "router", "layer", "bootstrap-table-zh-CN", "handlebars"], function ($, _) {

  var spCode = "";
  var getSpCode = function () {
    return spCode;
  };

  //重写ajax
  void function () {
    var _ajax = $.ajax;
    $.ajax = function (url, options) {

      options = options || {};
      if (typeof url === "object") {
        options = url;
      } else {
        options.url = url;
      }
      options.error = function (err) {
        if (err && err.readyState && err.readyState == '4') {

          //					var sessionstatus = err.getResponseHeader("session-status");
          //					if(sessionstatus == "timeout") {
          //如果超时就处理 ，指定要跳转的页面
          if (err.status == 401) {
            //						window.location.href = basePath + "/";
            window.location.href = "index.html";
          } else { //csrf异常
            //						var responseBody = err.responseText;
            //						if(responseBody) {
            //							responseBody = "{'retData':" + responseBody;
            //							var resJson = eval('(' + responseBody + ')');
            //							$("#csrftoken").val(resJson.csrf.CSRFToken);
            //							this.success(resJson.retData, 200);
            //						}
            //						return;
          }
        }
      }
      options.crossDomain = true;
      options.headers = options.headers || {};
      options.headers.sessionid = eval("(" + sessionStorage.getItem("userprofile") + ")").sessionid;
      options.headers.AppFrom = "web";
      //var _options =	$.extend(options,{headers: "" );
      return _ajax(options);
    };
  }();

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
	 * 获取序列
	 */
  var getSeq = function () {
    var uuid = "";
    $.ajaxSettings.async = false;
    $.get(`${API_URL}/aqgl/txgl/scyTxgl/getSeq`, function (res) {
      uuid = res
    });
    return uuid;
  };
	/**
	 * 获取风场信息
	 */
  var getSpData = function () {
    var spProject = eval("(" + localStorage.getItem("spProject") + ")");
    return spProject;
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
	 * 获取uuid
	 */
  var getUUID = function () {
    var uuid = "";
    $.ajaxSettings.async = false;
    $.get(`${API_URL}/sys/user/uuid`, function (res) {
      uuid = res.uuid
    });
    return uuid;
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
          }).on("dblclick_node.jstree", function (obj, e) {  //树双击事件
            param.dblclick ? param.dblclick(obj, e) : "";
          })
        } catch (e) { }

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
	 * @param {Object} data			json对象
	 * @param {Object} id			对象的id名称
	 * @param {Object} fid			对象的父级id名称
	 * @param {Object} name 		对象的节点名称
	 * @param {Object} shortName 	排序字段
	 * @param {Object} getIcon 		图标
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
	 * @param {Object} data			json对象
	 * @param {Object} id			对象的id名称
	 * @param {Object} fid			对象的父级id名称
	 * @param {Object} name 		对象的节点名称
	 * @param {Object} shortName 	排序字段
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
  var toDialog = function (parameter) {
    var layerFunction = {
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
        } catch (e) { }
        var data = $(_obj).find('form').serializeObject(); // 返回参数''
        if (parameter.yes) {
          return parameter.yes(_obj, index, data, dwindow.menu.page);
        }
      },
      btn2: parameter.btn2,
      btn3: parameter.btn3
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
    $("#content-header").html(template(getTemplateString("template/tmp_contentheader.html"), {
      menu: menu
    }));
    toPage(menu);
  };

	/**
	 * 当前选中菜单
	 */
  var currentSideMenuSelector = null;

	/**
	 * 左边菜单渲染
	 * @param {Object} json
	 */
  var initSidebar = function (parentName, json) {

    var menuHtml = template(getTemplateString("template/temp_menu2.html"), {
      list: json
    });
    $("#mainsidebar").html(menuHtml);
    $('[data-widget="tree"]').each(function () {
      $(this).tree();
    });
    $("#mainsidebar a.click_menu").on("click", function () {
      //查询是否是首页
      var text = $('.active span').text();
      if ((text.indexOf("首页") == 1) || (text.indexOf("项目概况") == 1)) {
        return;
      }
      var selector = $(this),
        url = selector.attr("href"),
        menu = selector.parent(),
        subview = $(this).parent().parent().parent(),
        fsubview = subview.parent().parent();
      currentSideMenuSelector = selector;
      if (selector.hasClass("menu_blank")) {
        return;
      }
      $("#mainsidebar .active").removeClass("active").removeClass("menu-open");

      menu.addClass("active").addClass("menu-open");
      subview.addClass("active").addClass("menu-open");
      fsubview.addClass("active").addClass("menu-open");
      if (!url) {
        return false;
      }
      toMenuPage({
        parentName: parentName,
        name: selector.text(),
        subname: subview.find(">a").eq(0).text().trim(),
        fsubname: fsubview.find(">a").eq(0).text().trim(),
        href: url
      });
      console.log("访问左侧菜单=>>" + url);
      return false;
    });
    $("#mainsidebar a.click_menu").eq(0).trigger("click");
  };

	/**
	 * 顶部菜单渲染
	 * @param {Object} json
	 */
  var initNavbar = function (json, userprofile) {
    var menuHtml = template(getTemplateString("template/temp_main_menu.html"), {
      list: json,
      profile: userprofile
    });
    var projSelection = $("#selectproject");
    $("#mainnavbar").html(menuHtml);

    $("#mainnavbar").find(">li>a").on("click", function () {

      var selector = $(this),
        url = $(this).attr("href"),
        selectedProject = getSelectedProject(), // 获取当前选定project id
        menuId = selector.attr("menuid"),
        text = $(this)[0].innerText;

      if (selector.hasClass("bind_project")) {
        // 判断是否需要进行项目选择
        if (selectedProject === "请选择风场") {
          // 当前无已选择项目
          showProjectSelection(menuId);
          return false;
        } else {
          projSelection.show();
        }
      } else {
        if (text.indexOf("首页")) {
          projSelection.show();
        } else {
          projSelection.hide();
        }
      }

      // 顶部菜单项样式更新
      $("#mainnavbar").find(">li").removeClass("active");
      selector.parent().addClass("active");

      if (selector.hasClass("menu")) {
        if ($(".user-menu").hasClass('open')) {
          $(".user-menu").removeClass("open");
        } else {
          $(".user-menu").addClass("open");
        }
      } else if (selector.hasClass("menu_pass")) {
        // 进入无左侧菜单内容
        $("#main-aside,#sidebar-toggle,#content-header").hide();
        // $("#sidebar-toggle").show();
        $("#content-wrapper,#main-footer").removeClass("margin_menu");
        toMenuPage({
          name: selector.text(),
          href: url
        });
      } else {
        // 进入含有左侧菜单内容
        $("#main-aside,#sidebar-toggle,#content-header").show();
        $("#content-wrapper,#main-footer").addClass("margin_menu");
        var menu = _.find(json, function (menu) {
          return menu.id === menuId;
        });
        initSidebar(selector.text(), menu.clist);
      }
      //判断选择是否是首页和一张图
      // debugger;
      var boo = (text.indexOf("首页") || text.indexOf("一张图"));
      if ((text.indexOf("首页")) == -1 && (text.indexOf("一张图")) == -1) {
        $("[menuname='一张图']").children("span").text(" 项目概况");
        $("[menuname='一张图']").attr("href", "modules/homepage/homePageXmgk.html");
      } else if (text.indexOf("首页")) {
        //将风场制空，删除缓存
        $("#selectproject").val("请选择风场");
        localStorage.removeItem("spProject");

        $("[menuname='一张图']").children("span").text(" 一张图");
        $("[menuname='一张图']").attr("href", "modules/map/map.html");
      }

      return false;
    });
    //修改密码
    $("#menu_pass").on("click", function () {
      var selector = $(this);
      var url = 'modules/system/password.html';
      $("#main-aside,#sidebar-toggle,#content-header").hide();
      $("#content-wrapper,#main-footer").removeClass("margin_menu");
      toMenuPage({
        name: selector.text(),
        href: url
      });
    });

    //退出
    $('#menu_loginOut').on("click", function () {
      var selector = $(this);
      var timestamp = new Date().getTime();
      //			var url = 'index.html?__hbt=' + timestamp;
      //	
      //			sessionStorage.setItem('userprofile', null);

      //			var resourceUrl = API_URL + "/ewindsys/ewindUser";

      //			$.ajax({
      //				type: "get",
      //				url: `${resourceUrl}/logout`,
      //
      //				async: false,
      ////				crossDomain: true,
      //				success: function(response) {
      //					debugger
      //					window.location.href = "index.html";
      //				},
      //
      //			});

      sessionStorage.clear();
      window.location.href = "index.html";

    });

    $("#mainnavbar").find(">li>a").eq(0).trigger("click");
    projSelection.click(function () {
      showProjectSelection(null);
    });
  };

  function showProjectSelection(menuId) {
    layer.open({
      title: '请选择风电场',
      type: 2,
      skin: 'layui-layer-rim',
      shade: 0.8,
      area: ['90%', '90%'],
      content: 'selectproject.html',
      success: function () {

        $("iframe").contents().find(".rowDiv").on("click", ".selectproject", function () {
          // debugger;
          var altStr = $(this).attr("data");
          var altStrSplit = altStr.split("-");
          $("#selectproject").val(altStrSplit[0]);
          spCode = altStrSplit[1];
          localStorage.setItem("spProject", JSON.stringify({
            spName: altStrSplit[0],
            spCode: altStrSplit[1]
          }));
          $("#selectproject").show();
          layer.closeAll();
          if (menuId) {
            $("#mainnavbar").find(">li>a[menuid=" + menuId + "]").eq(0).trigger("click");
          } else {
            currentSideMenuSelector && currentSideMenuSelector.trigger("click");
          }

          //如果是首页，则修改一张图为项目概算，调整项目概况页面
          var text = $('.active span').text();
          if (text.indexOf("首页") == 1) {
            $("[menuname='一张图']").children("span").text(" 项目概况");
            $("[menuname='一张图']").attr("href", "modules/homepage/homePageXmgk.html");
            $("#mainnavbar").find(">li>a[menuid=" + "001" + "]").eq(0).trigger("click");
          }
        });
      },
      btn: ['关闭']
    });
  }
  var initMenu = function (param) {
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

    // $.getJSON("template/data/menuList" + role + ".json", function (json) {
    // 	initNavbar(json, userprofile);
    // });

    $(window).on('resize', function () {
      fixContentHeight();
    });
  };

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
						<a href = "${FILE_API_URL}/tools/affix/download/${_this.id}">${_this.saName}</a>
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
						<a href = "${FILE_API_URL}/tools/affix/download/${_this.id}">${_this.saName}</a>
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
						<a href = "${FILE_API_URL}/tools/affix/download/${_this.id}">${_this.saName}</a>
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
						<a href = "${FILE_API_URL}/tools/affix/download/${_this.id}">${_this.saName}</a>
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
      $.get(`${FILE_API_URL}/tools/affix/delete/${id}`, function (result) {
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
	 * @param {Object} fid		业务id(当前业务id)
	 * @param {Object} moduleCode 附件所属模块
	 * 
	 */
  var initFileInput = function (ctrlName, fid, moduleCode) {

    var control = $('#' + ctrlName);

    var footerTemplate = '<div class="file-thumbnail-footer" style ="height:94px">\n' +
      '   <input class="caption-input form-control input-sm form-control-sm text-center" value="{caption}" placeholder="请输入标题">\n' +
      '   <div class="small" style="margin:15px 0 2px 0">{size}</div> {progress}\n{indicator}\n{actions}\n' +
      '</div>';

    control.fileinput({
      language: 'zh', //设置语言  
      uploadUrl: `${FILE_API_URL}/tools/affix/upload`, //上传的地址
      layoutTemplates: {
        footer: footerTemplate
      },
      allowedFileExtensions: ['dwg', 'jpg', 'gif', 'png', 'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'], //接收的文件后缀
      maxFilesNum: 5, //上传最大的文件数量  
      uploadExtraData: {
        "moduleCode": moduleCode,
        "fid": fid
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
  var getDictValue = function (dictTypeId, name) {
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
      for (var i = 0; i < dicts.length; i++) {
        var html = '<option value="' + dicts[i].id + '">' + dicts[i].label + '</option>';
        $('select[name="' + name + '"]').append(html);
      }
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

  var processTemplate = function (param) {
    $('form').hideFrom();
    $.ajax({
      type: "post",
      url: `${API_URL}/act/task/findActityXml`,
      data: {
        key: param.processKey,
        businessId: param.businessId
      },
      async: true,
    }).then(function (data) {
      param.showFlag = param.showFlag == undefined ? true : param.showFlag;
      var dataObj = {
        opinionList: data,
        loginname: getLoginName(),
        showFlag: param.showFlag
      };
      $.ajaxSettings.async = false;
      var html = "";
      $.get("template/process_template.html", function (res) {
        html = res;
      });
      var myTemplate = Handlebars.compile(html);
      Handlebars.registerHelper("transformat", function (loginname, state) {
        if (loginname == dataObj.loginname && state && dataObj.showFlag) {
          return "name=comment  ";
        } else {
          return "disabled";
        }
      });

      //隐藏附件 删除按钮
      $('.box-body').find('.fileDel').hide();

      $('.box-body').append(myTemplate(dataObj));

      dataObj.opinionList && dataObj.opinionList.length > 0 ? $('#spTitleName').html('当前处理人：' + (dataObj.opinionList[0].username ? dataObj.opinionList[0].username : " ")) : $("#spyj").hide();
      if (param.procInstId) {
        $('#spPho img').attr('src', `${API_URL}/act/task/viewPicZ/${param.procInstId}`)
        $('#myModal img').attr('src', `${API_URL}/act/task/viewPicZ/${param.procInstId}`)
        $('#spPho img').on('click', function () {
          var fatherBody = $(window.top.document.body);
          $(fatherBody).find('#myModal').remove();
          $(fatherBody).append($('#myModal').prop('outerHTML'));
          fatherBody.find('#myModal').modal("show");
        })
      }
      $('#spPho img').on("error", function () {
        $('#spPho').hide();
      });
      param.callback ? param.callback() : "";
      $('#example_process').bootstrapTable({
        url: `${API_URL}/act/task/toDetails`,
        toolbar: '', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        pageSize: 10,
        pageNumber: 1,
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        sortable: false, //是否启用排序
        queryParams: function () {
          return {
            businessId: param.businessId
          };
        },
        sortOrder: "asc", //排序方式
        uniqueId: "id",
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
        responseHandler: function (res) {
          return res;
        },
        columns: [{
          field: "taskName",
          title: "节点名称"
        },
        {
          field: "assignee",
          title: "审批人"
        }, {
          field: "endDate",
          title: "审批时间"
        }, {
          field: "comment",
          title: "审批意见"
        }
        ]
      });

    }, function () {
      console.log("请求错误");
    });

  }


	/**
	 * 选择流程用户
	 */
  function toDialogProcessUser(data, callback) {
    var userList = {};
    $.ajax({
      type: "post",
      url: API_URL + "/act/task/startObtain",
      data: data,
      async: false,
      dataType: "json",
      success: function (res) {
        userList = res;
      }
    });
    if (userList.ewindUsers) {
      toDialog({
        name: "选择审批人",
        url: "template/process_people.html",
        area: ['30%', '50%'],
        param: userList,
        btn: ['确定', '关闭'],
        yes: function (obj, index, _data) {
          callback(obj, index, _data);
        }
      });
    } else {
      callback();
    }
  }


	/**
	 * 查询流程的上一个用户
	 * @param {Object} id
	 */
  function findSuperiorTask(businessId, procInsId) {
    var user;
    var data = { businessId: businessId, procInsId: procInsId };
    $.ajax({
      type: "post",
      url: API_URL + "/act/task/findSuperiorTask",
      data: data,
      async: false,
      dataType: "json",
      success: function (res) {
        user = res;
      }
    });
    return user;
  }

  function checkProcess(id) {
    var data;
    $.ajax({
      type: "post",
      url: API_URL + "/tzgl/htjs/findActByJsgl",
      data: {
        ihId: id
      },
      async: false,
      dataType: "json",
      success: function (res) {
        data = res;
      }
    });
    return data;
  }
	/**
	 * 启动流程事件
	 */
  void
    function () {
      $('body').on('click', '.btn-startAct', function () {
        //获得风电场
        var spProject = getSpData();
        var dataObj = eval('(' + $(this).attr("data") + ')');
        //获取用户
        var userObtain = {
          lcdyKey: dataObj.processObj.procDefKey,
          spCode: spProject.spCode,
          condition: dataObj.processObj.condition || null
        };
        //验证是否有其他结算审批流程未完成
        $type = $(this).data('type');
        var resData = checkProcess(dataObj.ihId);
        if (!resData.act && $type === 'jsgl') {
          layer.msg('此合同有结算阶段' + resData.assigneeName + '正在处理', {
            time: 2000
          });
          return;
        }
        toDialogProcessUser(userObtain, function (obj, index, data) {
          dataObj = dataObj.processObj;
          dataObj.startActCallback = eval('(' + dataObj.startActCallback + ')');
          startAct({
            id: dataObj.id,
            loginName: data.loginName
          }, dataObj.procDefKey, dataObj.table, dataObj.condition, dataObj.startActCallback);

          var jqueryEventId = dataObj.jqueryEventId;
          if (jqueryEventId) {
            $("body #" + jqueryEventId).remove();
            $("body").append(`<div style="display: none;" id="${jqueryEventId}" data-jsid="${dataObj.id}"></div>`);
            $("body #" + jqueryEventId).trigger('click');
          }
        })

      });
    }();
	/**
	 * 启动流程
	 * @param {Object} dictTypeId
	 * @param {Object} name
	 */
  var startAct = function (row, procDefKey, table, condition, callback) {

    //获得风电场
    var spProject = getSpData();
    var fdcId = spProject.spCode;
    //		var row = $(this).attr("data");
    //		row = eval("(" + row + ")");
    var data = {
      "procDefKey": procDefKey,
      "table": table,
      "businessId": row.id,
      "fdcId": fdcId,
      "loginName": row.loginName,
      "condition": condition || null
    }
    $.ajax({
      type: "post",
      url: API_URL + "/act/task/start",
      data: data,
      async: false,
      dataType: "json",
      success: callback
    });
    layer.closeAll();
  }

	/**
	 * 处理流程事件
	 */
  void
    function () {
      $("body").on("click", ".btn-completeAct", function () {
        var dataObj = eval('(' + $(this).attr("data") + ')');
        completeAct(dataObj);
      });
    }();

  var completeAct = function (param) {
    //获得风电场
    var spProject = getSpData();
    var dataObj = param;
    param = dataObj.processObj;
    if (param.adoptCallback) {
      param.adoptCallback = eval('(' + param.adoptCallback + ')'); //通过事件
    }
    if (param.refuseCallback) {
      param.refuseCallback = eval('(' + param.refuseCallback + ')'); //拒绝事件
    }

    toDialog({
      type: 2,
      name: param.title || "",
      area: ['80%', '90%'],
      url: param.url,
      //			btn: ['通过', '拒绝','驳回','关闭'],
      btn: ['通过', '拒绝', '关闭'],
      param: dataObj,
      yes: function (obj, index, data) {
        //获取用户
        var userObtain = {
          lcdyKey: param.procDefKey,
          spCode: spProject != null ? spProject.spCode : param.spCode,
          procInsId: param.procInsId,
          condition: param.condition || null
        };
        //如果有跟新操作
        if (param.ajaxUrl) {
          data.id = param.id;
          $.ajax({
            type: "post",
            url: param.ajaxUrl,
            data: data,
            dataType: "json",
            success: function (data) {

            }
          });
        }
        //弹出窗
        toDialogProcessUser(userObtain, function (_obj, _index, _data) {
          var thisData = {
            "procInsId": param.procInsId,
            "beanName": param.beanName || null,
            "flag": 1,
            "businessId": param.id,
            "table": param.table,
            "condition": param.condition || 0,
            "comment": data.comment
          }
          if (_data) { //是否还有下级审批
            thisData.assignee = _data.loginName
          }
          $.ajax({
            type: "post",
            url: API_URL + "/act/task/complete",
            data: thisData,
            dataType: "json",
            success: param.adoptCallback || function (data) {
              layer.closeAll();
            }
          });
        });
      },
      btn2: function (index, obj) {
        layer.confirm("确定要拒绝？", {
          title: '拒绝'
        }, function (index) {

          var _obj = $(obj).find('iframe').contents().find('body');
          try {
            //如果有校验处理就执行，没有就处理异常保证逻辑正常
            var dwindow = $(obj).find('iframe')[0].contentWindow;
            dwindow.$(_obj).find('form').data('bootstrapValidator').validate();
            var flag = dwindow.$(_obj).find('form').data('bootstrapValidator').isValid();
            if (!flag) {
              return false;
            }
          } catch (e) { }
          var datas = $(_obj).find('form').serializeObject(); // 返回参数''	
          var data = {
            "procInsId": param.procInsId,
            "flag": 0,
            "beanName": param.beanName || null,
            "comment": datas.comment,
            "businessId": param.id,
            "table": param.table
          }
          //如果有跟新操作
          if (param.ajaxUrl) {
            datas.id = param.id
            $.ajax({
              type: "post",
              url: param.ajaxUrl,
              data: datas,
              dataType: "json",
              success: function (data) {

              }
            });
          }
          $.ajax({
            type: "post",
            url: API_URL + "/act/task/complete",
            data: data,
            dataType: "json",
            success: param.refuseCallback
          });
          layer.closeAll();
          return true;

        })
        return false;
      }
      //			,
      //			btn3: function (index, obj) {
      //				layer.confirm("确定要驳回？", {
      //					title: '驳回'
      //				}, function (index) {
      //				
      //				var _obj = $(obj).find('iframe').contents().find('body');
      //				var data = $(_obj).find('form').serializeObject(); // 返回参数''	
      //				//查询上一个处理人
      //              var userMap = findSuperiorTask(param.id,param.procInsId);
      //               if(userMap.upper == 'false'){
      //                  	layer.msg('没有上一级,需要撤回请选择拒绝按钮');
      //                  	return false;
      //                  }else{
      //                  	var thisData = {
      //							"procInsId": param.procInsId,
      //							"beanName": param.beanName || null,
      //							"flag": 2,
      //							"businessId": param.id,
      //							"table": param.table,
      //							"condition": param.condition || 0,
      //							"assignee":userMap.assignee,
      //							"comment": data.comment
      //					    }
      //                  	$.ajax({
      //							type: "post",
      //							url: API_URL + "/act/task/complete",
      //							data: thisData,
      //							dataType: "json",
      //							success: param.adoptCallback || function (data) {
      //								layer.closeAll();
      //							}
      //						});
      //                  }
      //                  
      //              layer.closeAll();
      //				return true;
      //				
      //				})	
      //				return false;
      //                  
      //			}

    });

  }


	/**
	 * 退回流程事件
	 */
  void
    function () {
      $("body").on("click", ".zdy-btn-return", function () {
        var dataObj = eval('(' + $(this).attr("data") + ')');
        //退回流程
        layer.confirm("确定要退回该流程？", {
          title: '退回'
        }, function (index) {
          returnAct(dataObj);
          layer.closeAll();
        })

      });
    }();


  var returnAct = function (param) {

    param.processObj.callback = eval('(' + param.processObj.callback + ')');
    var data = {
      "table": param.processObj.table,
      "businessId": param.id,
      "procInsId": param.procInsId,
    }
    $.ajax({
      type: "post",
      url: API_URL + "/act/task/returnAct",
      data: data,
      async: false,
      dataType: "json",
      success: param.processObj.callback || function (data) {
        layer.closeAll();
      }
    });
  }


  var findFc = function (spCode) {
    var da = null;
    $.ajax({
      url: API_URL + '/ztwhfc/sysProject/findProjec/' + spCode,
      type: 'post',
      async: false,
      dataType: "json",
      contentType: "application/json",
      success: function (data) {
        da = data;
      },
      error: function (returndata) {
        layer.msg('操作失败');
      }
    });
    return da;
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
    form.attr("method", "post");//设置请求方式
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
    form.submit();//表单提交即可下载！
    form.remove();
  }

  var getSysDict = function (dictTypeId) {
    var data = {
    };
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
    var data = {
    };
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




  var gxzljyUtils = {
		/**
		 * 节点结构数据，供弹出窗页面使用
		 */
    getScData(scId) {
      var scData = {};
      $.ajax({
        type: "post",
        url: `${API_URL}/jgwhwbs/sysConstr/getNodeList`,
        data: {
          id: scId
        },
        async: false,
        success: function (data) {
          data.forEach(function (_obj, _index) {
            switch (_obj.scType) {
              case "1": //单位工程
                scData.dwgcName = _obj.scName;
                break;
              case "2": //分部工程
                scData.fbgcName = _obj.scName;
                break;
              case "3": //子分部工程
                scData.zfbgcName = _obj.scName;
                break;
              case "4": //分项工程
                scData.fxgcName = _obj.scName;
                break;
              case "5": //子单位工程
                scData.zdwgcName = _obj.scName;
                break;
              case "6": //检验批
                scData.jypName = _obj.scName;
                break;
            }
          })
        }
      });
      return scData;
    },

		/**
		 * 获取当前节点和下级节点
		 */
    getScNode(scId) {
      var arr = new Array();
      $.ajax({
        type: "get",
        url: `${API_URL}/jgwhwbs/sysConstr/data`,
        data: {
          pageSize: -1,
          scFid: scId
        },
        async: false,
        success: function (data) {
          arr = data.rows;
        }
      });
      return arr;
    },
		/**
		 * 页面变换 需要的参数
		 * @param {Object} scType	wbs类型
		 * return： url后端服务地址，popupUrl弹窗地址
		 */
    gxzljyData(scType) {
      switch (scType) {
        case "1":
          return {
            name: "单位工程",
            popupUrl: "modules/zlgl/gczljy/gxzljy_dwgc_add.html",
            url: `${API_URL}/gxzljy/dwgc/qaGxzljyDwgc`,
            procDefKey: "gxzljy_dwgc_zdwgc",
            table: "QA_GXZLJY_DWGC"
          };
        case "2":
          return {
            name: "分部工程",
            popupUrl: "modules/zlgl/gczljy/gxzljy_fbgc_add.html",
            url: `${API_URL}/gxzljy/fbgc/qaGxzljyFbgc`,
            procDefKey: "gxzljy_fbgc_zfbgc",
            table: "QA_GXZLJY_FBGC"
          };
        case "3":
          return {
            name: "子分部工程",
            popupUrl: "modules/zlgl/gczljy/gxzljy_fbgc_add.html",
            url: `${API_URL}/gxzljy/fbgc/qaGxzljyFbgc`,
            procDefKey: "gxzljy_fbgc_zfbgc",
            table: "QA_GXZLJY_FBGC"
          };
        case "4":
          return {
            name: "分项工程",
            popupUrl: "modules/zlgl/gczljy/gxzljy_fxgc_add.html",
            url: `${API_URL}/gxzljy/fxgc/qaGxzljyFxgc`,
            procDefKey: "gxzljy_fxgc_jyp",
            table: "QA_GXZLJY_FXGC"
          };
        case "5":
          return {
            name: "子单位工程",
            popupUrl: "modules/zlgl/gczljy/gxzljy_dwgc_add.html",
            url: `${API_URL}/gxzljy/dwgc/qaGxzljyDwgc`,
            procDefKey: "gxzljy_dwgc_zdwgc",
            table: "QA_GXZLJY_DWGC"
          };
        case "6":
          return {
            name: "检验批",
            popupUrl: "modules/zlgl/gczljy/gxzljy_jyp_add.html",
            url: `${API_URL}/gxzljy/jyp/qaGxzljyJyp`,
            procDefKey: "gxzljy_fxgc_jyp",
            table: "QA_GXZLJY_JYP"
          };
      }
    }



  }





  return {
    toPage: toPage,
    toDivPage: toDivPage,
    toDialog: toDialog,
    getPList: getPList,
    initMenu: initMenu,
    API_URL: API_URL,
    FILE_API_URL: FILE_API_URL,
    getUUID: getUUID,
    getSpData: getSpData,
    getLoginName: getLoginName,
    verificationJudge: verificationJudge,
    verificationfklx: verificationfklx,
    startAct: startAct,
    findFc: findFc,
    completeAct,
    completeAct,
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
    _: _,
    getSpCode: getSpCode,
    getSeq: getSeq,
    processTemplate: processTemplate,
    gxzljyUtils: gxzljyUtils,
    outputExcel: outputExcel,
    datedifference: datedifference,
    getSysDict: getSysDict,
    getSysDictByLabel: getSysDictByLabel,
    toDialogProcessUser
  }
});