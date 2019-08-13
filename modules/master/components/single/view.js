define([
  'jquery',
  'underscore',
  'backbone',
  'modules/master/components/single/model',
  'text!modules/master/components/single/tmpl.html',
  'bootstrapvalidator'
], function ($, _, Backbone, Model, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#singleItemsTmpl',
    template: _.template(tmpl),
    events: {},
    initialize: function (row) {
      this.row = row;
      var urlApi = API_URL + '/riskmodel/rmTarget/list';
      this.model = new Model(urlApi);
      this.model.save({
        pageNum: 1,
        pageSize: 500
      }, {
        patch: true
      });
      this.render();
      this.validate();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    validate: function () {
      $('#singleForm').bootstrapValidator({
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