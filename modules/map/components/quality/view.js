define([
  'jquery',
  'underscore',
  'backbone',
  'echarts',
  'text!modules/map/components/quality/templ.html',
  'modules/map/components/quality/model'
], function ($, _, Backbone, echarts, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#quality',
    template: _.template(tmpl),
    initialize: function (userdata) {
      Backbone.on('update:map', this.listenMapUpdate, this);
      Backbone.on('load:project', this.loadProject, this);
      this.userdata = userdata;
      if (!userdata.flag) { //监管单位自治区
        this.initData();
      }
    },
    events: {
      'mousemove #pieYS,#pieYL,#pieMG': 'mouseHoverChart',
      'mouseout #pieYS,#pieYL,#pieMG': 'mouseOutChart'
    },
    render: function () {
      var quality = this.model.get('data');
      this.$el.html(this.template({
        defect: quality.defectsNum,
        serious: quality.incidentNum
      }));
      return this;
    },
    initData: function (userdata) {
      var self = this;
      var urlApi = API_URL + '/qa/qaComAcceptance/qaMap?deptId=';
      if (userdata && userdata.onOff) {
        //console.log(userdata);
        urlApi = API_URL + '/qa/qaComAcceptance/qaMap?deptId=' + userdata.deptId;
      }
      this.model = new Model(urlApi);
      this.model.on('sync', this.render, this);

      this.model.fetch().done(function (res) {
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        self.renderChartYS();
        self.renderChartMG();
        self.renderChartYL();
      })
    },
    initOpts: function (type) {
      //重构数据
      var cityFlag = this.model.get('cityFlag');
      var data = null;
      var names = null;
      if (cityFlag) {
        data = this.resolverData(type);
        names = _.map(data.list, function (item) {
          return item.name;
        });
      } else {
        var result = this.model.get('data');
        data = result[type];
        data.list = data.value;
        names = _.map(data.value, function (item) {
          return item.name;
        })
      }
      return {
        title: {
          text: data.name,
          left: 'left',
          top: '5',
          textStyle: {
            color: "#fff",
            fontSize: "16"
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a}{b} : {c} ({d}%)",
        },
        legend: {
          orient: 'vertical',
          left: 'center',
          bottom: '0%',
          data: names,
          formatter: function (name) {
            var num = 0;
            _.each(data.list, function (item) {
              if (item.name == name) {
                num = item.value;
              }
            })
            return name + " " + num + "个";
          },
          textStyle: {
            color: '#fff',
            fontSize: 14
          }
        },
        series: [{
          name: '',
          type: 'pie',
          radius: '60%',
          center: ['50%', '44%'],
          color: ['#3a91d2', '#86c9f4', '#4da8ec', '#005fa6'],
          data: data.list,
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'inside',
                formatter: '{b} \n{d}%',
                textStyle: {
                  color: '#FFF8DC',
                  fontSize: 14.5
                }
              }
            },
          },
        }, ]
      }
    },
    renderChartYS: function () {
      this.chartYS = echarts.init(document.getElementById('pieYS'));
      var opts = this.initOpts('list')
      this.chartYS.setOption(opts);
    },
    renderChartMG: function () {
      this.chartHG = echarts.init(document.getElementById('pieMG'));
      var opts = this.initOpts('mglList');
      this.chartHG.setOption(opts);
    },
    renderChartYL: function () {
      this.chartYL = echarts.init(document.getElementById('pieYL'));
      var opts = this.initOpts('yllList');
      this.chartYL.setOption(opts);
      /* var data = this.model.get('quality');
      this.chartYL.on('mousemove', function (params) {
        params.collections = data;
        params.typeid = 'quality';
        params.childType = 'yll';
        Backbone.trigger('chart:hover', params);
      }); */

    },
    listenMapUpdate: function (data) {
      var self = this;
      if (data.flag) {
        //this.userdata = data;
        //console.log(data);
        this.userdata.onOff = data.flag;
        this.initData(this.userdata);
      } else {
        this.initData();
      }
    },
    loadProject: function (data) {
      var self = this;
      this.model.set({
        cityFlag: false
      });
      this.model.urlApi = API_URL + '/qa/qaComAcceptance/qaProjectMap';
      this.model.urlRoot();
      this.model.fetch({
        data: {
          pjId: data.id
        }
      }).done(function (res) {
        //console.log(res);
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        self.renderChartYS();
        self.renderChartMG();
        self.renderChartYL();
      })
    },
    mouseHoverChart: function (evt) {
      var cityFlag = this.model.get('cityFlag');
      if (!cityFlag) return !1;
      var $el = $(evt.currentTarget);
      var type = $el.data('type');
      var data = this.model.get('data');
      var params = {
        collections: data,
        typeid: 'quality',
        childType: type
      }
      Backbone.trigger('chart:hover', params);
    },
    mouseOutChart: function (evt) {
      var $el = $(evt.currentTarget);
      var type = $el.data('type');
      var data = this.model.get('quality');
      var params = {
        collections: data,
        typeid: 'quality',
        unbind: true,
        childType: type
      };
      Backbone.trigger('map:unbind', params);
    },
    resolverData: function (type) {
      var data = this.model.get('data');
      var obj = {};
      if (type == 'list') {
        obj.list = data['list'];
        obj.name = '竣工验收率';
      } else if (type == 'mglList') {
        obj.list = data['mglList'];
        obj.name = '主要单位工程优良率';
      } else if (type == 'yllList') {
        obj.list = data['yllList'];
        obj.name = '竣工验收优良率';
      }
      data[type] = obj;
      this.model.set({
        data: data
      })
      return obj;
    }
  })
});