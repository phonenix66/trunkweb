define([
  'jquery',
  'underscore',
  'backbone',
  'modules/system/role/components/model',
  'text!modules/system/role/components/template/view.html',
  'page/tools',
  'modules/system/role/components/edit/edit',
], function ($, _, Backbone, Model, tmpl, tools, editView) {
  'use strict';
  return Backbone.View.extend({
    el: '#roleWrapper',
    template: _.template(tmpl),
    events: {
      'click .zdy-btn-add': 'handleModal',
      'click .zdy-btn-edit': 'handleModal',
      'click .zdy-btn-delete': 'delete'
    },
    initialize: function () {
      this.model = new Model();
      this.initData();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    initData: function () {
      this.render();
      this.renderTable();
    },
    renderTable: function (searchName) {
      var urlApi = API_URL + '/sys/sysRole/list';
      $('#rolelist').bootstrapTable('destroy');
      $('#rolelist').bootstrapTable({
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
          console.log(params);
          return {
            name: params.searchText || '',
            pageNum: params.pageNumber,
            pageSize: params.pageSize
          };
        },
        columns: [{
            field: "name",
            title: "角色名称"
          },
          {
            field: "roleType",
            title: "角色类型"
          },
          {
            field: "remarks",
            title: "角色"
          },
          {
            field: 'createDate',
            title: '创建时间'
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
    handleModal: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var flag = row ? 'edit' : 'add';
      tools.handleModal({
        title: row ? '编辑角色' : '新增角色',
        template: $('#editRoleTmpl'),
        eleId: '#roleEditForm',
        btn: ['确定', '取消'],
        param: {
          row: '1',
          view: true
        },
        success: function () {
          self.editView = new editView(row);
        },
        yes: function (obj, index, data) {
          var mids = $('#jsMenuRole').jstree("get_checked", null, true);
          data.mids = mids.join(',');
          row && (data.id = row.id);
          self.saveData(data, flag);
        },
        btn2: function () {
          layer.closeAll();
        }
      })
    },
    saveData: function (data, flag) {
      var self = this;
      var subData = {
        createBy: "",
        createDate: "",
        delFlag: "",
        id: data.id || '',
        mids: data.mids,
        name: data.name,
        remarks: data.remarks,
        roleType: data.roleType,
        updateBy: "",
        updateDate: "",
        useable: ""
      }
      if (flag == 'edit') {
        subData.id = data.id;
        subData.delFlag = "0";
        subData.useable = "1";
      }
      this.model.urlApi = API_URL + '/sys/sysRole/' + flag;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        layer.closeAll();
        self.initData();
      });
    }
  })
});