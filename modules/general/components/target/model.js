define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      targetChecked: []
    },
    initialize: function (url) {
      this.set({
        targetChecked: []
      })
      this.urlApi = url;
    },
    idAttribute: "uid",
    urlRoot: function () {
      return this.urlApi;
    }
  })
});