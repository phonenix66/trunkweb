define(['jquery', 'underscore', 'backbone',
  'text!components/nav/tmpl.html',
  'text!components/nav/selectTmp/city.html',
  'text!components/nav/selectTmp/county.html',
  'text!components/nav/selectTmp/project.html',
  'components/nav/model'
], function ($, _, Backbone, tmpl, cityTmpl, countyTmpl, projectTmpl, Model) {

  return Backbone.View.extend({
    el: '#projectNav',
    template: _.template(tmpl),
    events: {
      'click .head-nav': 'openSelector',
      'click .select-wrap li': 'selectItem',
      'input .search-input input': 'searchProject',
      //'focus .search-input input': 'searchProject'
    },
    initialize: function () {
      //西藏自治区
      /**
       * flag
       * 市区水利局管理用户role=9
       * 市区水利局其他用户role=7
       * 
       * true 其他法人(role=0)县级法人role=8
       * false 监管单位为自治区administrator(role=6)管理员role=6
       * 不能查看全自治区role=2
       */
      var self = this;
      //var urlApi = './components/nav/data/project.json';
      this.model = new Model();
      this.userinfo = this.model.get('userinfo');
      this.citys = this.model.get('citys');
      this.countys = this.model.get('countys');
      this.projectList = this.model.get('lists');

      this.render();
      $('.head-nav.county').hide();
      //导航nav监听
      Backbone.on('set:nav', this.setNavData, this);
      Backbone.on('handle:nav', this.handleNavData, this);
      //role=9,role=7市级主管单位
      if (this.userinfo.role == 9 || this.userinfo.role == 7) {
        $('#selectCity li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.city.id == item.id) {
            $(this).trigger('click', true);
          }
        });
      }
      //role=8县级主管单位
      if (this.userinfo.role == 8) {
        $('#selectCity li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.city.id == item.id) {
            $(this).trigger('click', true);
          }
        });
        $('.head-nav.city').hide();
        $('.head-nav.county').trigger('click');
        $('#selectCounty li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.county && self.userinfo.county.id == item.id) {
            $(this).trigger('click', true);
          }
        });
      }
      //role=0其他法人
      if (this.userinfo.role == 0) {
        $('#selectCity li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.city.id == item.id) {
            $(this).trigger('click', true);
          }
        });
        $('.head-nav.county').trigger('click');
        $('#selectCounty li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.county && self.userinfo.county.id == item.id) {
            $(this).trigger('click', true);
          }
        });
        $('.head-nav.city').hide();
        $('.head-nav.county').hide();
      }

      //点击空白区关闭层
      $(document).click(function (e) {
        var _con = $('.head-nav');
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
          _con.removeClass('open');
        }
      })
    },
    render: function () {
      $(this.$el).empty();
      $(this.$el).html(this.template({
        userinfo: this.userinfo,
        citys: this.citys,
        countys: this.countys,
        projects: this.projectList
      }));
      return this;
    },
    //显示下拉列表
    openSelector: function (event) {
      var ele = event.currentTarget;
      var index = $(ele).index();
      var city = this.model.get('city');
      var county = this.model.get('county');
      var childmenuNum = $('.header-wrapper li.child.active').index();
      if (index === 0) {
        var selectedCity = JSON.parse(sessionStorage.getItem('selected')).city;
        var citys = JSON.parse(sessionStorage.getItem('userinfo')).cityList;
        var $html = _.template(cityTmpl)({
          citys: citys,
          selectedCity: selectedCity,
          role: this.userinfo.role
        });
        $('#selectCity').html($html);
        if (this.userinfo.role == 9 || this.userinfo.role == 7) {
          $('#selectCity li').eq(0).hide();
        }
      }
      if (index !== 0 && !city && this.userinfo.role != 8 && this.userinfo.role != 0) {
        layer.msg('请先选择上级主管单位');
        return;
      }
      if (index === 1) {
        var selected = JSON.parse(sessionStorage.getItem('selected'));
        var selectedCity = selected.city;
        var selectedCounty = selected.county;
        this.model.setCountys(selectedCity);
        var clists = this.model.get('countys');
        var $html = _.template(countyTmpl)({
          countys: clists,
          selectedCounty: selectedCounty,
          role: this.userinfo.role
        })
        $('#selectCounty').html($html);
        if (this.userinfo.role == 8) {
          $('#selectCounty li').eq(0).hide();
        }
      }

      if (index === 2) {
        //设置模型projects
        this.model.setProjects();
        var plists = this.model.get('lists');
        var selected = this.model.get('selectProject');
        var $html = _.template(projectTmpl)({
          projects: plists,
          selectedProject: selected || null
        })
        $('#selectProject').html($html);
        //根据输入框内的值查询一次
        this.searchProject();
      }
      if ($(ele).hasClass('open')) {
        if ($(ele).find('.search').length) {
          return !1;
        }
        $(ele).removeClass('open');
      } else {
        $(ele).addClass('open').siblings().removeClass('open');
      }

      if (childmenuNum !== 0) {
        $('#selectCity li').eq(0).hide();
        //$('#selectCounty li').eq(0).hide();
        $('#selectProject li').eq(0).hide();
      }
    },
    //选择下拉列表option
    selectItem: function (event, flag) {
      /** 
       * 选取监管单位
       * 市级
       * 县级
       */
      var ele = event.currentTarget;
      var childmenuNum = $('.header-wrapper li.child.active').index();
      event.stopImmediatePropagation();
      $(ele).addClass('active').siblings().removeClass('active');
      $(ele).parents('.head-nav').removeClass('open');
      /** 
       * type = 1,2,3
       */
      var type = $(ele).parents('.select-wrap').data('type');
      var data = $(ele).data('item');
      var flagChange = false;
      if (type == 1) { //选区市,监管单位
        $('#county').text('全机构');
        $('#lt-project').text('全部项目');
        var city = this.model.get('city');
        flagChange = _.isEqual(city, data);
        if (flagChange) {
          this.model.set({
            county: null,
            selectProject: null
          })
        };
        console.log('---------', data);
        //如果选择的是主管单位code=0隐藏二级主管县
        this.setDeptProjects(data);
        this.model.set({
          city: data,
          county: null
        });
        $('.head-nav.county').show();
        if (!data) {
          $('#cityText').text('全区域机构');
          $('.head-nav.county').hide();
        } else if (data.cells.length === 0) {
          $('.head-nav.county').hide();
        }
        //this.renderCounty(event, data);
      } else if (type == 2) { //选县区
        //this.renderProject(event, data);
        this.model.set({
          county: data
        });
        if (!data) {
          $('#county').text('全机构');
        }
        $('#lt-project').text('全部项目');
        if (childmenuNum !== 0) {
          $('.head-nav.project').trigger('click');
          $('#selectProject li').eq(1).trigger('click');
        }
      } else if (type == 3) { //选项目
        this.setProject(data);
        if (!data) {
          $('#lt-project').text('全部项目');
        }
      }
      data && $(ele).parents().find('span.name-' + type).text(data.name || data.pjName);
      //更新page
      if (flag) return !1;
      this.updatePage();
    },
    setProject: function (data) {
      this.model.set({
        selectProject: data
      });
      if (!data) {
        this.model.set({
          selectProject: null
        });
        $('#lt-project').text('全部项目');
      }
    },
    updatePage: function () { //更新重绘page
      var self = this;
      var url = $('#contentTop').find('li.active a').attr('href');
      var moduleName = url.substring(0, url.lastIndexOf("."));
      var menu = {
        parentName: '',
        name: '',
        href: url
      }
      $.get(url, function (data) {
        var html = [];
        html.push(data);
        var timestap = new Date().valueOf();
        html.push('<script src="' + moduleName + '.js?time=' + timestap + '" type="text/javascript" charset="utf-8"></script>');
        $("#content").html(html.join(""));
        self.handleModule(moduleName, menu);
      })
    },
    handleModule: function (moduleName, menu) {
      require([moduleName], function (mpage) {
        if (mpage && mpage.init) {
          mpage.init(menu);
        }
      });
    },
    setNavData: function (type) {
      var city = this.model.get('city');
      var county = this.model.get('county');
      var project = this.model.get('selectProject');
      //console.log(city, county, project);
      switch (type) {
        case 1:
          this.setNavDataFirstHide(city, county, project);
          break;
        case 2:
          this.setNavDataFirstShow();
          break;
        default:
          break;
      }
    },
    setNavDataFirstHide: function (city, county, project) {
      var self = this;
      if (!city) {
        $('#selectCity li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.city.id == item.id) {
            $(this).trigger('click', true);
          }
        });
        $('.head-nav.county').trigger('click');
        $('#selectCounty li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.county && self.userinfo.county.id == item.id) {
            $(this).trigger('click', true);
          }
        });
        $('.head-nav.project').trigger('click');
        $('#selectProject li').each(function () {
          var item = $(this).data('item');
          if (self.userinfo.project.id == item.id) {
            $(this).trigger('click');
          }
        });
      }
      if (city && !county && !project) {
        if (city.cells.length !== 0) {
          $('.head-nav.county').trigger('click');
          $('#selectCounty li').eq(0).trigger('click');
        }
        $('.head-nav.project').trigger('click');
        $('#selectProject li').eq(1).trigger('click');
      }
      if (city && county && !project) {
        $('.head-nav.project').trigger('click');
        $('#selectProject li').eq(1).trigger('click');
      }
      //隐藏item=“全部”
      $('#selectCity li').eq(0).hide();
      $('#selectCounty li').eq(0).hide();
      $('#selectProject li').eq(0).hide();
    },
    setNavDataFirstShow: function () { //显示全部
      $('#selectCity li').eq(0).show();
      $('#selectProject li').eq(0).show();
      $('#selectCounty li').eq(0).show();
    },
    handleNavData: function () {
      /**
       * 重新请求监管单位数据
       * 更新缓存metadata，userinfo
       */
      this.updateStorage();
    },
    updateStorage: function () {
      var self = this;
      $.api.common.getDistUserInfo.exec({}, function (res) {
        sessionStorage.setItem('metadata', JSON.stringify(res.data));
        //过滤没有项目的数据
        sessionStorage.removeItem('userinfo');
        var cityList = self.filterData(res.data);
        res.data.cityList = cityList;
        var userinfo = JSON.stringify(res.data);
        sessionStorage.setItem('userinfo', userinfo);
        self.model.set({
          userinfo: JSON.parse(userinfo)
        });
        self.updateSelected(cityList);
      });
      //sessionStorage.setItem('userinfo', JSON.stringify(this.userinfo));
    },
    setDeptProjects: function (data) {
      //console.log(data);
      if (data.code == 0) {
        $('.head-nav.county').hide();
      } else {
        $('.head-nav.county').show();
      }
    },
    filterData: function (data) {
      /** 
       * 1 过滤掉主管单位
       * 2 遍历市，refilter 返回有project的县
       * 3 过滤项目的市县
       */
      _.each(data.cityList, function (a) {
        //主管单位没有code,设置为0
        if (!a.code) {
          a.code = 0;
        }
      });
      var list = _.chain(data.cityList).filter(function (a) {
        return a.cells || a.projects;
      }).each(function (a) {
        var refilter = _.filter(a.cells, function (b) {
          return b.projects;
        })
        a.cells = refilter;
      }).filter(function (a) {
        return a.projects;
      }).value();

      //console.log(list);
      return list;
    },
    searchProject: function () {
      var $input = $('.search');
      var queryStr = $.trim($input.val());
      if (queryStr == '') {
        $('.select-project li').show();
      } else {
        $('.select-project li').not(':first').each(function () {
          $(this).hide();
          var name = $(this).data('name');
          var id = $(this).data('id');
          if (id.indexOf(queryStr) != -1 || name.indexOf(queryStr) != -1) {
            $(this).show();
          }
        })
      }
    },
    updateSelected: function (lists) {
      var selected = JSON.parse(sessionStorage.getItem('selected'));
      var city = selected.city;
      var county = selected.county;
      var project = selected.project;
      if (!project) return !1;
      var selectCity = null;
      var selectCounty = null;
      var selectProject = null;
      selectCity = _.find(lists, function (item) {
        return item.id == city.id;
      });
      if (!county) {
        selectProject = _.find(selectCity.projects, function (item) {
          return item.id == project.id;
        })
      } else {
        selectCounty = _.find(selectCity.cells, function (item) {
          return item.id == county.id;
        })
        selectProject = _.find(selectCounty.projects, function (item) {
          return item.id == project.id;
        })
      }
      selected.project = selectProject;
      sessionStorage.removeItem('selected');
      sessionStorage.setItem('selected', JSON.stringify(selected));
    }
  });
});