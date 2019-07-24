define([
  'jquery',
  'underscore',
  'backbone',
  'echarts'
], function ($, _, Backbone, echarts) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      cityFlag: true, //取得单个项目数据标记=false,
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (item) {
            var marker0 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#005193;"></span>';
            var marker1 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#007a55;"></span>';
            var marker2 = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:#fff;"></span>';
            //console.log(item);
            var rate = (item[1].value / item[0].value) * 100;
            rate > 100 ? rate = 100 : rate;
            var $html = '<p style="margin:0;">' + item[0].name + '</p>' +
              '<div style="padding:4px 0;">' + marker0 + item[0].seriesName + '：' + item[0].value + '万元</div>' +
              '<div style="padding:4px 0;">' + marker1 + item[1].seriesName + '：' + item[1].value + '万元</div>' +
              '<div style="padding:4px 0;">' + marker2 + '完成率：' + Math.round(rate) + '%</div>';
            return $html;
          }
        },
        legend: {
          data: ['总投资', '已完成'],
          align: 'right',
          right: 10,
          textStyle: {
            color: "#fff"
          },
          selectedMode: false,
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 35
        },
        grid: {
          left: '6%',
          right: '10%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          //data: data[type].list,
          //name: type == 'area' ? '地区' : '类型',
          data: [],
          name: '',
          nameTextStyle: {
            color: '#00c7ff',
            fontSize: 14
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#00c7ff",
              width: 1,
              type: "solid"
            }
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            show: true,
            textStyle: {
              color: "#fff",
              fontSize: 14,
            },
            rotate: 35
          },
        }],
        yAxis: [{
          type: 'value',
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              fontSize: 13
            }
          },
          name: '万元',
          axisTick: {
            show: false,
          },
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
          name: '总投资',
          type: 'bar',
          //data: data[type].plan,
          stack: 'demo',
          data: [],
          barWidth: 20, //柱子宽度
          barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#008cff'
              }, {
                offset: 1,
                color: '#005193'
              }]),
              opacity: 1,
              label: {
                show: false,
                position: 'top',
                textStyle: {
                  color: '#FFF'
                }
              }
            }
          }
        }, {
          name: '已完成',
          type: 'bar',
          //data: data[type].done,
          stack: 'demo',
          data: [],
          barWidth: 10,
          barGap: 1,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#00da9c'
              }, {
                offset: 1,
                color: '#007a55'
              }]),
              opacity: 1,
              label: {
                show: false,
                position: 'top',
                textStyle: {
                  color: '#FFF'
                }
              }
            }
          }
        }]
      },
    },
    initialize: function (url) {
      this.urlApi = url;
    },
    urlRoot: function () {
      return this.urlApi;
    }
  })
});