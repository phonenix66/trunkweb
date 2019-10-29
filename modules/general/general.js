define('modules/general/general', [
  'jquery',
  'underscore',
  'backbone',
  'modules/general/components/view',
  'css!/css/master.css',
  'css!/css/general.css'
], function ($, _, Backbone, GeneralView) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      var generalView = new GeneralView();
    }
  }
});