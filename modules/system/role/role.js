define('modules/system/role/role', [
  'jquery',
  'underscore',
  'backbone',
  'modules/system/role/components/view',
  'css!modules/system/role/role.css'
], function ($, _, Backbone, Role) {
  'use strict';
  var page = {};
  return page = {
    init: function () {
      new Role();
    }
  }

});