define([
  'jquery',
  'underscore',
  'backbone',
  'echarts',
  'modules/map/components/center/model',
  'text!modules/map/components/center/templ.html',
  'modules/map/data/citymap',
  'modules/map/data/map/area'
], function($, _, Backbone, echarts, Model, templ, cityMap, areaJSONCoord) {
  'use strict';
  return Backbone.View.extend({
    el: '.m-map',
    template: _.template(templ),
    initialize: function(data) {
      var self = this;
      /**
       * chart:hover 鼠标悬浮在charts监听
       * deletePopo 取消绑定markpoint 鼠标移除charts
       * setTipProjects 更新model项目plists列表数据
       */
      //Backbone.on('rerender:map', this.rerenderMap, this);
      Backbone.on('chart:hover', this.chartHoverMapChange, this);
      //Backbone.on('map:unbind', this.deletePopo, this);
      Backbone.on('update:project', this.setTipProjects, this);
      //var urlApi = 'modules/map/data/map/xizang.json';
      //var urlApi = 'modules/map/data/datas.json';
      var urlApi = API_URL + '/project_info/projectMap';
      this.model = new Model(urlApi);
      this.model.set({
        type: 'general'
      })
      this.render();
      this.option = this.model.get('option');
      this.userinfo = this.model.get('userinfo');
      //this.model.on('sync', this.render, this);
      if (this.userinfo.flag) {
        this.renderChildMap(this.userinfo);
      } else {
        this.initData();
      }
    },
    events: {
      'click .tips-wrap li': 'loadProject',
      'click .back-wrap': 'getBack'
    },
    initData: function() {
      var self = this;
      $.getJSON('modules/map/data/map/xizang.json', function(data) {
        echarts.registerMap('xizang', data);
        this.mapdata = data;
        self.model.fetch({
          data: {
            deptId: ''
          }
        }).done(function(res) {
          //成功，触发listen:fetch
          Backbone.trigger('listen:fetch', true);
          self.appendLonLat(res['data']['area']);
          self.dprovince = self.appendLonLat(res['data']['area']);
          _.each(self.dprovince, function(item) {
            item.rate = Math.floor((item.amount / res.data.project.total) * 10000 / 100);
            item.value = item.rate;
          })
          self.renderMap('xizang', self.dprovince, 'general');
        })
      })
    },
    render: function() {
      var self = this;
      this.$el.html(this.template());
      this.mapChart = echarts.init(document.getElementById('mapContainer'));

      this.mapChart.on('click', function(params) {
        //点击进入地图子一级role=2????
        if (self.userinfo.flag) {
          params.role = self.userinfo.role;
          params.name = self.userinfo.name;
          params = self.userinfo;
        }
        console.log(params);
        self.renderChildMap(params);
      })
      return this;
    },
    //render下级map
    renderChildMap: function(params) {
      var self = this;
      if (params.seriesName == 'xizang' || params.role == 9 || params.role == 7) {
        /* 市区水利局管理用户role=9
         * 市区水利局其他用户role=7
         * 加载区和市
         * 点击返回按钮使用childOptions*/
        //console.log(params);
        this.childOptions = params;
        var promiseObj = new Promise(function(resolve, reject) {
          var areaCode = params.role == 9 ? params.code : cityMap[params.name];
          $.getJSON('modules/map/data/map/city/' + areaCode + '.json', function(data) {
            echarts.registerMap(params.name, data);
            var d = [];
            for (var i = 0; i < data.features.length; i++) {
              d.push({
                name: data.features[i].properties.name
              })
            }
            resolve(d);
          });
        });
        promiseObj.then(function(d) {
          //重置model urlRoot请求接口
          /* self.model.urlApi = 'modules/map/data/dataCity.json';
          self.model.urlRoot(); */
          //进入子级地图
          self.model.set({
            selectMapData: {
              flag: false,
              mapName: params.name
            },
            type: 'children'
          });
          self.model.fetch({
            data: {
              deptId: params.id || params.data.id
            }
          }).done(function(results) {
            //成功，触发listen:fetch
            Backbone.trigger('listen:fetch', true);
            //项目概况
            self.model.set({
              plists: []
            });
            //results.data.area = self.appendLonLat(results['data']['area']);
            //console.log(results.data.area);
            _.each(results.data.area, function(item) {
              item.rate = Math.floor((item.amount / results.data.project.total) * 10000 / 100);
              item.value = item.rate;
            });
            _.each(results.projectList, function(a) {
              _.each(results.data.area, function(b) {
                if (a.name == b.name) {
                  b.list = a.list;
                }
              })
            })
            self.renderMap(params.name, results.data.area, 'general');
            if (params.componentSubType == 'map' || params.role == 9 || params.role == 7) {
              Backbone.trigger('update:map', {
                deptId: params.id || params.data.id || params.data.countryId,
                flag: true,
                sdCode: params.code || params.data.sdCode
              });
            };
          });
        })
      } else {
        //地图返回上一级
        self.model.set({
          selectMapData: {
            flag: true,
            deptId: '',
            mapName: 'xizang',
            sdCode: ''
          },
          type: 'general'
        });
        //成功，触发listen:fetch
        Backbone.trigger('listen:fetch', true);
        self.renderMap('xizang', self.dprovince, 'general');
        if (params.componentSubType == 'map') {
          Backbone.trigger('update:map', {
            id: 2,
            flag: false
          });
        };
        $('.back-wrap').hide();
      }
    },
    //渲染地图
    renderMap: function(map, data, type) {
      var mapdata = _.isArray(data) ? data : data.list[0].rows;
      _.each(mapdata, function(item) {
        if (_.isNaN(item.rate)) {
          item.rate = 0;
          item.value = 0;
        };
      });
      var subname = '';
      if (map == 'xizang') {
        subname = '西藏';
      }
      this.option.title.text = subname || map;
      var subtext = '';
      switch (type) {
        case 'general':
          subtext = '项目概况';
          break;
        case 'investment':
          subtext = '工程进度';
          break;
        case 'quality':
          subtext = data.name;
          break;
        case 'children':
          subtext = '';
          break;
        default:
          subtext = '';
          break;
      }
      this.option.title.subtext = subtext;
      this.option.series = [{
        name: map,
        type: 'map',
        mapType: map,
        roam: false,
        map: map,
        nameMap: {
          'xizang': '西藏'
        },
        label: {
          normal: {
            show: true,
            color: '#fff',
            fontSize: 16
          },
          emphasis: {
            show: true,
            color: '#fff',
            fontSize: 16
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#1f2445',
            borderColor: '#2d7af4',
            shadowColor: '#2d7af4',
          },
          emphasis: {
            areaColor: '#27437a'
          }
        },
        data: mapdata
      }];

      if (type) {
        //数据增加经纬度
        var coorddata = this.appendLonLat(mapdata);
        var colors = ['#008B8B'];
        this.option.series[0].markPoint = {
          symbol: 'pin',
          symbolSize: 90,
          silent: true,
          effect: {
            show: true,
            shadowBlur: 0
          },
          label: {
            normal: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold',
              formatter: function(item) {
                return (item.value > 100 ? 100 : item.value) + '%';
              },
              color: '#FFFFFF'
            }
          },
          itemStyle: {
            normal: {
              color: colors[Math.floor(Math.random() * colors.length)],
              label: {
                show: false
              },
            },
            emphasis: {
              borderColor: '#1e90ff',
              borderWidth: 5,
              label: {
                show: false
              }
            }
          },
          data: coorddata
        }
      }

      this.mapChart.clear();
      this.mapChart.setOption(this.option, true);
    },
    //加载单个项目
    loadProject: function(e) {
      var $ele = $(e.currentTarget);
      var data = $ele.data('item');
      $('.back-wrap').show();
      Backbone.trigger('load:project', data);
    },
    //重新渲染map
    rerenderMap: function(params) {
      var selectMapData = this.model.get('selectMapData');
      var mapName = '';
      if (selectMapData.flag) {
        mapName = 'xizang';
      } else {
        mapName = selectMapData.mapName;
      }
      if (params.typeid == 'general') {
        this.renderMap(mapName, params.collections['area'], 'general');
      } else if (params.typeid == 'investment') {
        this.renderMap(mapName, params.collections['area'], 'investment');
      } else if (params.typeid == 'quality') {
        this.renderMap(mapName, params.collections[params.childType], 'quality');
      }
    },
    chartHoverMapChange: function(params) {
      /**
       * 1.修改model层type
       * 2.清除markpoint
       * 3.重绘地图
       */
      this.model.set({
        type: params.typeid + (params.childType ? '-' + params.childType : ''),
      })
      this.deletePopo();
      this.rerenderMap(params);
    },
    //删除markpoint
    deletePopo: function() {
      var selectMapData = this.model.get('selectMapData');
      if (!selectMapData.flag) {
        this.model.set({
          type: 'children'
        })
        this.option.title.subtext = '';
      }
      this.option.series[0].markPoint && (this.option.series[0].markPoint.data = []);
      this.mapChart.setOption(this.option, true);
    },
    //数据增加经纬度
    appendLonLat: function(data) {
      var selectMapData = this.model.get('selectMapData');
      //console.log(selectMapData);
      if (selectMapData.flag) {
        _.each(areaJSONCoord.child, function(a) {
          _.each(data, function(b) {
            if (b.id == a.id || b.name == a.name) {
              b.coord = [a.longitude, a.latitude];
              if (b.value == '0.00') {
                b.value = 0;
              }
            }
          })
        })
        return data;
      } else {
        var obj = _.find(areaJSONCoord.child, function(a) {
          var mapname = selectMapData.mapName;
          return a.name == mapname;
        });
        _.each(obj.child, function(a) {
          _.each(data, function(b) {
            if (a.id == b.id || a.name == b.name) {
              b.name = b.name;
              b.coord = [a.longitude, a.latitude];
              if (b.value == '0.00') {
                b.value = 0;
              }
            }
          })
        });
        return data;
      }
    },
    getBack: function() {
      $('.back-wrap').hide();
      this.renderChildMap(this.childOptions);
    },
    setTipProjects: function(data) {
      this.model.set({
        plists: data
      })
    }
  })
});