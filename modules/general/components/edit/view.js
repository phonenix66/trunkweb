define([
  'jquery',
  'underscore',
  'backbone',
  'text!./tmpl.html'
], function ($, _, Backbone, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#editGeneralTmplWrap',
    template: _.template(tmpl),
    initialize: function (row) {
      this.row = row;
      this.render();
      this.validate();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    validate: function () {
      $('#grEditForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: '单项工程名称不能为空'
              }
            }
          }
        }
      })
    }
  })
});