define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    initialize: function (url) {
      this.urlApi = url;
      var userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
      var userprofile = JSON.parse(sessionStorage.getItem('userprofile'));
      /**
       * flag
       * 市区水利局管理用户role=9
       * 市区水利局其他用户role=7
       * 
       * true 普通法人(role=0)县级法人role=8
       * false 监管单位为自治区administrator(role=6)管理员role=6
       * 不能查看全自治区role=2
       */
      var data = {
        flag: (userinfo.role == 9 || userinfo.role == 7) ? true : false,
        role: userinfo.role,
        //flag: true,
        //role: 2,
        name: userinfo.city ? userinfo.city.name : '',
        id: userinfo.city ? userinfo.city.id : '',
        code: userinfo.city ? userinfo.city.code : ''
      };
      //如果是市监管单位，id取用户信息的locationId
      if (userinfo.role == 9 || userinfo.role == 7) {
        data.id = userprofile.user.locationId;
        data.name = userprofile.user.locationName;
      }
      this.set({
        userinfo: data
      });
      //绑定监听类型变化
      this.bind('change:type', function () {
        var opts = this.get('option');
        var type = this.get('type');
        var childType = '';
        if (type.indexOf('-') >= -1) { //工程质量
          var typeArr = type.split('-');
          type = typeArr[0];
          childType = typeArr[1];
        }
        var $html = '';
        if (type == 'investment') {
          opts.tooltip.show = true;
          opts.tooltip.position = function (point, item, dom, rect, size) {
            $(dom).empty();
            var plan = item.data.plan ? (item.data.plan / 10000).toFixed(2) : 0;
            var done = item.data.done ? (item.data.done / 10000).toFixed(2) : 0;
            var rate = item.data.rate ? item.data.rate : 0;
            $html = "<div class='arrow_box_tip'><p>" + item.name + "</p><ul class='list-info'>" +
              "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>计划投资:</span><strong>" + plan + "万元</strong></a></li>" +
              "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>已完成:</span><strong>" + done + "万元</strong></a></li>" +
              "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>完成进度:</span><strong>" + rate + "%</strong></a></li>" +
              "</ul></div>";
            $(dom).html($html);
          }
        } else if (type == 'general') {
          opts.tooltip.show = true;
          opts.tooltip.position = function (point, item, dom, rect, size) {
            $(dom).empty();
            $html = "<div class='arrow_box_tip'><p>" + item.name + "</p><ul class='list-info'>" +
              "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>工程数:</span><strong>" + item.data.amount + "个</strong></a></li>" +
              "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>占比:</span><strong>" + item.data.rate + "%</strong></a></li>" +
              "</ul></div>";
            $(dom).html($html);
          }
        } else if (type == 'quality') {
          opts.tooltip.show = true;
          opts.tooltip.position = function (point, item, dom, rect, size) {
            var $html = '';
            $(dom).empty();
            if (childType == 'list') {
              $html = "<div class='arrow_box_tip'><p>" + item.name + "</p><ul class='list-info'>" +
                "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>竣工验收率：</span><strong>" + item.data.rate + "%</strong></a></li>" +
                "</ul></div>";
            } else if (childType == 'yllList') {
              $html = "<div class='arrow_box_tip'><p>" + item.name + "</p><ul class='list-info'>" +
                "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>验收优良率：</span><strong>" + item.data.rate + "%</strong></a></li>" +
                "</ul></div>";
            } else if (childType == 'mglList') {
              $html = "<div class='arrow_box_tip'><p>" + item.name + "</p><ul class='list-info'>" +
                "<li><a href='javascript:void'><i class='fa fa-circle'></i><span>主要单位工程优良率：</span><strong>" + item.data.rate + "%</strong></a></li>" +
                "</ul></div>";
            }
            $(dom).html($html);
          }
        } else if (type == 'children') {
          opts.tooltip.show = false;
          opts.tooltip.position = function (point, item, dom, rect, size) {
            var plists = JSON.parse(sessionStorage.getItem('selectCityProjects'));
            var $html = '';
            _.each(plists, function (a) {
              if (item.data.id == a.id) {
                item.data.list = a.list.project;
              }
            })
            if (!item.data.list.length) {
              $html += "<div class='tips-wrap'><p>" + item.name + "</p><div class='none-data'>暂无项目数据</div></div>";
              $(dom).html($html);
              return !1;
            };
            $html += "<div class='tips-wrap'><p class='cityName'>" + item.name + "</p><ul>";
            for (var i = 0; i < item.data.list.length; i++) {
              var ele = item.data.list[i];
              var rate = Number(ele.rate.toFixed(1));
              var eleStr = JSON.stringify(ele);
              $html += "<li data-item='" + eleStr + "'><p class='pjName'>" + ele.name + "</p><span class='info'><b>进度：" + rate + "%</b><strong>状态：" + (ele.status || '') + "</strong></span></li>";
            }
            $html += ("</ul></div>");
            $(dom).html($html);
          }
        }
        this.set({
          option: opts
        })
      })
    },
    urlRoot: function () {
      return this.urlApi;
    },
    defaults: {
      userinfo: null,
      selectMapData: {
        flag: true,
        mapName: 'xizang'
      },
      type: '', //hover类型
      childType: '', //子类型工程质量
      plists: [], //项目表
      option: {
        title: {
          text: '西藏',
          subtext: '',
          left: 'center',
          top: '14',
          textStyle: {
            color: '#fff',
            fontSize: 24,
            fontWeight: 'bold',
            fontFamily: "Microsoft YaHei"
          },
          subtextStyle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'normal',
            fontFamily: "Microsoft YaHei"
          }
        },
        tooltip: {
          show: true,
          trigger: 'item',
          triggerOn: 'mousemove',
          //showContent: true,
          enterable: true,
          hideDelay: 2500,
          backgroundColor: 'opacity'
        },
        visualMap: {
          type: 'continuous', // 连续型
          min: 0, // 值域最小值，必须参数
          max: 100, // 值域最大值，必须参数
          calculable: true, // 是否启用值域漫游
          inRange: {
            color: ['#d94e5d', '#eac736', '#50a3ba']
            // 指定数值从低到高时的颜色变化
          },
          left: 'center',
          orient: 'horizontal',
          bottom: 15,
          dimension: 0,
          seriesIndex: 0,
          textStyle: {
            color: '#fff' // 值域控件的文本颜色
          }
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 1000
      }
    }
  })
});