define([
  'jquery',
  'underscore',
  'backbone',
  'Handsontable',
  './model',
  'text!./tmpl.html'
], function ($, _, Backbone, Handsontable, Model, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#weightComputedTmplWrap',
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
          type: 'numeric',
          validator: function (value, callback) {
            if (value == '') {
              callback(false);
            } else {
              var reg = new RegExp("^[0-9]+(.[0-9]{1,10})?$");
              if (reg.test(value)) {
                callback(true);
              } else {
                callback(false);
              }
            }
          }
        }, {
          data: 'value',
          readOnly: true
        }],
        afterChange: function (changes, source) {
          //console.log(changes);
          if (changes) {
            var row = changes[0][0];
            var prop = changes[0][1];
            var oldVal = changes[0][2];
            var newVal = changes[0][3];
            newVal = Math.floor(newVal * 10000) / 10000;
            //console.log(self.subjectData);
            self.subjectData[row][prop] = newVal;
            self.hotInstSubject.loadData(self.subjectData);
          }
        }
      });
    },
    colorRenderer: function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      td.style.backgroundColor = 'rgba(100,149,237,0.2)';
      //td.style.lineHeight = '36px';
      td.style.verticalAlign = 'middle';
      td.style.textAlign = 'center';
    },
    myRenderer: function (instance, td, row, col, prop, value, cellProperties) {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
      //td.style.lineHeight = '36px';
      td.style.verticalAlign = 'middle';
      td.style.textAlign = 'center';
    },
    saveLHZBData: function () {
      var self = this;
      if (self.subjectData.length <= 2) {
        layer.msg('指标数据不足，风险评价指标最少3个，编辑单项工程中添加风险因子');
        return !1;
      }
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
            if (self.row.status != 4) {
              self.row.status = 5;
            }
            self.handleChangeIncidentStatus();
          }
        })
      } else {
        layer.msg('请填写影响等级后保存。');
      }
    },
    //更新风险事件状态
    handleChangeIncidentStatus: function (cr) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: this.row.fid,
        id: this.row.id,
        cr: cr || null,
        riskid: this.row.riskid,
        status: this.row.status // 5输入了量化指标，但未计算权重
      }
      //this.row.status = 5;
      console.log(opts);
      this.model.save(opts).then(function (res) {
        if (res.code == 200) {
          self.editTreeNode(cr);
        }
      })
    },
    editTreeNode: function (cr) {
      var self = this;
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      console.log(cr);
      //输入了量化指标，但未计算权重
      node.data.status = this.row.status;
      var $tdList = $(node.tr).find(">td");
      var $text = '';
      if (this.row.status == 2) {
        $text = '未计算权重';
      } else if (this.row.status == 3) {
        $text = '已计算权重，验证未通过';
      } else if (this.row.status == 4) {
        $text = '已计算权重，验证通过';
      } else if (this.row.status == 5) {
        $text = '已输入量化指标值，未计算权重';
      }
      cr && $tdList.eq(2).text(cr);
      $tdList.eq(4).html($text);
      //this.row.status = 5;
      var $html = '';
      var row = JSON.stringify(this.row);
      if (this.row.level == 3) {
        $html = `<div class='btn-item-box'>
        <button class='btn btn-primary btn-incident-computed' data-row='${row}'>权重计算</button>
        <button class='btn btn-primary btn-incident-delete' data-row='${row}'>删除</button>
        </div>`;
      } else if (this.row.level == 2) {
        $html = `<div class='btn-item-box'>
          <button class='btn btn-info btn-single-edit' data-row='${row}'>编辑单项工程</button>
          <button class='btn btn-info btn-single-computed' data-row='${row}'>权重计算</button>
          <button class='btn btn-info btn-single-delete' data-row='${row}'>删除</button>
        </div>`;
      }
      $tdList.eq(5).html($html);
    },
    getBusinessData: function () { //权重分析矩阵
      var self = this;
      //console.log(this.row);
      var urlApi = API_URL + '/riskmodel/rmProPdjz/getViewData';
      if (this.row.status == 4) {
        urlApi = API_URL + '/riskmodel/rmProPdjz/getByBussPk';
      }
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var type;
      var opts = {
        promainid: this.row.mainid || null,
        prosinid: this.row.fid,
        riskid: this.row.riskid,
        type: type
      }
      if (this.row.level == 3) {
        type = 2; //获取风险因素
        opts.type = 2;
      } else if (this.row.level == 2) {
        type = 1; //获取风险事件
        opts.type = 1;
        opts.prosinid = this.row.id;
      } else if (this.row.level == 1) {
        type = 0; //获取单项工程
        opts['type'] = 0;
        opts['promainid'] = this.row.id;
      }
      this.model.save(opts).then(function (res) {
        //console.log(res);
        if (res.data.w) {
          res.data.w = res.data.w.split(',');
        }
        self.analyzeData = res.data;
        if (self.analyzeData.jznames.length == 0) {
          layer.alert('关联风险事件权重分析未通过', function (i) {
            layer.close(i);
          })
        }
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
          weight: self.row.status == 4 ? self.analyzeData.w[i] : ''
        };
        //矩阵数据3*3 4*4...
        _.each(dataNames, function (d, j) {
          if (self.row.status == 4) {
            var data = self.analyzeData.pdjzcsList;
            obj['value' + (j + 1)] = data[i][j];
          } else {
            obj['value' + (j + 1)] = '';
          }
        })
        columns.push({
          data: 'value' + (i + 1),
          type: 'numeric',
          allowEmpty: false,
          validator: function (value, callback) {
            if (!value) {
              callback(false);
            } else {
              var reg = new RegExp("^[0-9]+(.[0-9]{1,10})?$");
              if (reg.test(value)) {
                callback(true);
              } else {
                callback(false);
              }
            }

          }
        })
        sourceData.push(obj);
      });
      columns.push({
        data: 'weight',
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
          if (prop != 'weight' && col > 1) {
            this.renderer = self.colorRenderer
          }
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
          //console.log(changes, source);
          if (changes) {
            var row = changes[0][0];
            var prop = changes[0][1];
            var oldVal = changes[0][2];
            var newVal = changes[0][3];
            if (!newVal) {
              return !1;
            } else {
              var reg = new RegExp("^[0-9]+(.[0-9]{1,10})?$");
              if (!reg.test(newVal)) {
                layer.msg('只能输入有1~3位小数的正实数');
                return !1;
              }
            }
            var colsub = Number(prop.slice(5));
            var setValProp = 'value' + (row + 1);
            var modifyRow = self.hotInstAnalyze.propToCol(prop) - 2;
            sourceData[row][prop] = Math.floor(newVal * 10000) / 10000;
            sourceData[modifyRow][setValProp] = Math.floor((1 / newVal) * 10000) / 10000;
            self.hotInstAnalyze.loadData(sourceData);
          }
        }
      });
      this.hotInstAnalyze.loadData(sourceData);
      $('#computedCR').val('');
      if (this.row.status == 4) {
        $('#computedCR').val(this.analyzeData.cr);
        $('#computedResult').val('验证通过');
        $('#result_zhpgxl').val(this.analyzeData.zhpgxl);
      } else if (this.row.status == 1) {
        $('#computedResult').val('未输入值');
      } else if (this.row.status == 3) {
        $('#computedResult').val('已计算权重，验证未通过');
      } else if (this.row.status == 5) {
        $('#computedResult').val('已输入量化指标值，未计算权重');
      }
    },
    handleWeightAnalyze: function () {
      if (this.row.status == 1 && this.row.level == 3) {
        layer.msg('隶属计算未完成，请输入影响等级，并保存量化指标');
        return !1;
      }
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProPdjz/jzyxxjy';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var type;

      var opts = {
        jzids: self.analyzeData.jzids,
        promainid: this.row.mainid,
        prosinid: this.row.fid,
        riskid: this.row.riskid || '',
        type: type,
        pdjzcsList: []
      }
      if (this.row.level == 3) {
        type = 2; //获取风险因素
        opts.type = 2;
      } else if (this.row.level == 2) {
        type = 1; //获取风险事件
        opts.type = 1;
        opts.prosinid = this.row.id;
      } else if (this.row.level == 1) {
        type = 0; //获取单项工程
        opts.type = 0;
        opts.promainid = this.row.id;
      }
      var orginData = this.hotInstAnalyze.getSourceData();
      orginData = JSON.parse(JSON.stringify(orginData));
      var orginDataClone = JSON.parse(JSON.stringify(orginData));
      var pdjzcsList = [];
      _.each(orginData, function (item, i) {
        for (var key in item) {
          if (key.indexOf('value') == -1) {
            delete item[key];
          }
        }
        pdjzcsList.push(_.values(item));
      });
      opts.pdjzcsList = pdjzcsList;
      var lx = layer.load();
      this.model.save(opts).then(function (res) {
        if (res.code == 202) {
          var $msg = '';
          if (self.row.level == 3) {
            $msg = res.msg + '，请检查风险因子输入是否正确,并保存正确数值';
          };
          layer.msg($msg || res.msg);
          if (self.row.status != 4) {
            self.row.status = 3;
          }
        } else if (res.code == 200) {
          layer.msg('验证成功');
          self.row.status = 4;
          var weights = res.data.w.split(',')
          _.each(orginDataClone, function (item, i) {
            item.weight = weights[i];
          });
          self.hotInstAnalyze.loadData(orginDataClone);
          $('#computedCR').val(res.data.cr);
          $('#computedResult').val('验证通过');
          $('#result_zhpgxl').val(res.data.zhpgxl);
        }
        if (self.row.level == 2) {
          $('.result .value').val(res.data.result);
          $('#analyzeResult').val(res.data.result);
          $('#anaCR').text(res.data.cr);
          $('#anaResult').text(res.data.result);
          self.handleChangeSingleStatus(res.data.cr);
        } else if (self.row.level == 3) {
          self.handleChangeIncidentStatus(res.data.cr);
        } else if (self.row.level == 1) {
          $('.result .value').val(res.data.result + '1');
          $('#anaCR').text(res.data.cr);
          $('#anaResult').text(res.data.result);
          $('#analyzeResult').val(res.data.result);
          self.handleChangeProjectStatus();
        }
        layer.close(lx);
      })
    },
    //更新单项工程状态
    handleChangeSingleStatus: function (value) {
      var self = this;
      var subData = {
        name: this.row.name,
        //fid: this.row.fid,
        id: this.row.id,
        status: this.row.status,
        //result: value || ''
      };
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          //self.editTreeNode(value);
          $('#listGeneralTable').bootstrapTable('refresh');
        }
      })
    },
    handleChangeProjectStatus: function () {
      var self = this;
      var subData = {
        status: this.row.status,
        id: this.row.id
      }
      //console.log(subData);
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();

      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          //self.editTreeNode();
          $('#listGeneralTable').bootstrapTable('refresh');
        }
      })
    }
  })
});