define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      cityFlag: true //取非单个项目数据
    },
    initialize: function (url) {
      this.urlApi = url;
    },
    urlRoot: function () {
      return this.urlApi;
    }
  })
});