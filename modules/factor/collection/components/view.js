define([
  'jquery',
  'underscore',
  'backbone',
  'page/tools',
  'text!modules/factor/collection/components/tmpl.html',
  'modules/factor/collection/components/model',
  'modules/factor/collection/components/edit/edit'
], function ($, _, Backbone, tools, tmpl, Model, CollView) {
  'use strict';
  return Backbone.View.extend({
    el: '#colleWrapper',
    template: _.template(tmpl),
    initialize: function () {
      this.model = new Model();
      this.render();
      this.renderTable();
    },
    events: {
      'click .btn-search': 'searchHandle',
      'click .zdy-btn-add': 'handleModal',
      'click .zdy-btn-edit': 'handleModal',
      'click .zdy-btn-delete': 'delete'
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    renderTable: function () {
      var urlApi = API_URL + '/riskmodel/rmRisk/list';
      $('#listCollTable').bootstrapTable({
        url: urlApi,
        method: "post",
        toolbar: '', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        pageSize: 10,
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
            pageNum: params.pageNumber,
            pageSize: params.pageSize
          };
        },
        columns: [{
            field: "name",
            title: "风险事件名称"
          },
          {
            field: "cjsj",
            title: "创建时间"
          },
          {
            field: "sfsx",
            title: "是否生效",
            formatter: function (value) {
              return (value == '1' ? '是' : '否');
            }
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
					        	</div>&nbsp;&nbsp;</div>
					        	<div class='btn-group'>
					        	</div>`
              return v;
            }
          }
        ]
      })
    },
    searchHandle: function (e) {
      var value = $('#searchCollText').val();
      $('#listCollTable').bootstrapTable('refresh', {
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
        template: $('#editCollTmpl'),
        eleId: '#collForm',
        area: ['70%', '40%'],
        btn: ['确定', '取消'],
        param: {
          row: '1',
          view: true
        },
        success: function () {
          self.EleView = new CollView(row);
        },
        yes: function (obj, index, data) {
          row && (data.id = row.id);
          self.saveData(data, flag);
        },
        btn2: function () {
          layer.closeAll();
        }
      })
    },
    saveData: function (data, flag) {
      var subData = {
        name: data.name,
        sfsx: data.sfsx,
        bz: data.bz
      }
      var urlApi = API_URL + '/riskmodel/rmRisk/' + flag;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      if (flag == 'edit') subData.id = data.id;
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        layer.closeAll();
        $('#listCollTable').bootstrapTable('refresh');
      })
    },
    delete: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var urlApi = API_URL + '/riskmodel/rmRisk/remove/' + row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      layer.confirm('确定要删除此项吗？', function () {
        self.model.fetch().then(function (res) {
          if (res.code == 200) {
            layer.closeAll();
            $('#listCollTable').bootstrapTable('refresh');
          }
        })
      }, function () {

      })
    }
  })
});