define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/analyze/tmpl.html',
  'modules/master/components/analyze/model'
], function ($, _, Backbone, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#editAnalyzeTmpl',
    template: _.template(tmpl),
    events: {

    },
    initialize: function () {
      this.model = new Model();
      this.render();
    },
    render: function () {
      $(this.$el).html(this.template());
    }
  })
});