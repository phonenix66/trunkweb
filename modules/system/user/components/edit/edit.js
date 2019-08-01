define([
  'jquery',
  'underscore',
  'backbone',
  'layer',
  'text!modules/system/user/components/edit/edit.html',
  'modules/system/user/components/edit/model',
  'bootstrapvalidator'
], function ($, _, Backbone, layer, tmpl, Model) {
  return Backbone.View.extend({
    el: '#editUserTmpl',
    template: _.template(tmpl),
    events: {
      'click #officeName': 'handle'
    },
    initialize: function (row) {
      var self = this;
      this.row = row;
      var urlApi = API_URL_SYS + '/sys/sysRole/list';
      this.model = new Model(urlApi);
      this.render();
      console.log(this.row);
      this.validate();
      this.model.save().then(function (res) {
        self.renderTreeRole(res.data.list);
      })
    },
    render: function () {
      $(this.$el).html(this.template({
        row: this.row
      }));
    },
    validate: function () {
      $('#userEditForm').bootstrapValidator({
        feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          account: {
            validators: {
              notEmpty: {
                message: '登录账号不能为空'
              }
            }
          },
          password: {
            validators: {
              notEmpty: {
                message: '密码不能为空'
              }
            }
          },
          roleIds: {
            validators: {
              notEmpty: {
                message: '角色不能为空'
              }
            }
          }
        }
      })
    },
    renderTreeRole: function (data) {
      var self = this;
      _.each(data, function (item) {
        item.text = item.name;
        item.parentId = 0;
        item.children = [];
      });
      $('#jstreeRole').jstree('destroy');
      var plugins = ["dnd", "checkbox", "types", "wholerow", "themes"];
      $('#jstreeRole').jstree({
        core: {
          data: data,
          check_callback: false,
          "themes": {
            "icons": false
          },
        },
        checkbox: {
          three_state: true, // to avoid that fact that checking a node also check others
          whole_node: true, // to avoid checking the box just clicking the node 
          tie_selection: false // for checking without selecting and selecting without checking
        },
        "plugins": plugins
      }).on('loaded.jstree', function (obj, e) {
        e.instance.open_all();
        self.row && e.instance.check_node(self.row.roleIds);
      }).on("activate_node.jstree", function (obj, e) {
        //console.log(obj, e);
      }).on('check_node.jstree uncheck_node.jstree', function (obj, e) {

      });
    },
    data: function () {
      var data = {
        account: "admin123",
        email: "",
        mobile: "",
        name: "fc",
        orgid: "3",
        orgmc: "",
        password: "admin",
        remarks: "",
        roleIds: ["2"],
        roleName: "",
        sfzh: "",
        xzqhdm: "429000",
        zsxm: "faas",
      }
    }
  })
})