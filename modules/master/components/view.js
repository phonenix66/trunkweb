define([
  'jquery',
  'underscore',
  'backbone',
  'page/tools',
  'modules/master/components/model',
  'text!modules/master/components/tmpl.html',
  'modules/master/components/edit/edit',
  'modules/master/components/analyze/analyze',
  'jquery.fancytree',
  'jquery.fancytree.dnd5',
  'jquery.fancytree.glyph',
  'jquery.fancytree.table',
  'jquery.fancytree.wide',
], function ($, _, Backbone, tools, Model, tmpl, MasterEditView, AnalyzeView) {
  'use strict';
  return Backbone.View.extend({
    el: '#masterWrapper',
    template: _.template(tmpl),
    events: {
      'click .btn-search': 'searchHandle',
      'click .zdy-btn-add': 'handleModal',
      'click .zdy-btn-edit': 'handleModal',
      'click .zdy-btn-delete': 'delete',
      'click .zdy-btn-detail': 'riskAnalyze'
    },
    initialize: function () {
      var urlApi = '';
      this.urlApi = urlApi;
      this.model = new Model();
      this.analyzeView = null;
      this.render();
      this.renderTable();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    renderTable: function () {
      var urlApi = API_URL + '/riskmodel/rmProMain/list';
      $('#listMasterTable').bootstrapTable({
        url: urlApi,
        method: "post",
        toolbar: '', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        pageSize: 10,
        pageNumber: 1,
        height: $('.master-inner').height() - 54,
        dataType: "json",
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        uniqueId: "id",
        queryParamsType: '',
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        responseHandler: function (res) {
          return {
            total: res.data.total,
            rows: res.data.list
          }
        },
        queryParams: function (params) { //请求服务器发送的参数
          return {
            name: params.searchText || '',
            type: 0,
            pageNum: params.pageNumber,
            pageSize: params.pageSize
          };
        },
        columns: [{
            field: "name",
            title: "风险工程名称"
          },
          {
            field: 'type',
            title: '工程类型',
            formatter: function (value) {
              return '总工程';
            }
          },
          {
            field: "status",
            title: "状态",
            formatter: function (value) {
              if (value == 1) {
                return '未输入值';
              } else if (value == 2) {
                return '未计算权重';
              } else if (value == 3) {
                return '验证未通过';
              } else if (value == 4) {
                return '验证通过';
              } else if (value == 5) {
                return '已输入量化指标值，未计算权重';
              } else if (value == 6) {
                return '矩阵关系发生变化，请重新输入';
              }
            }
          },
          {
            field: 'result',
            title: '结果'
          },
          {
            field: 'cr',
            title: '数值(CR)'
          },
          {
            field: "cjsj",
            title: "创建时间"
          },
          {
            field: "3",
            title: "操作",
            formatter: function (value, row, index) {
              row = JSON.stringify(row);
              var v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-edit' data-row='${row}'>修改</button>
					        	&nbsp;&nbsp;</div>
					        	<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-delete'  data-row='${row}'>删除</button>
					        	&nbsp;&nbsp;</div>
                    <div class='btn-group'>
                    <button type='button' class='btn btn-info zdy-btn-detail'  data-row='${row}'>风险分析</button>
					        	</div>`
              return v;
            }
          }
        ]
      })
    },
    searchHandle: function () {
      var value = $('#searchMasterText').val();
      $('#listMasterTable').bootstrapTable('refresh', {
        query: {
          name: value
        }
      });
    },
    handleModal: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var flag = row ? 'edit' : 'add';
      tools.handleModal({
        title: row ? '编辑' : '新增',
        template: $('#editMasterTmpl'),
        eleId: '#msEditForm',
        area: ['70%', '40%'],
        btn: ['确定', '取消'],
        param: {
          row: '1',
          view: true
        },
        success: function () {
          if (self.masterEditView) {
            self.masterEditView = null;
          }
          self.masterEditView = new MasterEditView(row);
        },
        yes: function (obj, index, data) {
          //row && (data.id = row.id);
          if (row) {
            data.id = row.id;
            data.status = row.status || 1;
          }
          self.saveData(data, flag);

        },
        btn2: function () {
          layer.closeAll();
          self.cleanView();
        }
      })
    },
    saveData: function (data, flag) {
      console.log(data);
      var self = this;
      var subData = {
        name: data.name,
        bz: data.bz,
        type: 0,
        status: data.status || 1
      }
      var urlApi = API_URL + '/riskmodel/rmProMain/' + flag;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      if (flag == 'edit') {
        subData.id = data.id;
      }
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        layer.closeAll();
        self.cleanView();
        $('#listMasterTable').bootstrapTable('refresh');
      })
    },
    delete: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var urlApi = API_URL + '/riskmodel/rmProMain/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      layer.confirm('确定要删除此项吗？', function () {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            layer.closeAll();
            $('#listMasterTable').bootstrapTable('refresh');
          }
        })
      }, function () {

      })
    },
    riskAnalyze: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      layer.open({
        type: 1,
        title: '风险分析-' + row.name,
        content: $('#editAnalyzeTmpl'),
        area: ['70%', '80%'],
        btn: ['确定', '取消'],
        success: function (layero, index) {
          if (self.analyzeView) {
            self.analyzeView = null;
          }
          self.analyzeView = new AnalyzeView(row);
        },
        yes: function (index, layero) {
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
    cleanView: function () {
      if (this.analyzeView) {
        this.analyzeView.remove();
        var $html = `<div id="editAnalyzeTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
      if (this.masterEditView) {
        this.masterEditView.remove();
        var $html = `<div id="editMasterTmpl"></div>`;
        $('#masterWrapper').append($html);
      }
    }
  })
});