define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/analyze/tmpl.html',
  'modules/master/components/analyze/model',
  'modules/master/components/single/view'
], function ($, _, Backbone, tmpl, Model, SingleView) {
  'use strict';
  return Backbone.View.extend({
    el: '#editAnalyzeTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-add-single': 'addSingleItem',
      'click .btn-item-delete': 'removeItem'
    },
    initialize: function (row) {
      this.row = row;
      var urlApi = API_URL + '/riskmodel/rmProMain/' + row.id;
      this.model = new Model(urlApi);
      this.render();
      //this.renderTreeTable();
      //this.getRowTreeData();
      this.getSingleItems();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    renderTreeTable: function (source) {
      var self = this;
      var glyph_opts = {
        preset: "bootstrap3",
        map: {}
      };
      $("#treetable").fancytree({
        extensions: ["dnd5", "glyph", "table", "wide"],
        checkbox: true,
        glyph: glyph_opts,
        source: source,
        table: {
          checkboxColumnIdx: 1,
          nodeColumnIdx: 2
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
          $tdList.eq(3).text(node.data.reResult);
          $tdList.eq(4).text(node.data.status || '未输入值');
          var $html = self.renderButton(node.data);
          $tdList.eq(5).html($html);
          //console.log(node);
        },
        modifyChild: function (event, data) {
          console.log(event, data);
          var node = data.childNode;
        }
      });
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
                id: item.id,
                fid: item.fid,
                riskid: item.riskid,
                lazy: true,
                folder: true,
                level: 3,
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
          console.log(res);
        }
      })
    },
    renderButton: function (data) {
      var $html = '';
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
            <button class='btn btn-info' data-row='${row}'>编辑单项工程</button>
          <button class='btn btn-info' data-row='${row}'>权重计算</button>
            <button class='btn btn-info btn-item-delete' data-row='${row}'>删除</button>
            </div>`;
          break;
        case 3:
          $html = `<div class='btn-item-box'>
          <button class='btn btn-primary' data-row='${row}'>编辑风险事件</button>
        <button class='btn btn-primary' data-row='${row}'>权重计算</button>
          <button class='btn btn-primary btn-item-delete' data-row='${row}'>删除</button>
          </div>`;
          break;
        case 4:
          $html = `<div class='btn-item-box'>
          <button class='btn btn-info' data-row='${row}'>权重计算</button>
          <button class='btn btn-info btn-item-delete' data-row='${row}'>删除</button>
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
            id: item.id,
            fid: item.fid,
            riskid: item.riskid,
            lazy: true,
            folder: true,
            level: 2,
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
        type: 1
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

      layer.confirm('确定要删除此项吗？', function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
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
      node.remove();
    },
    saveSingleData: function (singleData) {
      var self = this;
      var name = $('#singlePjName').val();
      var subData = {
        name: name,
        fid: this.row.id,
        type: 1,
        id: singleData.id
      };
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        console.log(res);
        self.addTreeNode(subData);
      })
    },
    addTreeNode: function (data) {
      var tree = $("#treetable").fancytree("getTree");
      var firstNode = tree.getFirstChild();
      console.log(firstNode);
      firstNode.appendSibling({
        fid: data.fid,
        //riskid: data.riskid,
        level: 2,
        expanded: true,
        title: data.name,
        folder: true,
        id: data.id,
        lazy: true
      })
    },
    cleanView: function () {
      if (this.singleView) {
        this.singleView.remove();
        var $html = `<div id="singleItemsTmpl"></div>`;
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