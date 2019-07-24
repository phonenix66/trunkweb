define('modules/map/map', [
  'jquery',
  'underscore',
  'backbone',
  'css!./css/map.css',
  'css!./css/buttons.css',
  'css!./css/circle-side.css'
], function ($, _, Backbone) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      require(['modules/map/view'], function (Map) {
        //var urlApi = 'module/map/data/datas.json';
        //console.log(Map);
        var map = new Map();

      })
    }
  }

});