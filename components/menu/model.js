define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
  'use strict';
  return Backbone.Model.extend({
    defaults: {
      list: []
    },
    initialize: function () {

    }
  })
});