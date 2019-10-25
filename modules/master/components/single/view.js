define([
  'jquery',
  'underscore',
  'backbone',
  'modules/master/components/single/model',
  'text!modules/master/components/single/tmpl.html',
  'modules/master/components/incident/view',
  'modules/master/components/target/view',
  'bootstrapvalidator'
], function ($, _, Backbone, Model, tmpl, IncidentView, TargetView) {
  'use strict';
  return Backbone.View.extend({
    el: '#singleItemsTmpl',
    template: _.template(tmpl),
    events: {
      'click .btn-add-incident': 'handleIncident',
      'click .btn-add-target': 'handleTarget',
      'click .btn-delete-incident': 'deleteIncident',
      'click .btn-delete-target': 'deleteTarget'
    },
    initialize: function (row) {
      this.row = row;
      this.model = new Model();
      this.selectedIncident = this.model.get('selected');
      var self = this;

      this.render();
      this.validate();
      if (this.row.typeCast == 'edit') {
        //编辑时model层获取已选事件
        this.selectedIncident = this.row.incidentList || [];
        this.model.set({
          selected: this.selectedIncident
        });
        //console.log(this.selectedIncident);
        _.each(this.selectedIncident, function (item) {
          self.loadrmProRiskTargetList(item);
        })
      }
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
    },
    handleIncident: function () { //添加风险事件
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmRisk/notSelectedList';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save({
        fid: this.row.id, //单项工程id
        pageNum: 1,
        pageSize: 500
      }, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          layer.open({
            type: 1,
            title: '添加风险事件',
            content: $('#riskIncidentListTmpl'),
            area: ['30%', '30%'],
            btn: ['确定', '取消'],
            success: function () {
              var row = res.data.list;
              if (self.incidentView) {
                self.incidentView = null;
              }
              self.incidentView = new IncidentView(row);
            },
            yes: function (index, layero) {
              var checked = self.incidentView.checked;
              self.renderTableIncident(checked);
              layer.close(index);
            },
            cancel: function (index, layero) {
              layer.close(index);
            },
            btn2: function (index, layero) {
              layer.close(index);
            }
          })
        }
      });
    },
    handleTarget: function (e) { //添加风险指标
      var self = this;
      var $incident = $(e.currentTarget).data('incident');
      console.log($incident);
      layer.open({
        type: 1,
        title: '添加风险指标',
        content: $('#targetListTmpl'),
        area: ['30%', '30%'],
        btn: ['确定', '取消'],
        success: function () {
          if (self.targetView) {
            self.targetView = null;
          }
          self.targetView = new TargetView($incident);
        },
        yes: function (index, layero) {
          var targetChecked = self.targetView.targetChecked;
          if ($incident.status != 1 && $incident.status != 6) {
            //if ($incident.status == 1) {
            layer.confirm('已计算量化指标或者权重，添加风险因子，矩阵关系会发生变化，确定要添加吗？', function (j) {
              $incident.status = 6;
              self.handleChangeIncidentStatus($(e.currentTarget), $incident);
              self.renderTDTargetData(targetChecked, $incident);
              layer.close(j);
              layer.close(index);
              self.cleanView();
            }, function () {
              layer.close(index);
              self.cleanView();
            })
          } else {
            self.renderTDTargetData(targetChecked, $incident);
            layer.close(index);
            self.cleanView();
          }
        },
        cancel: function (index, layero) {
          layer.close(index);
          self.cleanView();
        },
        btn2: function (index, layero) {
          layer.close(index);
          self.cleanView();
        }
      })
    },
    renderOperationTarget: function ($ele, $incident) {
      var $td = $ele.parent();
      $td.empty();
      var $incidentStr = JSON.stringify($incident);
      var $hml = `<a href="javascript:void(0)" data-incident='${$incidentStr}'
      class="btn btn-primary btn-add-target">新增风险指标</a>
    <a href="javascript:void(0)" data-incident='${$incidentStr}'
      class="btn btn-danger btn-delete-incident">删除风险事件</a>`;
      $td.html($hml);
    },
    //更新风险事件状态
    handleChangeIncidentStatus: function ($ele, inciRow) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: inciRow.fid,
        id: inciRow.id,
        riskid: inciRow.riskid,
        status: inciRow.status // 5输入了量化指标，但未计算权重
      }
      //inciRow.status = 5;
      console.log(opts);
      this.model.save(opts).then(function (res) {
        if (res.code == 200) {
          self.renderOperationTarget($ele, inciRow);
          self.updateTreeNode();
        }
      })
    },
    handleChangeSingleStatus: function () {
      var self = this;
      console.log(this.row);
      var subData = {
        fid: this.row.fid,
        id: this.row.id,
        status: this.row.status
      };
      var urlApi = API_URL + '/riskmodel/rmProMain/edit';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          self.editSingleTreeNode();
        }
      })
    },
    renderTableIncident: function (rows) {
      if (!rows.length) return !1;
      var urlApi = API_URL + '/riskmodel/rmProRisk/add';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var riskid = _.map(rows, function (item) {
        return item.id;
      });
      var subData = {
        fid: this.row.id,
        riskid: riskid.join(','),
        status: 1
      }
      var self = this;
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          var tree = $("#treetable").fancytree("getTree");
          var node = tree.getActiveNode();
          if (node.children) {
            node.load(true).done(function () {
              node.setExpanded();
            });
          }
          self.loadrmProRiskList();
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
    loadrmProRiskList: function () {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRisk/list';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: this.row.id,
        pageSize: 500,
        pageNum: 1
      }
      this.model.save(opts, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          var $html = [];
          var rows = res.data.list;
          var reduceArr = [];
          reduceArr = _.filter(rows, function (item) {
            return !_.findWhere(self.selectedIncident, {
              id: item.id
            });
          })
          //console.log(reduceArr);
          _.each(reduceArr, function (item) {
            var incident = JSON.stringify(item);
            var str = `
                  <tr>
                  <td class="td-middle">${item.name}</td>
                  <td>
                    <div class="target-wrapper" id='target_${item.id}'>
                      
                    </div>
                  </td>
                  <td class="td-middle">
                    <a href="javascript:void(0)" data-incident='${incident}' class="btn btn-primary btn-add-target">新增风险指标</a>
                    <a href="javascript:void(0)" data-incident='${incident}' class="btn btn-danger btn-delete-incident">删除风险事件</a>
                  </td>
                </tr>
              `;
            $html.push(str);
          })
          self.selectedIncident = self.selectedIncident.concat(reduceArr);
          self.model.set({
            selected: self.selectedIncident
          });
          console.log(self.selectedIncident);
          $('#incidentListBody').append($html.join(''));
        }
      })
    },
    renderTDTargetData: function (rows, $incident) {
      if (!rows.length) return !1;
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/add';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var targetIds = _.map(rows, function (item) {
        return item.id;
      });
      var subData = {
        fid: $incident.id,
        targetid: targetIds.join(','),
        zblhcs: '',
        status: 1,
        result: ''
      };
      var self = this;
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          self.appendTargetTreeNodes($incident);
          self.loadrmProRiskTargetList($incident);
        }
      })
    },
    loadrmProRiskTargetList: function (data) {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/list';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var opts = {
        fid: data.id, //风险事件id
        pageNum: 1,
        pageSize: 500
      }
      this.model.save(opts, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          //console.log(data.id);
          var $html = [];
          _.each(res.data.list, function (item) {
            var target = JSON.stringify(item);
            var obj = `
            <div class='item' data-target='${target}'>
              <span>${item.name}</span>
              <em class='fa fa-close btn-delete-target'></em>
            </div>`;
            $html.push(obj);
          });
          $('#target_' + data.id).html($html.join(''));
        }
      })
    },
    deleteIncident: function (e) {
      var self = this;
      this.model.set({
        'selected': this.selectedIncident
      });

      var row = $(e.currentTarget).data('incident');
      var urlApi = API_URL + '/riskmodel/rmProRisk/remove/' + row.id;
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
            self.selectedIncident = _.filter(self.selectedIncident, function (item) {
              return item.id != row.id;
            });
            self.row.status = 6;
            self.handleChangeSingleStatus();
            //console.log(self.selectedIncident);
            self.model.set({
              'selected': self.selectedIncident
            });
            $(e.currentTarget).parent().parent().remove();
            self.removeIcidentNode(row);
            layer.close(index);

          }
        });
      }, function () {

      });
    },
    deleteTarget: function (e) {
      var self = this;
      var row = $(e.currentTarget).parent().data('target');
      var urlApi = API_URL + '/riskmodel/rmProRiskTarget/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      var $ele = $incident = $(e.currentTarget).parents('td').siblings('.td-middle').find('.btn-add-target');
      var $incident = $ele.data('incident');
      var $msg = '';
      if ($incident.status != 1 && $incident.status != 6) {
        $msg = '此因子与' + $incident.name + '事件有关联计算，会改变矩阵计算关系，确定要删除此项吗？'
      } else {
        $msg = '确定要删除此项吗？';
      }
      layer.confirm($msg, function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            //self.loadrmProRiskTargetList($incident);
            $incident.status = 6;
            self.handleChangeIncidentStatus($ele, $incident);
            //self.renderOperationTarget($ele, $incident);
            //self.removeTargetNode(row);
            $(e.currentTarget).parent().remove();
          }
        })
        layer.close(index);
      }, function () {

      })
    },
    removeIcidentNode: function (row) { //删除tree事件节点
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      //监听remove事件，向组件analyze中传参
      if (node.children) {
        var removeNode = _.find(node.children, function (item) {
          return item.data.id == row.id;
        });
        removeNode.remove();
      }
    },
    removeTargetNode: function (row) { //删除tree指标节点
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      if (node.children) {
        var removeNodeParent = _.find(node.children, function (item) {
          return item.data.id == row.fid;
        });
        //console.log(removeNodeParent);
        var removeNode = _.find(removeNodeParent.children, function (item) {
          return item.data.id == row.id;
        });
        removeNode.remove();
      }
    },
    reloadTreeTargetList: function () {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      if (node.children) {
        node.load(true).done(function () {
          node.setExpanded();
        });
      }
    },
    appendTargetTreeNodes: function (row) {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      if (node.children) {
        var nodeParent = _.find(node.children, function (item) {
          return item.data.id == row.id;
        });
        nodeParent.load(true).done(function () {
          nodeParent.setExpanded();
        });
      };
    },
    editSingleTreeNode: function () {
      var tree = $("#treetable").fancytree("getTree");
      var node = tree.getActiveNode();
      var $tdList = $(node.tr).find(">td");
      var row = JSON.stringify(this.row);
      var $html = `<div class='btn-item-box'>
        <button class='btn btn-info btn-single-edit' data-row='${row}'>编辑单项工程</button>
        <button class='btn btn-info btn-single-computed' data-row='${row}'>权重计算</button>
        <button class='btn btn-info btn-single-delete' data-row='${row}'>删除</button>
      </div>`;
      var statusTxt = this.handleStatusCol(this.row.status, this.row);
      $tdList.eq(4).text(statusTxt);
      $tdList.eq(5).html($html);
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
    cleanView: function () {
      if (this.incidentView) {
        this.incidentView.remove();
        var $html = `<div id="riskIncidentListTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
      if (this.targetView) {
        this.targetView.remove();
        var $html = `<div id="targetListTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
    },

  })
});