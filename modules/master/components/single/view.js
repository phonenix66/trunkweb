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

      this.render();
      this.validate();
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
          self.renderTDTargetData(targetChecked, $incident);
          layer.close(index);
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
        riskid: riskid.join(',')
      }
      var self = this;
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          self.loadrmProRiskList();
        }
      })
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
          _.each(rows, function (item) {
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
          });
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
        status: '',
        result: ''
      };
      var self = this;
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
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
          console.log(data.id);
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
      var row = $(e.currentTarget).data('incident');
      var urlApi = API_URL + '/riskmodel/rmProRisk/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      layer.confirm('确定要删除此项吗？', function (index) {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            $(e.currentTarget).parent().parent().remove();
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
      layer.confirm('确定要删除此项吗？', function (index) {
        self.model.fetch().then(function (res) {
          console.log(row, res);
          if (res.code == 200) {
            $(e.currentTarget).parent().remove();
          }
        })
        layer.close(index);
      }, function () {

      })

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
    }
  })
});