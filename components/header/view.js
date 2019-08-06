define([
  'jquery',
  'underscore',
  'backbone',
  'components/header/model',
  'text!components/header/template/tmpl.html',
  'components/nav/view',
  'components/menu/view',
  'layer'
], function ($, _, Backbone, Model, tmpl, DropDownView, MenuView) {
  'use strict';
  $.ajaxSetup({
    headers: {
      'token': sessionStorage.getItem("token")
    }
  })
  return Backbone.View.extend({
    el: '#mainnavbar',
    template: _.template(tmpl),
    events: {
      'click li.nav-main a': 'handle',
      'click #menu_pass': 'handlePassword',
      'click #menu_loginOut': 'logout'
    },
    initialize: function () {
      this.model = new Model();
      this.menuList = this.model.get('menuList');
      var self = this;
      self.render(this.menuList);
      //fix内容高度
      self.fixContentHeight();
    },
    render: function (menu) { //render一级目录
      var self = this;
      menu = _.filter(menu, function (item) {
        return (item.accessible == 1 && item.type == 1) || (item.accessible == 0 && item.type == 2);
      });
      var profile = this.model.get('userprofile');
      this.$el.html(this.template({
        list: menu,
        profile: profile
      }));
      $('#projectNav').hide();
      $('li.nav-main').eq(0).find('a').trigger('click');
      //this.dropview = new DropDownView();
    },
    handle: function (e) { //点击一级目录callback
      var $ele = $(e.currentTarget);
      var menuname = $ele.attr('menuname');
      $ele.parent().addClass('active').siblings().removeClass('active');
      var datamenu = $ele.data('menu');
      var url = $ele.attr('href');
      var moduleName = url.substring(0, url.lastIndexOf("."));
      var menu = {
        parentName: '',
        name: moduleName,
        href: url
      }

      $('#contentTop').show();
      if (datamenu.children) {
        $('#projectNav').show();
        if (menuname == '系统管理') {
          $('#projectNav').hide();
        }
        this.renderChildMenu(datamenu);
      } else {
        $('#projectNav').show();
        if (menuname == '首页') {
          $('#projectNav').hide();
          $('#contentTop').hide();
        }
        $('#contentTop .header-wrapper').empty();
        this.loadModule(menu);
      }
      return false;
    },
    renderChildMenu: function (params) { //render二级目录
      if (this.menuview) {
        this.menuview.render(params);
        return;
      }
      this.menuview = new MenuView(params);
    },
    logout: function () {
      sessionStorage.clear();
      window.location.href = "index.html";
    },
    handlePassword: function (e) {
      var self = this;
      $('#contentTop').hide();
      $('#projectNav').hide();
      var $ele = $(e.currentTarget);
      var url = $ele.attr('href');
      var moduleName = url.substring(0, url.lastIndexOf("."));
      var menu = {
        parentName: '',
        name: moduleName,
        href: url
      }
      this.loadModule(menu);
      return !1;
    },
    handleModule: function (moduleName, menu) {
      require([moduleName], function (mpage) {
        if (mpage && mpage.init) {
          mpage.init(menu);
        }
      });
    },
    loadModule: function (menu) {
      var self = this;
      console.log(menu.href);
      $.get(menu.href, function (data) {
        var html = [];
        html.push(data);
        var timestap = new Date().valueOf();
        html.push('<script src="' + menu.name + '.js?time=' + timestap + '" type="text/javascript" charset="utf-8"></script>');
        $("#content").html(html.join(""));
        self.handleModule(menu.name, menu);
      })
    },
    fixContentHeight: function () {
      var minHeight = $('.content-wrapper').css('min-height');
      //console.log(minHeight);
      $('.content-wrapper').css('height', minHeight);
    },
    listenMapHandle: function (param) {
      $('li.nav-main').each(function () {
        var menuid = $(this).find('a').attr('menuid');
        if (menuid == param.menuid) {
          $(this).find('a').trigger('click');
        }
      })
    },

  })
});