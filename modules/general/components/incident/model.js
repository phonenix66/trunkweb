define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      checked: []
    },
    initialize: function (url) {
      this.set({
        checked: []
      });
      this.urlApi = url;
    },
    idAttribute: "uid",
    urlRoot: function () {
      return this.urlApi;
    }
  })
});