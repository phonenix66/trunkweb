define([
  'jquery',
  'underscore',
  'backbone',
  'Handsontable',
  'text!modules/master/components/computed/tmpl.html'
], function ($, _, Backbone, Handsontable, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#weightComputedTmpl',
    template: _.template(tmpl),
    initialize: function (row) {
      this.row = row;
      this.render();
      if (this.row.level == 2) {
        this.renderSubjectHandsonTable();
      }
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    renderSubjectHandsonTable: function () {

      var $container = $('#sujectTableList')[0];
      var hot = new Handsontable($container, {
        rowHeaders: true,
        colHeaders: ['5-很可能 0.8~1.0', '4-可能 0.6~0.8', '3-偶然 0.4~0.6', '2-不可能 0.2~0.4', '1-很不可能 0.0~0.2', '影响等级', '隶属值'],
        stretchH: 'all',
        height: 190,
        rowHeights: 40,
        colWidths: 100,
        data: Handsontable.helper.createSpreadsheetData(10, 7),
      });

    }
  })
});