define([
  'jquery',
  'underscore',
  'backbone',
  'layer',
  'text!modules/system/menu/components/edit/edit.html',
], function ($, _, Backbone, layer, tmpl) {
  'use strict';
  return Backbone.View.extend({
    el: '#editTmpl',
    template: _.template(tmpl),
    events: {
      'click #officeName': 'handle'
    },
    initialize: function (data, select, row) {
      this.selectItem = select;
      this.treeData = data;
      this.row = row;
      console.log(row);
      this.render();
      this.validate();
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
      $('#officeId').val(this.selectItem.id);
      $('#officeName').val(this.selectItem.name || this.selectItem.text);
    },
    renderTree() {
      var self = this;
      var plugins = ["dnd", "search", "types", "wholerow"];
      var data = [{
        id: "0",
        text: "功能菜单",
        children: this.treeData
      }];
      $('#menuJstree').jstree('destroy');
      $('#menuJstree').jstree({
        core: {
          data: data
        },
        "check_callback": true,
        "checkbox": {
          "keep_selected_style": false
        },
        "plugins": plugins
      }).on('loaded.jstree', function (obj, e) {
        e.instance.open_all();
        e.instance.select_node(self.selectItem);
      }).on("activate_node.jstree", function (obj, e) {
        self.selectItem = e.node;
      });
    },
    validate: function () {
      $('#menuEditForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          name: {
            validators: {
              notEmpty: {
                message: '菜单名称不能为空'
              }
            }
          }
        }
      })
    },
    handle: function () {
      //查询出菜单树的数据
      var self = this;
      var index = layer.open({
        type: 1,
        title: '选择父级菜单',
        shade: 0,
        content: $('#menuJstree'),
        area: ['30%', '60%'],
        btn: ['确定', '取消'],
        success: function () {
          self.renderTree();
        },
        yes: function (index) {
          $('#officeId').val(self.selectItem.id);
          $('#officeName').val(self.selectItem.text || this.selectItem.name);
          layer.close(index);
        },
        cancel: function () {
          $('#menuJstree').jstree('destroy');
        },
        btn2: function (index) {
          $('#menuJstree').jstree('destroy');
        }
      })
    }
  })
});