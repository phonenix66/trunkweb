define('modules/system/menu/menu', [
  'jquery',
  'underscore',
  'backbone',
  'modules/system/menu/components/view',
  'css!modules/system/menu/menu.css'
], function ($, _, Backbone, Menu) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      var menu = new Menu();
    }
  }
});