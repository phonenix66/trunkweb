define([
  'jquery',
  'underscore',
  'backbone',
  'echarts',
  'text!modules/map/components/warning/templ.html',
  'modules/map/components/warning/model'
], function ($, _, Backbone, echarts, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#warning',
    template: _.template(tmpl),
    initialize: function (userdata) {
      Backbone.on('update:map', this.listenMapUpdate, this);
      Backbone.on('load:project', this.loadProject, this);
      this.userdata = userdata;
      if (!userdata.flag) { //监管单位自治区
        this.initData();
      }
    },
    render: function () {
      this.$el.html(this.template());
      this.warningChart = echarts.init(document.getElementById('warningChart'));
      this.warningChart.on('click', function (params) {
        Backbone.trigger('to:menu', params.data);
      })
      return this;
    },
    events: {

    },
    initData: function (userdata) {
      var self = this;
      var urlApi = 'modules/map/data/datas.json';
      if (userdata && userdata.onOff) {
        urlApi = 'modules/map/data/dataCity.json';
      }
      this.model = new Model(urlApi);
      this.model.on('sync', this.render, this);

      this.model.fetch({
        data: {
          id: 'warning'
        }
      }).done(function () {
        self.renderChart('office');
      })
    },
    renderChart: function (type) {
      var data = this.model.get('warning')[type];
      var officeOption = this.model.get('options');
      officeOption.title.subtext = data.total + '';
      officeOption.legend.data = data.datas;
      officeOption.series[0].data = data.datas;
      this.warningChart.setOption(officeOption);
    },
    listenMapUpdate: function (data) {
      var self = this;
      if (data.flag) {
        /* this.model.urlApi = 'modules/map/data/dataCity.json';
        this.model.urlRoot();
        this.model.fetch({
          data: {
            id: 'warning',
            flag: true
          }
        }).done(function () {
          self.renderChart('office');
        }) */
        this.userdata.onOff = data.flag;
        this.initData(this.userdata);
      } else {
        this.initData();
      }
    },
    loadProject: function () {
      var self = this;
      this.model.set({
        cityFlag: false
      });
      this.model.urlApi = 'modules/map/data/detail.json';
      this.model.urlRoot();
      this.model.fetch({
        data: {
          id: 'warning',
          cityFlag: false
        }
      }).done(function (res) {
        self.renderChart('office');
      })
    }
  })
});