define([
  'jquery',
  'underscore',
  'backbone',
  'page/tools',
  'modules/system/menu/components/model',
  'text!modules/system/menu/components/template/view.html',
  'text!modules/system/menu/components/edit/edit.html',
  'modules/system/menu/components/edit/edit',
  'bootstrapvalidator'
], function ($, _, Backbone, tools, Model, tmpl, editTmpl, editView) {
  'use strict';
  return Backbone.View.extend({
    el: '#menuWrapper',
    template: _.template(tmpl),
    events: {
      'click .zdy-btn-add': 'handleModal',
      'click .zdy-btn-edit': 'handleModal',
      'click .zdy-btn-delete': 'delete'
    },
    initialize: function () {
      this.render();
      this.initData();
    },
    render: function () {
      $(this.$el).html(this.template());
    },
    initData: function () {
      var self = this;
      var urlApi = API_URL_SYS + '/sys/sysMenu/list';
      this.model = new Model(urlApi);
      this.model.clear();
      this.model.save({
        pageSize: 500
      }).then(function (res) {
        var data = self.handleTreeData(res.data.list);
        self.treeData = data;
        self.renderMenuTree('chooseMenuTree', data);
        self.renderTable(data);
      });
    },
    handleTreeData: function (data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        item.text = item.name;
        item.href && (item.href = item.href + '.html');
        delete item.children;
      });
      // console.log(data);
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        map[item.id] = item;
      });
      //console.log(map);
      var menus = [];
      data.forEach(function (item) {
        // 以当前遍历项的parentId,去map对象中找到索引的id
        var parent = map[item.parentId];
        //如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          //如果没有在map中找到对应的索引ID,那么直接把当前的item添加到 val结果集中，作为顶级
          menus.push(item);
        }
      })
      //console.log(menus);
      return menus;
    },
    renderMenuTree: function (id, treeData) {
      //查询出菜单树的数据
      var self = this;
      $('#' + id).jstree('destroy');
      var plugins = ["dnd", "search", "types", "wholerow"];
      var coreData = [{
        id: "0",
        text: "功能菜单",
        children: treeData
      }];
      //this.treeData = coreData;
      $('#' + id).jstree({
        core: {
          data: coreData
        },
        "check_callback": true,
        "checkbox": {
          "keep_selected_style": false
        },
        "plugins": plugins
      }).on('loaded.jstree', function (obj, e) {
        e.instance.open_all();
        e.instance.select_node(self.selectItem || coreData[0]);
      }).on("activate_node.jstree", function (obj, e) {
        self.rerenderTable(coreData, e);
      }).on('select_node.jstree', function (obj, e) {
        self.rerenderTable(coreData, e);
      });
    },
    renderTable: function (data) {
      var self = this;
      $('#menuTable').bootstrapTable({
        data: data,
        toolbar: '', //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        pageSize: 20,
        pageNumber: 1,
        dataType: "json",
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true, //是否显示分页（*）
        sortable: false, //是否启用排序
        sortOrder: "asc", //排序方式
        uniqueId: "id",
        queryParamsType: '',
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
        responseHandler: function (res) {
          return {
            total: res.data.total,
            rows: res.data.list
          }
        },
        columns: [{
            field: "name",
            title: "菜单名称"
          },
          {
            field: "href",
            title: "路径"
          },
          {
            field: "parentId",
            title: "上级菜单",
            formatter: function (i, row) {
              if (row.parentId == 0) {
                return '功能菜单';
              };
              return '功能菜单/' + self.selectItem.name;
            }
          },
          {
            field: "3",
            title: "操作",
            formatter: function (value, row, index) {
              var rowJson = JSON.stringify(row);
              var v = `<div class='btn-group'>
					        	<button type='button' class='btn btn-info zdy-btn-edit' data-row='${rowJson}'>修改</button>
					        	&nbsp;&nbsp;</div>
                    </div>`;
              if (!row.children) {
                v = v + `<div class='btn-group'>
                      <button type='button' class='btn btn-info zdy-btn-delete'  data-row='${rowJson}'>删除</button>
                      </div>&nbsp;&nbsp;</div>
                      <div class='btn-group'>`;
              }
              return v;
            }
          }
        ]
      })
    },
    rerenderTable: function (coreData, e) {
      var self = this;
      $('#menuTable').bootstrapTable('destroy');
      var data = _.find(self.treeData, function (item) {
        return e.node.id == item.id;
      });
      if (e.node.id == 0) {
        data = coreData[0];
      }
      self.selectItem = data;
      self.renderTable(data ? data.children : []);
    },
    handleModal: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      var flag = row ? 'edit' : 'add';
      tools.handleModal({
        title: row ? '编辑菜单' : '新增菜单',
        template: $('#editTmpl'),
        eleId: '#menuEditForm',
        btn: ['确定', '取消'],
        param: {
          row: '1',
          view: true
        },
        success: function () {
          self.editView = new editView(self.treeData, self.selectItem, row);
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
        href: data.url,
        icon: data.img || 'abc',
        id: data.id,
        isIconMenu: false,
        name: data.name,
        parentId: data.parentId,
        sort: 0,
        type: "1"
      }
      this.model.urlApi = API_URL_SYS + '/sys/sysMenu/' + flag;
      this.model.urlRoot();
      this.model.clear();
      this.model.save(subData, {
        patch: true
      }).then(function (res) {
        self.initData();
        layer.closeAll();
      });
    },
    delete: function (e) {
      var self = this;
      var row = $(e.currentTarget).data('row');
      layer.confirm('确定要删除此项吗？', function () {
        self.model.urlApi = API_URL_SYS + '/sys/sysMenu/edit';
        self.model.urlRoot();
        self.model.clear();
        row.delFlag = "1";
        self.model.save(row).then(function (res) {
          if (res.code) {
            self.initData();
            layer.closeAll();

          }
        })
      }, function (index) {

      })
    }
  })
});