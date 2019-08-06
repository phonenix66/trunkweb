define('modules/master/master', [
  'jquery',
  'underscore',
  'backbone',
  'modules/master/components/view',
  'css!modules/master/master.css'
], function ($, _, Backbone, MasterView) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      var masterView = new MasterView();
    }
  }
});