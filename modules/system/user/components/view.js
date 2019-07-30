define([
  'jquery',
  'underscore',
  'backbone',
  'modules/system/user/components/model',
  'page/tools',
  'text!modules/system/user/components/template/view.html',
  'modules/system/user/components/edit/edit',
], function ($, _, Backbone, Model, tools, tmpl, editView) {
  'use strict';
  return Backbone.View.extend({
    el: '#userWrapper',
    template: _.template(tmpl),
    events: {
      'click #searchBtn': 'searchHandle',
      'click #addUserBtn': 'userDataHandle',
      'click .zdy-btn-edit': 'userDataHandle'
    },
    initialize: function () {
      var urlApi = API_URL_SYS + '/sys/sysUser/list';
      this.model = new Model(urlApi);
      var opts = JSON.stringify({
        name: '',
        pageNum: 1,
        pageSize: 10,
        rolesId: ['']
      });
      this.render();
      /* this.model.save({
        data: opts
      }) */
    },
    render: function () {
      $(this.$el).html(this.template());
      $('#userlist').bootstrapTable('destroy');
      this.renderTable();
    },
    renderTable: function (searchName) {
      var urlApi = API_URL_SYS + '/sys/sysUser/list';
      $('#userlist').bootstrapTable({
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
            pageSize: params.pageSize,
            rolesId: ['']
          };
        },
        columns: [{
            field: "account",
            title: "员工账号"
          },
          {
            field: "name",
            title: "员工姓名"
          },
          {
            field: "roleName",
            title: "角色"
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
      var value = $('#searchUserText').val();
      $('#userlist').bootstrapTable('refresh', {
        query: {
          name: value
        }
      });
    },
    userDataHandle: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var flag = row ? 'edit' : 'add';
      console.log(row);
      tools.handleModal({
        title: row ? '编辑用户' : '新增用户',
        template: $('#editUserTmpl'),
        eleId: '#userEditForm',
        btn: ['确定', '取消'],
        success: function () {
          self.editView = new editView(row);
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
      var self = this;
      var subData = {
        account: data.account,
        email: "",
        mobile: data.mobile,
        name: data.name,
        orgid: "3",
        orgmc: "",
        password: data.password,
        remarks: data.remarks,
        roleIds: [data.roleIds],
        roleName: "",
        sfzh: data.sfzh,
        xzqhdm: "429000",
        zsxm: data.zsxm,
      }
      if (flag == 'edit') subData.id = data.id;
      this.model.urlApi = API_URL_SYS + '/sys/sysUser/' + flag;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        layer.closeAll();
        self.render();
      });
    },
    editUserData: function (e) {

    }
  })
});