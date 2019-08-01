define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/system/role/components/edit/edit.html',
  'modules/system/role/components/edit/model'
], function ($, _, Backbone, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#editRoleTmpl',
    template: _.template(tmpl),
    events: {},
    initialize: function (row) {
      this.row = row;
      this.model = new Model();
      if (!this.row) {
        this.render();
      } else {
        this.getRowData();
      }

    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
      $('#jsMenuRole').height($('#editRoleTmpl').height() - 40);
      this.initData();
      this.validate();
    },
    initData: function () {
      var self = this;
      var urlApi = API_URL_SYS + '/sys/sysMenu/list';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save({
        pageSize: 500
      }).then(function (res) {
        self.treeData = self.handleTreeData(res.data.list);
        self.renderTree('jsMenuRole', self.treeData);
      })
    },
    getRowData: function () {
      var self = this;
      var urlApi = API_URL_SYS + '/sys/sysRole/' + this.row.id;
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.fetch().then(function (res) {
        if (res.code == 200) {
          self.row = res.data;
          self.render();
        }
      })
    },
    validate: function () {
      $('#roleEditForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: '角色名称不能为空'
              }
            }
          }
        }
      })
    },
    renderTree: function (id, treeData) {
      var self = this;
      $('#' + id).jstree('destroy');
      var plugins = ["dnd", "checkbox", "types", "wholerow"];
      var coreData = [{
        id: "0",
        text: "功能菜单",
        children: treeData
      }];
      self.treeInst = $('#' + id).jstree({
        core: {
          data: coreData,
          check_callback: false
        },
        checkbox: {
          three_state: true, // to avoid that fact that checking a node also check others
          whole_node: true, // to avoid checking the box just clicking the node 
          tie_selection: false // for checking without selecting and selecting without checking
        },
        "plugins": plugins
      }).on('loaded.jstree', function (obj, e) {
        e.instance.open_all();
        self.row && e.instance.check_node(self.row.menuid);
      }).on("activate_node.jstree", function (obj, e) {
        //console.log(obj, e);
        // self.rerenderTable(coreData, e);
      }).on('check_node.jstree uncheck_node.jstree', function (obj, e) {

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
    }
  })
});