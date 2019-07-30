define([
  'jquery',
  'underscore',
  'backbone',
  'layer',
  'text!modules/system/user/components/edit/edit.html',
  'bootstrapvalidator'
], function ($, _, Backbone, layer, tmpl) {
  return Backbone.View.extend({
    el: '#editUserTmpl',
    template: _.template(tmpl),
    events: {
      'click #officeName': 'handle'
    },
    initialize: function (row) {
      this.row = row;
      this.render();
      this.validate();
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