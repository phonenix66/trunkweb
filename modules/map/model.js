define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      userinfo: null
    },
    initialize: function () {
      var userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
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
      }
      this.set({
        userinfo: data
      });
    }
  })
});