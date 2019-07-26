define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {

    },
    initialize: function (url) {
      this.urlApi = url;
    },
    urlRoot: function () {
      return this.urlApi;
    }
  })
});