define([
  'jquery',
  'underscore',
  'backbone',
  'text!components/menu/template/tmp_childmenu.html',
  'components/menu/model'
], function ($, _, Backbone, tmpl, Model) {
  'use strict';
  return Backbone.View.extend({
    el: '#contentTop',
    template: _.template(tmpl),
    events: {
      'click li.child': 'gotoPage'
    },
    initialize: function (data) {
      this.model = new Model();
      this.model.set({
        list: data.clist
      });
      this.render(data);
    },
    render: function (data) {
      this.$el.html(this.template({
        list: data.clist
      }));
      $('li.child').eq(0).find('a').trigger('click');
    },
    gotoPage: function (e) {
      var self = this;
      var $ele = $(e.currentTarget);
      $ele.addClass('active').siblings().removeClass('active');
      var url = $ele.find('a').attr('href');
      var moduleName = url.substring(0, url.lastIndexOf("."));
      var menu = {
        parentName: '',
        name: '',
        href: url
      }
      console.log(url);
      $.get(url, function (data) {
        var html = [];
        html.push(data);
        var timestap = new Date().valueOf();
        html.push('<script src="' + moduleName + '.js?time=' + timestap + '" type="text/javascript" charset="utf-8"></script>');
        $("#content").html(html.join(""));
        self.handleModule(moduleName, menu);
      })
    },
    handleModule: function (moduleName, menu) {
      require([moduleName], function (mpage) {
        if (mpage && mpage.init) {
          mpage.init(menu);
        }
      });
    }
  })
});