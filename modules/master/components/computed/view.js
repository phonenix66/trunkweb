define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/computed/tmpl.html'
], function ($, _, Backbone, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#weightComputedTmpl',
    template: _.template(tmpl),
    initialize: function (row) {
      this.row = row;
      this.render();

    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
  })
});