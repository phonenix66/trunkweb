define([
  'jquery', 'underscore', 'backbone',
  'components/nav/data/district'
], function ($, _, Backbone, district) {
  'use strict';
  return Backbone.Model.extend({
    /* urlRoot: function () {
      return this.urlApi;
    }, */
    /**
     * flag
     * 市区水利局管理用户role=9
     * 市区水利局其他用户role=7
     * 
     * true 普通法人(role=0)县级法人role=8
     * false 监管单位为自治区administrator(role=6)管理员role=6
     * 不能查看全自治区role=2
     */
    initialize: function () {
      var self = this;
      //this.urlApi = url;
      this.setCitys();
      this.setInitStorage();

      this.bind("change:city", function () {
        //监管单位水利厅，管理局code为0
        var city = this.get('city');
        this.set({
          county: null,
          selectProject: null
        });
        this.setCountys(city);
        this.setProjects();
        this.updateStorage();
      });
      this.bind("change:county", function () {
        self.set({
          selectProject: null
        });
        var county = this.get('county');
        if (county) {
          self.setProjects();
        }
        self.updateStorage();
      });
      this.bind("change:selectProject", function () {
        this.updateStorage();
      })
    },
    defaults: {
      lists: [], //所有项目列表
      userinfo: JSON.parse(sessionStorage.getItem('userinfo')),
      citys: [], //所有区市
      city: null, //被选中区或市
      countys: [], //根据所选区市得到所有县级
      county: null, //选中的县级
      selectProject: null //所选项目
    },
    setCitys: function () { //设置一级监管市局
      var userinfo = this.get('userinfo');
      var cityList = this.get('userinfo').cityList;
      var citys = _.map(cityList, function (a, k) {
        var obj = {
          key: k,
          code: a.code,
          name: a.name,
          id: a.id,
          cells: a.cells,
          projects: a.projects
        }
        return obj;
      });
      var city = {};
      var county = {};
      var project = {};
      for (var i = 0; i < cityList.length; i++) {
        var a = cityList[i];
        if (a.cells.length !== 0) {
          for (let j = 0; j < a.cells.length; j++) {
            var b = a.cells[j];
            if (b.projects) {
              city.name = a.name;
              city.code = a.code;
              city.id = a.id;
              county.name = b.name;
              county.code = b.code;
              county.id = b.id;
              project.id = b.projects[0].id;
              project.name = b.projects[0].pjName;
              break;
            }
          }
        } else if (a.cells.length == 0) {
          city.name = a.name;
          city.code = a.code;
          city.id = a.id;
          county = null;
          project.id = a.projects[0].id;
          project.name = a.projects[0].name;
          break;
        }
      }
      //city,county,project 用于nav联动
      _.extend(userinfo, {
        city: _.isEqual(city, {}) ? null : city,
        county: _.isEqual(county, {}) ? null : county,
        project: _.isEqual(project, {}) ? null : project
      })
      sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
      this.set({
        userinfo: userinfo,
        citys: citys
      })
    },
    setCountys: function (city) { //设置二级县监管list
      //根据市填充县级数据
      //监管单位水利厅，管理局code为0
      var cityList = this.get('userinfo').cityList;
      if (!city) {
        return !1;
      };
      var countysCell = _.find(cityList, function (a) {
        return a.id == city.id;
      });
      //console.log(countysCell);
      var countys = _.map(countysCell.cells, function (a, k) {
        return {
          key: k,
          code: a.code,
          name: a.name,
          id: a.id,
          projects: a.projects || []
        }
      });
      this.set({
        countys: countys
      })
    },
    setProjects: function () { //设置项目列表
      var city = this.get('city');
      var county = this.get('county');
      var cityList = this.get('userinfo').cityList;
      var o = _.find(cityList, function (a) {
        return a.id == city.id;
      });
      var plists = [];
      if (!county && city) {
        plists = o.projects;
      } else if (county && city) {
        var p = _.find(o.cells, function (a) {
          return county.id == a.id;
        });
        plists = p.projects;
      }

      this.set({
        lists: plists
      });
      //console.log(p.projects);
    },
    setInitStorage: function () { //初始化storage
      var userinfo = this.get('userinfo');
      if (userinfo) {
        var data = {
          city: null,
          county: null,
          project: null
        }
        sessionStorage.setItem('selected', JSON.stringify(data));
      } else {
        sessionStorage.setItem('selected', '');
      }
    },
    updateStorage: function () {
      var data = {
        city: this.get('city'),
        county: this.get('county'),
        project: this.get('selectProject')
      }
      sessionStorage.setItem('selected', JSON.stringify(data));
    }
  })
});