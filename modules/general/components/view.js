define([
  'jquery',
  'underscore',
  'backbone',
  'modules/general/components/model',
  'text!modules/general/components/tmpl.html',
  './detail/view',
  './edit/view',
  'serializeJSON',
  'jquery.fancytree',
  'jquery.fancytree.dnd5',
  'jquery.fancytree.glyph',
  'jquery.fancytree.table',
  'jquery.fancytree.wide',
], function ($, _, Backbone, Model, tmpl, GeneralAnal, GeneralEditor) {
  'use strict';
  return Backbone.View.extend({
    el: '#generalWrapper',
    template: _.template(tmpl),
    events: {
      'click .zdy-btn-edit,.zdy-btn-add': 'handleGeneral',
      'click .zdy-btn-detail': 'handleDetail',
      'click .zdy-btn-delete': 'deleteGeneral'
    },
    initialize: function () {
      this.model = new Model();
      this.render();
      this.renderTable();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    renderTable: function () {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmProMain/list';
      $('#listGeneralTable').bootstrapTable({
        url: urlApi,
        method: "post",
        toolbar: '', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        pageSize: 10,
        height: $('.general-inner').height() - 54,
        pageNumber: 1,
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
            type: 2,
            pageNum: params.pageNumber,
            pageSize: params.pageSize
          };
        },
        columns: [{
            field: "name",
            title: "单项风险工程名称"
          },
          {
            field: 'type',
            title: '工程类型',
            formatter: function (value) {
              return '单项工程';
            }
          },
          {
            field: "status",
            title: "状态",
            formatter: self.formatterStatus
          },
          {
            field: 'result',
            title: '结果'
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
    handleGeneral: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      layer.open({
        type: 1,
        title: row ? '编辑' : '新增',
        content: $('#editGeneralTmplWrap'),
        area: ['60%', '50%'],
        btn: ['确定', '取消'],
        success: function () {
          self.generalEditor = new GeneralEditor(row);
        },
        yes: function (i, layero) {
          self.saveData(row);
        },
        btn2: function (i, layero) {
          layer.close(i);
          self.cleanView();
        },
        cancel: function (i) {
          layer.close(i);
          self.cleanView();
        }
      })
    },
    handleDetail: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var flag = row ? 'edit' : 'add';
      layer.open({
        type: 1,
        title: '风险分析-' + row.name,
        content: $('#generalDetailTmpl'),
        area: ['70%', '80%'],
        btn: ['确定', '取消'],
        success: function () {
          self.generalAnal = new GeneralAnal(row);
        },
        yes: function (i, layero) {
          layer.close(i);
          self.cleanView();
        },
        btn2: function (i, layero) {
          layer.close(i);
          self.cleanView();
        },
        cancel: function (i, layero) {
          layer.close(i);
          self.cleanView();
        }
      })
    },
    saveData: function (row) {
      var self = this;
      var data = $("#grEditForm").serializeJSON();
      var subData = {
        name: data.name,
        type: 2,
        bz: data.bz,
        status: row ? row.status : 1 //未输入值
      }
      if (row) {
        subData.id = row.id;
      }
      var urlApi = API_URL + '/riskmodel/rmProMain/' + (row ? 'edit' : 'add');
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData).then(function (res) {
        if (res.code == 200) {
          layer.closeAll();
          $('#listGeneralTable').bootstrapTable('refresh');
        }
      })
    },
    deleteGeneral: function (e) {
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
            $('#listGeneralTable').bootstrapTable('refresh');
          }
        })
      }, function () {

      })
    },
    formatterStatus: function (value) {
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
    },
    cleanView: function () {
      if (this.generalAnal) {
        this.generalAnal.remove();
        var $html = `<div id="generalDetailTmpl"></div>`;
        $('#generalWrapper').append($html);
      }
      if (this.generalEditor) {
        this.generalEditor.remove();
        var $html = `<div id="editGeneralTmplWrap"></div>`;
        $('#generalWrapper').append($html);
      }
    }
  })
});