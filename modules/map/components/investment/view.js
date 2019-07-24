define([
  'jquery',
  'underscore',
  'backbone',
  'echarts',
  'modules/map/components/investment/model',
  'text!modules/map/components/investment/templ.html'
], function ($, _, Backbone, echarts, Model, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#investment',
    template: _.template(tmpl),
    initialize: function (userdata) {
      var self = this;
      //监听地图事件
      Backbone.on('update:map', this.listenMapUpdate, this);
      Backbone.on('load:project', this.loadProject, this);
      this.userdata = userdata;
      if (!userdata.flag) { //监管单位自治区
        this.initData();
      }
    },
    render: function () {
      var data = this.model.toJSON();
      //取得单个项目数据标记=false
      data.cityFlag = this.model.get('cityFlag');
      this.$el.html(this.template({
        data: data
      }));
      return this;
    },
    events: {
      'click .button-group li': 'handle',
      'mouseover #investmentChart': 'mouseHoverChart',
      'mouseout #investmentChart': 'mouseOutChart'
    },
    initData: function (userdata) {
      var self = this;
      var urlApi = API_URL + '/schedule/scheduleManagement/selectAllCity?isLocation=true';
      if (userdata && userdata.onOff) {
        urlApi = API_URL + '/schedule/scheduleManagement/selectCountryByCity?deptId=' + userdata.deptId + '&isLocation=true&hasSelf=true';
      }
      this.model = new Model(urlApi);
      this.model.on('sync', this.render, this);

      this.model.fetch().done(function (res) {
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        userdata && self.handleProjectList(res);
        self.renderPieChart();
        self.renderBarChart('area');
      })
    },
    //处理进入子地图项目数据
    handleProjectList: function (result) {
      sessionStorage.removeItem('selectCityProjects');
      var data = [];
      _.each(result.area, function (item) {
        _.each(item.proMap.project, function (a) {
          a.name = a.project;
        })
        //proMap县级监管单位项目project
        var obj = {
          id: item.id,
          name: item.name,
          list: item.proMap
        };
        data.push(obj);
      });
      Backbone.trigger('update:project', data);
      sessionStorage.setItem("selectCityProjects", JSON.stringify(data));
    },
    handle: function (e) {
      var $ele = $(e.currentTarget);
      var $ele = $(e.currentTarget);
      var type = $ele.find('button').data('type');
      $ele.find('button').prop('disabled', true);
      $ele.find('button').parent().siblings().find('button').prop('disabled', false);
      this.renderBarChart(type);
    },
    renderPieChart: function () {
      var data = this.model.toJSON();
      this.investPieChart = echarts.init(document.getElementById('investPieChart'));
      var investPieOption = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c}万元 ({d}%)",
          textStyle: {
            fontSize: 14
          }
        },
        color: ['#7FFFAA', '#bda29a'],
        legend: {
          show: false,
          orient: 'horizontal',
          left: 'center',
          data: ['已完成', '未完成'],
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: '计划数',
          type: 'pie',
          radius: '60%',
          center: ['50%', '52%'],
          data: [{
            value: data.complete < data.total ? data.complete : 100,
            name: '已完成'
          }, {
            value: data.complete < data.total ? data.total - data.complete : 0,
            name: '未完成'
          }],
          label: {
            normal: {
              formatter: '{b}\n{d}%',
              show: true,
              position: 'outside',
              textStyle: {
                fontSize: 14,
              }
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      this.investPieChart.setOption(investPieOption);
    },
    renderBarChart: function (type) {
      this.investBarChart = echarts.init(document.getElementById('investmentChart'));
      var data = this.model.toJSON();
      //console.log(data);
      if (data.cityFlag) {
        //非项目信息
        data.area = _.filter(data.area, function (item) {
          return item.code || item.sdCode;
        })
      }
      this.investmentBarOption = this.model.get('options');
      /** 
       * 横轴 xdata
       * 纵轴 计划金额 ypdata
       * 纵轴 完成金额 yddata
       */
      var xdata = [],
        ypdata = [],
        yddata = [];

      _.each(data[type], function (item) {
        if (type == 'area' && (item.done || item.plan)) {
          xdata.push(item.name || item.stime);
          ypdata.push(item.plan);
          yddata.push(item.done);
        } else if (type == 'type' && (item.done || item.plan)) {
          xdata.push(item.name);
          ypdata.push(item.plan);
          yddata.push(item.done);
        }
      });
      //console.log(xdata);
      this.investmentBarOption.xAxis[0].data = xdata;
      //纵轴
      this.investmentBarOption.xAxis[0].name = type == 'area' ? '地区' : '类型';
      var cityFlag = this.model.get('cityFlag');
      if (!cityFlag) {
        //单个项目信息横轴
        this.investmentBarOption.xAxis[0].name = '年/月';
      }
      /* //计划金额
      var ypdata = _.map(data[type], function (item) {
        return item.plan !== 0 ? item.plan.toFixed(2) : 0;
      })
      //完成金额
      var yddata = _.map(data[type], function (item) {
        return item.done !== 0 ? item.done.toFixed(2) : 0;
      }); */
      this.investmentBarOption.series[0].data = ypdata;
      this.investmentBarOption.series[1].data = yddata;
      this.investBarChart.setOption(this.investmentBarOption);
      //完成比例
      _.each(data.area, function (item) {
        item.rate = parseInt(Number((item.done / item.plan).toFixed(2)) * 100);
        item.value = item.rate;
      })
    },
    //地图click事件监听
    listenMapUpdate: function (data) {
      var self = this;
      if (data.flag) {
        this.userdata = data;
        this.userdata.onOff = data.flag;
        /* this.userdata.onOff = data.flag;
        this.userdata.sdCode = data.sdCode; */
        this.initData(this.userdata);
      } else {
        this.initData();
      }
    },
    loadProject: function (data) {
      var self = this;
      //取项目信息cityFlag = false
      this.model.set({
        cityFlag: false
      });
      this.model.urlApi = API_URL + '/schedule/scheduleManagement/selectByRateName';
      this.model.urlRoot();
      this.model.fetch({
        data: {
          id: data.id
        }
      }).done(function (res) {
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        //var keyarrs = _.keys(res);
        if (!res.flag) {
          self.model.set({
            total: 0,
            complete: 0,
            rate: 0,
            area: [],
            name: data.project
          });
          self.$el.html(self.template({
            data: self.model.toJSON()
          }));
          return;
        }
        self.renderPieChart();
        self.renderBarChart('area');
      })
    },
    mouseHoverChart: function () {
      var cityFlag = this.model.get('cityFlag');
      if (!cityFlag) return !1;
      /* var type = $('.inner-invest .button-group li button:disabled').data('type');
      if (type == 'type') return !1; */
      var params = {};
      var data = this.model.toJSON();
      data.area = _.filter(data.area, function (item) {
        return item.code || item.sdCode;
      });
      _.each(data.area, function (item) {
        if (item.done !== 0 && item.plan !== 0) {
          item.rate = Math.floor((item.done / item.plan) * 100)
        }
        item.value = item.rate;
      })
      //console.log(data);
      params.collections = data;
      params.typeid = 'investment';
      Backbone.trigger('chart:hover', params);
    },
    mouseOutChart: function () {
      var params = {};
      var data = this.model.toJSON();
      params.collections = data;
      params.typeid = 'investment';
      params.unbind = true;
      Backbone.trigger('map:unbind', params);
    }
  })
});