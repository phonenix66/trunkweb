define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/analyze/tmpl.html',
  'modules/master/components/analyze/model',
  'modules/master/components/single/view',
  'modules/master/components/computed/view'
], function ($, _, Backbone, tmpl, Model, SingleView, ComputedView) {
  'use strict';
  return Backbone.View.extend({
    el: '#editAnalyzeTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-add-single': 'addSingleItem',
      'click .btn-single-delete': 'removeItem',
      'click .btn-single-edit': 'editSingleItem',
      'click .btn-incident-delete': 'removeIncidentNode',
      'click .btn-target-delete': 'removeTargetNode',
      'click .btn-weight-computed,.btn-single-computed,.btn-incident-computed': 'handleSingleComputed',

    },
    initialize: function (row) {
      this.row = row;
      this.row.level = 1;
      this.row.statusText = this.handleStatusCol(this.row.status, row);
      var urlApi = API_URL + '/riskmodel/rmProMain/' + row.id;
      this.model = new Model(urlApi);
      this.render();
      //this.renderTreeTable();
      //this.getRowTreeData();
      this.getSingleItems();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    renderTreeTable: function (source) {
      var self = this;
      var glyph_opts = {
        preset: "bootstrap3",
        map: {}
      };
      $("#treetable").fancytree({
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
          console.log(node.data);
          $tdList.eq(4).text(self.handleStatusCol(node.data.status, node.data));
          var $html = self.renderButton(node.data);
          $tdList.eq(5).html($html);
        },
        modifyChild: function (event, data) {
          var node = data.childNode;
        }
      });
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
    getRowIncidentData: function (row) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/list';
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
          if (res.code == 200 && res.data != null) {
            _.each(res.data.list, function (item) {
              var obj = {
                title: item.name,
                name: item.name,
                id: item.id,
                fid: item.fid,
                riskid: item.riskid,
                status: item.status,
                result: item.result,
                lazy: true,
                folder: true,
                level: 3,
                cr: item.cr,
                expanded: true
              };
              results.push(obj);
            });
          } else {
            results = [];
          }
        }
      });
      return results;
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
            });
          }
        }
      });
      return results;
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
    getSingleItems: function (data) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProMain/list';
      var results = [];
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save({
        type: 1,
        pageSize: 500
      }, {
        patch: true
      }).then(function (res) {
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
            level: 2,
            cr: item.cr,
            expanded: true
          };
          results.push(obj);
        });
        self.renderTreeTable(results);
      })
    },
    addSingleItem: function () { //添加单项工程
      var self = this;
      var subData = {
        name: '',
        fid: this.row.id,
        type: 1,
        status: 1 //未输入值
      }
      var urlApi = API_URL + '/riskmodel/rmProMain/add';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();

      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        layer.open({
          type: 1,
          title: '新增单项工程',
          content: $('#singleItemsTmpl'),
          area: ['40%', '50%'],
          btn: ['确定', '取消'],
          success: function (layero, index) {
            if (self.singleView) {
              self.singleView = null;
            }
            res.data.typeCast = 'add';
            self.singleView = new SingleView(res.data);
          },
          yes: function (index, layero) {
            $('#singleForm').data('bootstrapValidator').validate();
            var valid = $('#singleForm').data('bootstrapValidator').isValid();
            if (!valid) return !1;
            self.saveSingleData(res.data);
            layer.close(index);
            self.singleView.undelegateEvents();
            self.cleanView();
          },
          cancel: function (index, layero) {
            layer.close(index);
            self.deleteSingleItem(res);
            self.cleanView();
          },
          btn2: function (index, layero) {
            layer.close(index);
            self.deleteSingleItem(res);
            self.cleanView();
          }
        })
      })
    },
    deleteSingleItem: function (item) {
      var urlApi = API_URL + '/riskmodel/rmProMain/remove/' + item.data.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.fetch().then(function (res) {

      })
    },
    removeItem: function (e) {
      var row = $(e.currentTarget).data('row');
      var level = row.level;
      switch (level) {
        case 1:
          break;
        case 2:
          this.deleteProMain(row);
          break;
        case 3:
          break;
        default:
          break;
      }
    },
    deleteProMain: function (row) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProMain/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      console.log(this.row);
      //this.deleteNode();
      var $msg = '';
      if (this.row.status != 1 && this.row.status != 6) {
        $msg = '此单项工程与 ' + this.row.name + ' 有关联计算，会改变矩阵计算关系，确定要删除此项吗？'
      } else {
        $msg = '确定要删除此项吗？';
      }

      layer.confirm($msg, function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            // 修改总工程权重状态
            self.row.status = 6;
            self.deleteNode();
            layer.close(index);
          }
        })
      }, function () {

      })
    },
    deleteNode: function () {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      this.handleChangeProjectStatus(node);
      //node.remove();
    },
    saveSingleData: function (singleData) {
      var self = this;
      console.log(this.row);
      var name = $('#singlePjName').val();
      var subData = {
        name: name,
        fid: this.row.id,
        type: 1,
        id: singleData.id,
        status: singleData.status || 1
      };
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (singleData.typeCast == 'edit') {
          self.editSingleTreeNode(subData);
        } else {
          self.addTreeNode(subData);
        }
      })
    },
    addTreeNode: function (data) {
      var tree = $("#treetable").fancytree("getTree");
      var firstNode = tree.getFirstChild();
      firstNode.appendSibling({
        fid: data.fid,
        //riskid: data.riskid,
        level: 2,
        expanded: true,
        title: data.name,
        folder: true,
        id: data.id,
        name: data.name,
        status: data.status,
        lazy: true
      })
    },
    editSingleTreeNode: function (data) {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      //console.log(node.data);
      node.setTitle(data.name);
      node.data.name = data.name;
      var $tdList = $(node.tr).find(">td");
      var statusTxt = this.handleStatusCol(data.status, data);
      var $html = this.renderButton(node.data);
      $tdList.eq(2).text(node.data.cr);
      $tdList.eq(5).html($html);
      $tdList.eq(4).text(statusTxt);
    },
    editSingleItem: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      //console.log(row);
      row.typeCast = 'edit';
      var incidentList = this.getRowIncidentData(row);
      //console.log(incidentList);
      layer.open({
        type: 1,
        title: '编辑单项工程-' + row.name,
        content: $('#singleItemsTmpl'),
        area: ['40%', '50%'],
        btn: ['确定', '取消'],
        success: function (layero, index) {
          if (self.singleView) {
            self.singleView = null;
          }
          row.incidentList = incidentList;
          self.singleView = new SingleView(row);
        },
        yes: function (index, layero) {
          layer.close(index);
          self.saveSingleData(row);
          self.cleanView();
        },
        cancel: function (index, layero) {
          layer.close(index);
          self.cleanView();
        },
        btn2: function (index, layero) {
          layer.close(index);
          self.cleanView();
        }
      });
    },
    removeIncidentNode: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      var urlApi = API_URL + '/riskmodel/rmProRisk/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var $msg = '';
      if (node.parent.data.status != 1 && node.parent.data.status != 6) {
        $msg = '此风险事件与 ' + node.parent.data.name + ' 有关联计算，会改变矩阵计算关系，确定要删除此项吗？'
      } else {
        $msg = '确定要删除此项吗？';
      }
      //node.parent.data.status = 6;
      layer.confirm($msg, function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            if (node.parent.data.status != 1 && node.parent.data.status != 6) {
              //if (node.parent.data.status == 1) {
              node.parent.data.status = 6;
              self.handleChangeSingleStatus(node);
            }
            //node.remove();
            layer.close(index);
          }
        })
      }, function () {

      })
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
              //if (node.parent.data.status == 1) {
              node.parent.data.status = 6;
              self.handleChangeIncidentStatus(node);
            }
            //node.remove();
            layer.close(index);
          }
        })
        layer.close(index);
      }, function () {
        console.log(node);
      })
    },
    handleSingleComputed: function (e) {
      var row = $(e.currentTarget).data('row');
      var self = this;
      console.log(row);
      layer.open({
        title: '计算分析',
        type: 1,
        area: ['60%', '70%'],
        content: $('#weightComputedTmpl'),
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
          //node.setTitle(data.name);
          //node.data.name = data.name;
          var $tdList = $(node.parent.tr).find(">td");
          $tdList.eq(4).text(self.handleStatusCol(node.parent.data.status));
          var $html = self.renderButton(node.parent.data);
          $tdList.eq(5).html($html);
          node.remove();
        }
      })
    },
    //更新单项工程状态
    handleChangeSingleStatus: function (node) {
      var self = this;
      //console.log(node);
      var subData = {
        fid: node.parent.data.fid,
        id: node.parent.data.id,
        type: 1,
        status: node.parent.data.status || 1
      };
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      //修改单项风险状态
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        var $tdList = $(node.parent.tr).find(">td");
        $tdList.eq(4).text(self.handleStatusCol(node.parent.data.status));
        var $html = self.renderButton(node.parent.data);
        $tdList.eq(5).html($html);
      })
    },
    // 更新总工程状态
    handleChangeProjectStatus: function (node) {
      var self = this;
      console.log(node);
      var subData = {
        id: this.row.id,
        status: this.row.status,
        type: 0
      }
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          var statTxt = self.handleStatusCol(self.row.status);
          $('#anaStatus').text(statTxt);
        }
      })
    },
    updateTreeNode: function () {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      if (node.children) {
        node.load(true).done(function () {
          node.setExpanded();
        });
      }
    },
    cleanView: function () {
      if (this.singleView) {
        this.singleView.remove();
        var $html = `<div id="singleItemsTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
      if (this.computedView) {
        this.computedView.remove();
        var $html = `<div id="weightComputedTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
    }
  })
});


/* this.model.fetch({
        data: JSON.stringify({
          type: 1,
          pageSize: 500
        }),
        contentType: 'application/json',
        type: 'post',
        async: false,
        success: function (modelData, res, opts) {
          _.each(res.data.list, function (item) {
            var obj = {
              title: item.name,
              id: item.id,
              fid: item.fid,
              riskid: item.riskid,
              lazy: true,
              folder: true,
              level: 2,
              expanded: true
            };
            results.push(obj);
          })
        }
      }); */