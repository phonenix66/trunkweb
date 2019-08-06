define([
  'jquery',
  'underscore',
  'backbone',
  'modules/general/components/model',
  'text!modules/general/components/tmpl.html'
], function ($, _, Backbone, Model, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#generalWrapper',
    template: _.template(tmpl),
    events: {},
    initialize: function () {
      this.model = new Model();
      this.render();
      this.renderTable();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    renderTable: function () {
      var urlApi = API_URL + '/riskmodel/rmProMain/list';
      $('#listGeneralTable').bootstrapTable({
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
            title: "状态"
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
    }
  })
});