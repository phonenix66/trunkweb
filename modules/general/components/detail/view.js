define([
  'jquery',
  'underscore',
  'backbone',
  './model',
  'text!./tmpl.html',
  'modules/general/components/single/view',
  'modules/general/components/computed/view'
], function ($, _, Backbone, Model, tmpl, SingleView, ComputedView) {
  'use strict';
  return Backbone.View.extend({
    el: '#generalDetailTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-add-single': 'handleIncident',
      'click .btn-incident-delete': 'deleteIncident',
      'click .btn-target-delete': 'removeTargetNode',
      'click .btn-weight-computed,.btn-single-computed,.btn-incident-computed': 'handleSingleComputed',
    },
    initialize: function (row) {
      Backbone.on('reload:incident', this.getIncidentItems, this);
      this.incidentList = [];
      this.row = row;
      this.row.level = 2;
      this.row.statusTxt = this.handleStatusCol(row.status, row);
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
      //console.log(row);
      layer.open({
        type: 1,
        title: row.name + '-编辑风险事件&因素',
        content: $('#singleItemsTmplWrap'),
        btn: ['确定', '取消'],
        area: ['40%', '50%'],
        success: function (i) {
          //获取最新风险事件并渲染
          self.getLatestIncidentItems(row);
        },
        yes: function (i, layero) {
          layer.close(i);
          self.cleanView();
        },
        btn2: function (i) {
          layer.close(i);
          self.cleanView();
        },
        cancel: function (i, layero) {
          layer.close(i);
          self.cleanView();
        }
      })
    },
    getLatestIncidentItems: function (row) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/list';
      self.incidentList = [];
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var subData = {
        fid: this.row.id,
        pageSize: 500
      };
      this.model.save(subData).then(function (res) {
        row.typeCast = 'edit';
        self.incidentList = res.data.list;
        row.incidentList = res.data.list;
        self.singleView = new SingleView(row);
      })
    },
    getIncidentItems: function (type, incidentData) {
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
              key: item.id,
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
            tree.reload(results).done(function () {
              if (incidentData) {
                var node = tree.getNodeByKey(incidentData.id);
                //console.log(node);
                node.load(true).done(function () {
                  node.setExpanded();
                })
              }
            });
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
          //$tdList.eq(0).text(node.getIndexHier());
          $tdList.eq(2).text(node.data.cr);
          if (node.data.level == 4) {
            $tdList.eq(2).text('');
          }
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
        if (data && data.level == 4) {
          return '';
        }
        return '未输入值';
      } else if (value == 2) {
        if (data && data.level == 4) {
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
      //data.mainid = this.row.id;
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
          //var mainid = this.row.id;
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
    deleteIncident: function (e) { //删除风险事件
      var self = this;
      var row = $(e.currentTarget).data('row');
      var urlApi = API_URL + '/riskmodel/rmProRisk/remove/' + row.id;
      var results = [];
      //self.incidentList = [];
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var $msg = '';
      if (this.row.status != 1 && this.row.status != 6) {
        $msg = '此风险事件与 ' + this.row.name + ' 有关联计算，会改变矩阵计算关系，确定要删除此项吗？'
      } else {
        $msg = '确定要删除此项吗？';
      }
      layer.confirm($msg, function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            if (self.row.status == 3 || self.row.status == 4) {
              self.row.status = 6;
            }
            self.incidentList = _.filter(self.incidentList, function (item) {
              return item.id != row.id;
            });
            self.handleChangeSingleStatus();
            layer.close(index);
          }
        });
      }, function () {

      });
    },
    removeTargetNode: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var $msg = '';
      if (node.parent.data.status != 1 && node.parent.data.status != 6) {
        $msg = '此因子与' + node.parent.data.name + '事件有关联计算，会改变矩阵计算关系，确定要删除此项吗？'
      } else {
        $msg = '确定要删除此项吗？';
      }
      layer.confirm($msg, function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            if (node.parent.data.status != 1 && node.parent.data.status != 6) {
              node.parent.data.status = 6;
            }
            self.handleChangeIncidentStatus(node);
            //node.remove();
            Backbone.trigger('reload:incident', 'edit', node.parent.data);
            layer.close(index);
          }
        })
        layer.close(index);
      }, function () {
        console.log(node);
      })
    },
    getRowTargetData: function (row) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/list';
      var results = [];
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.fetch({
        data: JSON.stringify({
          fid: row.id,
          pageSize: 500
        }),
        contentType: 'application/json',
        type: 'post',
        async: false,
        success: function (model, res) {
          //console.log(res);
          if (res.code == 200 && res.data) {
            results = JSON.parse(JSON.stringify(res.data.list));
            _.each(results, function (item) {
              item.title = item.name;
              item.level = 4;
              item.key = item.id;
            });
          }
        }
      });
      return results;
    },
    handleSingleComputed: function (e) {
      var row = $(e.currentTarget).data('row');
      var self = this;
      //console.log(row);
      layer.open({
        title: '计算分析',
        type: 1,
        area: ['60%', '70%'],
        content: $('#weightComputedTmplWrap'),
        btn: ['确定', '取消'],
        success: function () {
          self.computedView = new ComputedView(row);
        },
        yes: function (index, layero) {
          layer.close(index);
          self.cleanView();
        },
        cancle: function (index, layero) {

        },
        btn2: function (index, layero) {
          layer.close(index);
          self.cleanView();
        }
      })
    },
    handleChangeSingleStatus: function () {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      var self = this;
      var subData = {
        status: this.row.status,
        id: this.row.id
      }
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          $('#anaStatus').text(self.handleStatusCol(self.row.status));
          node.remove();
        }
      })
    },
    //更新风险事件状态
    handleChangeIncidentStatus: function (node) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: node.parent.data.fid,
        id: node.parent.data.id,
        riskid: node.parent.data.riskid,
        status: node.parent.data.status // 5输入了量化指标，但未计算权重
      }
      //node.parent.data.status = 5;
      console.log(opts);
      this.model.save(opts).then(function (res) {
        if (res.code == 200) {
          var $tdList = $(node.parent.tr).find(">td");
          $tdList.eq(4).text(self.handleStatusCol(node.parent.data.status));
          var $html = self.renderButton(node.parent.data);
          $tdList.eq(5).html($html);
          node.remove();
        }
      })
    },
    cleanView: function () {
      if (this.singleView) {
        this.singleView.remove();
        var $html = `<div id="singleItemsTmplWrap"></div>`;
        $('#generalWrapper').append($html);
      }
      if (this.computedView) {
        this.computedView.remove();
        var $html = `<div id="weightComputedTmplWrap"></div>`;
        $('#generalWrapper').append($html);
      }
    }
  })
});