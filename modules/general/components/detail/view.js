define([
  'jquery',
  'underscore',
  'backbone',
  './model',
  'text!./tmpl.html',
  'modules/general/components/single/view',
], function ($, _, Backbone, Model, tmpl, SingleView) {
  'use strict';
  return Backbone.View.extend({
    el: '#generalDetailTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-add-single': 'handleIncident'
    },
    initialize: function (row) {
      Backbone.on('reload:incident', this.getIncidentItems, this);
      this.incidentList = [];
      this.row = row;
      this.model = new Model();
      this.render();
      this.getIncidentItems('load');
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    handleIncident: function (e) {
      var row = $(e.currentTarget).data('row');
      var self = this;
      console.log(row);
      layer.open({
        type: 1,
        title: row.name + '-编辑风险事件',
        content: $('#singleItemsTmplWrap'),
        btn: ['确定', '取消'],
        area: ['40%', '50%'],
        success: function (i) {
          row.typeCast = 'edit';
          row.incidentList = self.incidentList;
          self.singleView = new SingleView(row);
        },
        yes: function (i, layero) {

        },
        cancel: function (i, layero) {

        }
      })
    },
    getIncidentItems: function (type) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/list';
      var results = [];
      self.incidentList = [];
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var subData = {
        fid: this.row.id,
        pageSize: 500
      };
      this.model.save(subData).then(function (res) {
        if (res.code == 200) {
          _.each(res.data.list, function (item) {
            var obj = {
              title: item.name,
              name: item.name,
              id: item.id,
              fid: item.fid,
              riskid: item.riskid,
              result: item.result,
              status: item.status,
              lazy: true,
              folder: true,
              level: 3, //风险事件
              cr: item.cr,
              expanded: true
            }
            results.push(obj);
          });
          self.incidentList = results;
          //console.log(results);
          if (type == 'load') {
            self.renderTreeTable(results);
          } else if (type == 'edit') {
            var tree = $("#treetable").fancytree("getTree");
            tree.reload(results);
          }

        }
      })
    },
    renderTreeTable: function (source) {
      var self = this;
      var opts = this.handleOptions(source);
      $("#treetable").fancytree(opts);
    },
    handleOptions: function (source) {
      var self = this;
      var glyph_opts = {
        preset: "bootstrap3",
        map: {}
      };
      return {
        extensions: ["dnd5", "glyph", "table", "wide"],
        checkbox: false,
        glyph: glyph_opts,
        source: source,
        table: {
          checkboxColumnIdx: 1,
          nodeColumnIdx: 1
        },
        activate: function (event, data) {
          //console.log(event, data);
        },
        lazyLoad: function (event, data) {
          var node = data.node;
          console.log(node);
          if (node.data.level == 2) {
            data.result = self.getRowIncidentData(node.data);
          } else if (node.data.level == 3) {
            data.result = self.getRowTargetData(node.data);
          }
          //console.log(data.result);
        },
        renderColumns: function (event, data) {
          var node = data.node,
            $tdList = $(node.tr).find(">td");
          $tdList.eq(0).text(node.getIndexHier());
          $tdList.eq(2).text(node.data.cr);
          $tdList.eq(3).text(node.data.result);
          //console.log(node.data);
          $tdList.eq(4).text(self.handleStatusCol(node.data.status, node.data));
          var $html = self.renderButton(node.data);
          $tdList.eq(5).html($html);
        },
        modifyChild: function (event, data) {
          var node = data.childNode;
        }
      }
    },
    handleStatusCol: function (value, data) {
      if (value == 1) {
        if (data.level == 4) {
          return '';
        }
        return '未输入值';
      } else if (value == 2) {
        if (data.level == 4) {
          return '';
        }
        return '未计算权重';
      } else if (value == 3) {
        return '已计算权重，验证未通过';
      } else if (value == 4) {
        return '已计算权重，验证通过';
      } else if (value == 5) {
        return '已输入量化指标值，未计算权重';
      } else if (value == 6) {
        return '矩阵关系发生变化，请重新输入';
      }
    },
    renderButton: function (data) {
      var $html = '';
      data.mainid = this.row.id;
      var row = JSON.stringify(data);
      switch (data.level) {
        case 1:
          $html = `<div class='btn-item-box'>
            <button class='btn btn-info' data-row='${row}'>权重计算</button>
            <button class='btn btn-info' data-row='${row}'>删除</button>
            </div>`;
          break;
        case 2:
          $html = `<div class='btn-item-box'>
            <button class='btn btn-info btn-single-edit' data-row='${row}'>编辑单项工程</button>
            <button class='btn btn-info btn-single-computed' data-row='${row}'>权重计算</button>
            <button class='btn btn-info btn-single-delete' data-row='${row}'>删除</button>
            </div>`;
          break;
        case 3:
          var mainid = this.row.id;
          $html = `<div class='btn-item-box'>
          <button class='btn btn-primary btn-incident-computed' data-row='${row}'>权重计算</button>
          <button class='btn btn-primary btn-incident-delete' data-row='${row}'>删除</button>
          </div>`;
          break;
        case 4:
          $html = `<div class='btn-item-box'>
          <button class='btn bg-purple btn-target-delete' data-row='${row}'>删除</button>
        </div>`;
          break;
        default:
          break;
      }
      return $html;
    },
    cleanView: function () {
      if (this.singleView) {
        this.singleView.remove();
        var $html = `<div id="singleItemsTmplWrap"></div>`;
        $('#generalWrapper').append($html);
      }
    }
  })
});