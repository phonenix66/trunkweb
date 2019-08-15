define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/incident/tmpl.html',
  'modules/master/components/incident/model',
  'icheck'
], function ($, _, Backbone, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#riskIncidentListTmpl',
    template: _.template(tmpl),
    initialize: function (row) {
      console.log(row);
      this.row = row;
      this.model = new Model();
      this.checked = [];
      this.checked = this.model.get('checked');
      this.render();
      this.setiCheck();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    setiCheck: function () {
      var self = this;
      $('input.risk-check').iCheck({
        checkboxClass: 'icheckbox_square-green'
      }).on('ifChecked', function (e) {
        var item = $(e.currentTarget).data('item');
        self.checked.push(item);
        self.model.set({
          checked: self.checked
        })
      }).on('ifUnchecked', function (e) {
        var item = $(e.currentTarget).data('item');
        _.each(self.checked, function (ele, i) {
          if (item.id == ele.id) {
            self.checked.splice(i, 1);
          }
        });
        self.model.set({
          checked: self.checked
        })
      })
    }
  })
});