define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/edit/edit.html'
], function ($, _, Backbone, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#editMasterTmpl',
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
      $('#msEditForm').bootstrapValidator({
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
    }
  })
});