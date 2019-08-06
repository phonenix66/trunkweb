define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/factor/collection/components/edit/edit.html'
], function ($, _, Backbone, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#editCollTmpl',
    template: _.template(tmpl),
    events: {

    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    initialize: function (row) {
      this.row = row;
      this.render();
      this.validate();
    },
    validate: function () {
      $('#collForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: '风险事件名称不能为空'
              }
            }
          }
        }
      })
    },
  })
});