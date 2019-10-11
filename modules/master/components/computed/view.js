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
      'click .btn-lhzb-save': 'saveLHZBData',
      'click .btn-weight-analyze': 'handleWeightAnalyze'
    },
    initialize: function (row) {
      this.row = row;
      this.hotInstSubject = null;
      this.hotInstAnalyze = null;
      this.render();
      this.model = new Model();
      //levle = 3 风险事件权重分析
      if (this.row.level == 3) {
        this.renderSubjectHandsonTable();
      }
      this.getBusinessData();
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
      //console.log(data);
      var self = this;
      $('.subject .ay-body').height(data.length * 40 + 30);
      var $container = $('#sujectTableList')[0];
      this.hotInstSubject = new Handsontable($container, {
        rowHeaders: true,
        colHeaders: ['风险评价指标', '5-很可能 0.8~1.0', '4-可能 0.6~0.8', '3-偶然 0.4~0.6', '2-不可能 0.2~0.4', '1-很不可能 0.0~0.2', '影响等级', '隶属值'],
        stretchH: 'all',
        height: data.length * 40 + 30,
        rowHeights: 40,
        colWidths: 100,
        data: data,
        cells: function (row, col, prop) {
          this.renderer = self.myRenderer;
          if (col == 6 && prop == 'zblhcs') {
            this.renderer = self.colorRenderer
          }
        },
        columns: [{
          data: 'name',
          readOnly: true
        }, {
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
          data: 'zblhcs',
          allowEmpty: false,
          type: 'numeric'
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
      var self = this;
      this.hotInstSubject.validateCells(function (valid) {
        self.handleValidCallback(valid);
      });
      //console.log(sdata);
    },
    handleValidCallback: function (valid) {
      var self = this;
      var targetIds = [],
        sids = [],
        zblhcs = [];
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      if (valid) {
        var sdata = this.hotInstSubject.getSourceData();
        _.each(sdata, function (item) {
          targetIds.push(item.targetid);
          sids.push(item.id);
          zblhcs.push(item.zblhcs);
        });
        var opts = {
          fid: this.row.id,
          targetid: targetIds.join(','),
          id: sids.join(','),
          zblhcs: zblhcs.join(','),
          status: 2, //未计算权重
          result: ''
        };
        this.model.save(opts).then(function (res) {
          if (res.code == 200) {
            layer.msg('指标量化参数保存成功！');
            self.handleChangeIncidentStatus();
          }
        })
      } else {
        layer.msg('请填写影响等级后保存。');
      }
    },
    //更新风险事件状态
    handleChangeIncidentStatus: function () {
      var urlApi = API_URL + '/riskmodel/rmProRisk/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: this.row.fid,
        id: this.row.id,
        riskid: this.row.riskid,
        status: 5 //输入了量化指标，但未计算权重
      }
      console.log(opts);
      this.model.save(opts).then(function (res) {

      })
    },
    getBusinessData: function () { //权重分析矩阵
      var self = this;
      //var urlApi = API_URL + '/riskmodel/rmProPdjz/getByBussPk';
      var urlApi = API_URL + '/riskmodel/rmProPdjz/getViewData';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var type;
      if (this.row.level == 3) {
        type = 2; //获取风险因素
      } else if (this.row.level == 2) {
        type = 1; //获取风险事件
      } else if (this.row.level == 1) {
        type = 0; //获取单项工程
      }
      var opts = {
        promainid: this.row.mainid,
        prosinid: this.row.fid,
        riskid: this.row.riskid,
        type: type
      }
      this.model.save(opts).then(function (res) {
        //console.log(res);
        self.renderAnalyzeHandtable(res.data.jznames, res.data.jzids);
      })
    },
    renderAnalyzeHandtable: function (dataNames, dataIds) {
      var self = this;
      $('.analyze .ay-body').height(dataNames.length * 40 + 74);
      var jzids = dataIds.split(',');
      var colHeaders = ['风险权重', 'U'];
      var sourceData = [];
      var columns = [{
        data: 'name',
        readOnly: true
      }, {
        data: 'Uva',
        readOnly: true
      }];
      _.each(dataNames, function (item, i) {
        colHeaders.push('U' + (i + 1));
        var obj = {
          id: jzids[i],
          name: item,
          Uva: 'U' + (i + 1),
          weight: ''
        };
        //矩阵数据3*3 4*4...
        _.each(dataNames, function (d, j) {
          obj['value' + (j + 1)] = '';
        })
        columns.push({
          data: 'value' + (i + 1),
          type: 'numeric',
          allowEmpty: false
        })
        sourceData.push(obj);
      });
      columns.push({
        data: 'W',
        readOnly: true
      })
      colHeaders.push('W');
      console.log(sourceData, colHeaders, columns);
      //return;
      var $container = $('#analyzeTableList')[0];
      this.hotInstAnalyze = new Handsontable($container, {
        rowHeaders: true,
        colHeaders: colHeaders,
        stretchH: 'all',
        height: dataNames.length * 40 + 30,
        rowHeights: 40,
        colWidths: 100,
        data: sourceData,
        columns: columns,
        cells: function (row, col, prop) {
          this.renderer = self.myRenderer;
          if (prop != 'W' && col > 1) {
            this.renderer = self.colorRenderer
          }
          /* var that = this;
          _.each(dataNames, function (v, i) {
            if (row == i && prop == ('value' + (i + 1))) {
              that.renderer = function (instance, td, r, c, pp, val, cellProperties) {

              }
            }
          }) */
        },
        afterRenderer: function (TD, row, col, prop, value, cellProperties) {
          _.each(dataNames, function (v, i) {
            if (row == i && prop == ('value' + (i + 1))) {
              TD.style.backgroundColor = '#fff';
              sourceData[row]['value' + (i + 1)] = 1;
              cellProperties.readOnly = true;
            }
          })
        },
        afterChange: function (changes, source) {
          console.log(changes, source);
          if (changes) {
            var row = changes[0][0];
            var prop = changes[0][1];
            var oldVal = changes[0][2];
            var newVal = changes[0][3];
            //sourceData[row][prop] = newVal;
            var colsub = Number(prop.slice(5));
            var setValProp = 'value' + (row + 1);
            var modifyRow = self.hotInstAnalyze.propToCol(prop) - 2;
            sourceData[modifyRow][setValProp] = 1 / newVal;
            self.hotInstAnalyze.loadData(sourceData);
          }

        }
      });
      this.hotInstAnalyze.loadData(sourceData);
    },
    handleWeightAnalyze: function () {

    }
  })
});