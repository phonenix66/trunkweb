define([
  'jquery',
  'underscore',
  'backbone',
  'Handsontable',
  './model',
  'text!modules/master/components/computed/tmpl.html'
], function ($, _, Backbone, Handsontable, Model, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#weightComputedTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-lhzb-save': 'saveLHZBData'
    },
    initialize: function (row) {
      this.row = row;
      this.render();
      this.model = new Model();
      if (this.row.level == 3) {
        this.renderSubjectHandsonTable();
        this.getBusinessData();
      }
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    renderSubjectHandsonTable: function () {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/list';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: this.row.id,
        pageSize: 500
      }
      this.model.save(opts).then(function (res) {
        //console.log(res);
        if (res.code == 200) {
          self.subjectData = res.data.list;
          self.renderSubjectData(res.data.list);
        }
      })

    },
    renderSubjectData: function (data) {
      console.log(data);
      var self = this;
      $('.subject .ay-body').height(data.length * 40 + 30);
      var $container = $('#sujectTableList')[0];
      var hot = new Handsontable($container, {
        rowHeaders: true,
        colHeaders: ['5-很可能 0.8~1.0', '4-可能 0.6~0.8', '3-偶然 0.4~0.6', '2-不可能 0.2~0.4', '1-很不可能 0.0~0.2', '影响等级', '隶属值'],
        stretchH: 'all',
        height: data.length * 40 + 30,
        rowHeights: 40,
        colWidths: 100,
        data: data,
        cells: function (row, col, prop) {
          this.renderer = self.myRenderer;
          if (col == 5 && prop == 'effect') {
            this.renderer = self.colorRenderer
          }
        },
        columns: [{
          data: 'nsms5',
          readOnly: true
        }, {
          data: 'nsms4',
          readOnly: true
        }, {
          data: 'nsms3',
          readOnly: true
        }, {
          data: 'nsms2',
          readOnly: true
        }, {
          data: 'nsms1',
          readOnly: true
        }, {
          data: 'effect'
        }, {
          data: 'value',
          readOnly: true
        }]
      });
    },
    colorRenderer: function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.backgroundColor = 'rgba(100,149,237,0.2)';
      td.style.lineHeight = '36px';
      td.style.textAlign = 'center';
    },
    myRenderer: function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.lineHeight = '36px';
      td.style.textAlign = 'center';
    },
    saveLHZBData: function () {

    },
    getBusinessData: function () {
      var self = this;
      //var urlApi = API_URL + '/riskmodel/rmProPdjz/getByBussPk';
      var urlApi = API_URL + '/riskmodel/rmProPdjz/getViewData';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        promainid: this.row.mainid,
        prosinid: this.row.fid,
        riskid: this.row.riskid,
        type: 2
      }
      this.model.save(opts).then(function (res) {
        console.log(res);
      })
    }
  })
});