define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      sujectData: null
    },
    initialize: function (url) {
      this.urlApi = url;
    },
    idAttribute: "uid",
    urlRoot: function () {
      return this.urlApi;
    }
  })
});