define('modules/system/user/user', [
  'jquery',
  'underscore',
  'backbone',
  'modules/system/user/components/view',
  'css!modules/system/user/user.css'
], function ($, _, Backbone, User) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      var user = new User();
    }
  }
});