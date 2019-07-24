define([
  'jquery',
  'underscore',
  'backbone',
  'echarts',
  'modules/map/components/general/model',
  'text!modules/map/components/general/templ.html'
], function ($, _, Backbone, echarts, Model, templ) {
  'use strict';
  return Backbone.View.extend({
    el: '#projectDetail',
    template: _.template(templ),
    initialize: function (userdata) {
      //var self = this;
      //监听地图事件
      Backbone.on('update:map', this.listenMapUpdate, this);
      Backbone.on('load:project', this.renderProject, this);
      this.userdata = userdata;
      if (!userdata.flag) { //自治区administrator
        this.initData();
      }
    },
    //dom监听事件
    events: {
      'click .button-group li': 'handle',
      'mouseover #projectChart': 'mouseHoverChart',
      'mouseout #projectChart': 'mouseOutChart'
    },
    render: function () {
      var data = this.model.get('data');
      //cityFlag 取单个项目数据标记false
      data.cityFlag = this.model.get('cityFlag');
      if (data.cityFlag) {
        data.complete = data.project['完工'];
        data.stopBuild = data.project['停工'];
        data.building = data.project['在建'];
        data.builded = data.project['竣工'];
        data.beBuild = data.project['待建'];
        data.total = data.project['total'];
      } else {
        data.planInverst = data['计划投资'];
        data.planDate = data['计划工期'];
        data.deveUnit = data['建设单位'];
        data.people = data['项目法人'];
      }

      this.$el.html(this.template({
        data: data
      }));
      //显示非项目信息时初始化chart
      if (data.cityFlag)
        this.projectChart = echarts.init(document.getElementById('projectChart'));
      return this;
    },
    initData: function (userdata) {
      var self = this;
      var urlApi = API_URL + '/project_info/projectMap';
      var deptId = '';
      if (userdata && userdata.onOff) { //取下级县数据
        //urlApi = 'modules/map/data/dataCity.json';
        deptId = userdata.deptId;
      }
      this.model = new Model(urlApi);
      this.options = this.model.get('options');
      this.model.on('sync', this.render, this);
      this.model.fetch({
        data: {
          deptId: deptId
        }
      }).done(function (res) {
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        _.each(res.data.area, function (item) {
          item.rate = Math.floor((item.amount / res.data.project.total) * 10000 / 100);
          item.value = item.rate;
        });
        self.model.set({
          data: res.data
        });
        self.renderChart('area');
      });
    },
    handle: function (e) {
      var self = this;
      var $ele = $(e.currentTarget);
      var type = $ele.find('button').data('type');
      $ele.find('button').prop('disabled', true);
      $ele.find('button').parent().siblings().find('button').prop('disabled', false);
      self.renderChart(type);
    },
    renderChart: function (type) {
      var data = this.model.get('data');
      //横坐标
      //纵轴
      var xdata = [];
      var ydata = [];
      _.each(data[type], function (item) {
        if (type == 'area' && item.amount !== 0) {
          xdata.push(item.name);
          ydata.push(item.amount);
        } else if (type == 'type' && item.value !== 0) {
          xdata.push(item.name);
          ydata.push(item.value);
        }

      });
      this.options.xAxis.data = xdata;
      this.options.xAxis.name = type == 'area' ? '地区' : '类型';

      this.options.series[0].data = ydata;
      this.projectChart.clear();
      this.projectChart.setOption(this.options);
      this.projectChart.off('click');
    },
    listenMapUpdate: function (data) {
      /**
       * flag = true点击进全区地图,false进入子地图
       */
      if (data.flag) {
        this.userdata.onOff = data.flag;
        this.userdata.deptId = data.deptId;
        this.initData(this.userdata);
      } else {
        this.initData();
      }
      return;
    },
    renderProject: function (data) {
      //取项目数据
      this.model.set({
        cityFlag: false
      });
      this.model.urlApi = API_URL + '/project_info/projectInfo';
      this.model.urlRoot();
      this.model.fetch({
        data: {
          id: data.id
        }
      }).done(function (res) {
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        //console.log(res);
      })
    },
    mouseHoverChart: function () {
      var type = $('.inner-project .button-group li button:disabled').data('type');
      //if (type == 'type') return !1;
      var params = {};
      var data = this.model.get('data');
      params.collections = data;
      params.typeid = 'general';
      console.log(params);
      Backbone.trigger('chart:hover', params);
    },
    mouseOutChart: function () {
      var params = {};
      var data = this.model.get('data');
      params.collections = data;
      params.typeid = 'general';
      params.unbind = true;
      Backbone.trigger('map:unbind', params);
    }
  })
});