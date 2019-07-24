define([
  'jquery',
  'underscore',
  'backbone',
  'echarts'
], function ($, _, Backbone, echarts) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      cityFlag: true, //取得单个项目数据标记
      options: {
        tooltip: {},
        grid: {
          top: '6%',
          right: '10%'
        },
        legend: {
          show: false,
          data: ['工程数'],
          right: '10%',
          top: '7%',
          textStyle: {
            color: '#fff',
            fontSize: 16,
          }
        },
        xAxis: {
          //data: data[type], //横坐标
          data: [],
          axisTick: {
            show: false,
          },
          //name: type == 'area' ? '地区' : '类型',
          name: '',
          nameTextStyle: {
            color: '#00c7ff',
            fontSize: 14
          },
          axisLabel: {
            interval: 0,
            rotate: 35,
            textStyle: {
              color: '#fff',
              fontSize: 14,
            }
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#00c7ff',
              width: '1',

            }
          },
        },
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          },
          name: '工程数',
          axisTick: {
            show: false,
          },
          minInterval: 1,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#00c7ff",
              width: 1,
              type: "solid"
            },
          },
          splitLine: {
            lineStyle: {
              color: "#063374",
            }
          }
        }],
        series: [{
          name: '工程数',
          type: 'bar',
          barWidth: 20,
          //data: type == 'area' ? data['quantitySheet'] : data['typeValue'], //数据
          data: [],
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1, [{
                    offset: 0,
                    color: '#06B5D7'
                  }, //柱图渐变色
                  {
                    offset: 0.5,
                    color: '#44C0C1'
                  }, //柱图渐变色
                  {
                    offset: 1,
                    color: '#71C8B1'
                  }, //柱图渐变色
                ]
              )
            },
            emphasis: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1, [{
                    offset: 0,
                    color: '#71C8B1'
                  }, //柱图高亮渐变色
                  {
                    offset: 0.7,
                    color: '#44C0C1'
                  }, //柱图高亮渐变色
                  {
                    offset: 1,
                    color: '#06B5D7'
                  } //柱图高亮渐变色
                ]
              )
            }
          },
        }]
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