define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      options: {
        color: ['#A0CE3A', '#31C5C0', '#1E9BD1', '#00FF7F', '#585247', '#7F6AAD', '#009D85', "rgba(250,250,250,0.3)"],
        title: {
          text: '总数',
          //subtext: data.total,
          subtext: '',
          textStyle: {
            color: '#f2f2f2',
            fontSize: 16,
            align: 'center'
          },
          subtextStyle: {
            fontSize: 16,
            color: ['#ff9d19'],
            align: 'center'
          },
          left: 'center',
          top: '48%',
        },
        grid: {
          bottom: 150,
          left: 100,
          right: '10%'
        },
        tooltip: {
          show: true
        },
        legend: {
          orient: 'horizontal',
          top: "5%",
          left: "center",
          textStyle: {
            color: '#f2f2f2',
            fontSize: 15,

          },
          icon: 'roundRect',
          //data: data.datas,
          data: []
        },
        series: [
          // 主要展示层的
          {
            radius: ['30%', '61%'],
            center: ['50%', '55%'],
            type: 'pie',
            label: {
              normal: {
                show: true,
                formatter: "{b}\n{c}(个)",
                textStyle: {
                  fontSize: 16,

                },
                position: 'outside'
              },
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 30,
                length2: 55
              },
              emphasis: {
                show: true
              }
            },
            name: "总量",
            data: []
            //data: data.datas
          },
          // 边框的设置
          {
            radius: ['30%', '34%'],
            center: ['50%', '55%'],
            type: 'pie',
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            animation: false,
            tooltip: {
              show: false
            },
            data: [{
              value: 1,
              itemStyle: {
                color: "rgba(250,250,250,0.3)",
              },
            }],
          }, {
            name: '外边框',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '55%'],
            radius: ['65%', '65%'],
            label: {
              normal: {
                show: false
              }
            },
            data: [{
              value: 9,
              name: '',
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: '#0b5263'
                }
              }
            }]
          },
        ]
      }
    },
    initialize: function (url) {
      this.urlApi = url;
    },
    urlRoot: function () {
      return this.urlApi;
    }
  })
});