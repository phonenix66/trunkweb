define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/factor/element/components/edit/edit.html'
], function ($, _, Backbone, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#editEleTmpl',
    template: _.template(tmpl),
    events: {},
    initialize: function (row) {
      this.row = row;
      console.log(row);
      /* if (!this.row) {
        this.render();
      } else {
        this.getRowData();
      } */
      this.render();
      this.validate();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    validate: function () {
      $('#eleForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: '风险因素名称不能为空'
              }
            }
          }
        }
      })
    },
  })
});