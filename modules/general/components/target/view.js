define([
  'jquery',
  'underscore',
  'backbone',
  'text!modules/master/components/target/tmpl.html',
  'modules/master/components/target/model',
  'icheck'
], function ($, _, Backbone, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#targetListTmplWrap',
    template: _.template(tmpl),
    initialize: function (row) {
      this.row = row;
      console.log(this.row);
      this.model = new Model();
      this.targetChecked = [];
      this.targetChecked = this.model.get('targetChecked');
      this.render();
      //this.setiCheck();
      this.getTargetList();
    },
    render: function (rows) {
      $(this.$el).html(this.template({
        rows: rows || []
      }));
    },
    setiCheck: function () {
      var self = this;
      $('input.target-check').iCheck({
        checkboxClass: 'icheckbox_square-green'
      }).on('ifChecked', function (e) {
        var item = $(e.currentTarget).data('item');
        self.targetChecked.push(item);
        self.model.set({
          targetChecked: self.targetChecked
        });
      }).on('ifUnchecked', function (e) {
        var item = $(e.currentTarget).data('item');
        _.each(self.targetChecked, function (ele, i) {
          if (item.id == ele.id) {
            self.targetChecked.splice(i, 1);
          }
        });
        self.model.set({
          targetChecked: self.targetChecked
        })
      })
    },
    getTargetList: function () {
      var self = this;
      var urlApi = API_URL + '/riskmodel/rmTarget/notSelectedList';
      this.model.urlApi = urlApi;
      this.model.urlRoot();
      this.model.clear();
      this.model.save({
        fid: this.row.id, //事件id
        pageNum: 1,
        pageSize: 500
      }, {
        patch: true
      }).then(function (res) {
        if (res.code == 200) {
          self.render(res.data.list);
          self.setiCheck();
        }
      })
    },

  })
});