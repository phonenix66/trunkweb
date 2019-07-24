define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    url: API_URL + "/ewindsys/ewindMenu/findMenuList",
    defaults: {
      userprofile: JSON.parse(sessionStorage.getItem('userprofile')),
      menuList: [],
      userinfo: JSON.parse(sessionStorage.getItem('userinfo'))
    },
    initialize: function () {}
  })
});