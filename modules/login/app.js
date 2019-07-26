define([
  'doT',
  'jquery',
  'underscore',
  'Backbone',
  'text!view.html',
  'base64',
  "verify",
  "api", "apiConfig", "jquery.cookie"
], function (doT, $, _, Backbone, tpl, Base64) {
  'use strict';
  return Backbone.View.extend({
    el: '#mainwrap',
    template: doT.template(tpl),
    events: {
      'click #login': 'login',
      'keyup #inputPassword': 'enterLogin',
      'click #captcha_img': 'refreshImage'
    },
    initialize: function () {
      this.verifyFlag = false;
      this.random = sessionStorage.getItem('staticUser');
      if (this.random) {
        console.log(this.random);
      } else {
        this.random = Math.random();
        sessionStorage.setItem('staticUser', this.random);
      }
      this.render();
      //设置cookie
      this.getWebCookies();
      //this.renderVerifyDom();

    },
    render: function () {
      this.timeStamp = new Date().valueOf();
      $(this.$el).html(this.template());
    },
    refreshImage: function () {
      this.timeStamp = new Date().valueOf();
      document.getElementById('captcha_img').src = FILE_API_URL + "/kaptcha?key=" + this.timeStamp + "&random=" + this.random;
    },
    enterLogin: function (e) {
      if (e.keyCode === 13) {
        this.login();
      }
    },
    login: function () {
      var account = $("#account").val();
      var pwd = $("#inputPassword").val();
      if (account == "") {
        alert("用户名不能为空");
      } else if (pwd == "") {
        alert("密码不能为空");
      } else {
        this.getUserProfile(account, pwd);
      }
    },
    getUserProfile: function (userid, pwd, code) { //登录请求
      var self = this;
      $.ajax({
        type: "post",
        url: `${API_URL}/api/login`,
        data: JSON.stringify({
          account: userid,
          password: pwd
        }),
        contentType: 'application/json;charset=UTF-8',
        async: true,
        crossDomain: true,
        success: function (response) {
          //登录成功设置页面cookie
          self.setWebCookies(userid, pwd);
          sessionStorage.clear();
          //console.log(response);
          var data = response.data;
          var menuList = data.menuList;
          menuList = self.handleTreeData(data.menuList);
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('menuList', JSON.stringify(menuList));
          sessionStorage.setItem('userprofile', JSON.stringify(data));
          window.location.href = "main.html";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          var re = XMLHttpRequest.responseJSON;
          console.log(re);
          var massege = "系统错误";
          if (re) {
            massege = re.massege;
          }
          alert(massege);
        }
      });
    },
    handleTreeData: function (data) {
      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        item.href && (item.href = item.href + '.html');
        delete item.children;
      });
      console.log(data);
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
    setWebCookies: function (username, password) {
      var checkFalg = $('#rememberCheckBox').prop('checked');
      if (!checkFalg) {
        $.removeCookie('username', {
          path: '/'
        });
        $.removeCookie('password', {
          path: '/'
        });
        return !1;
      }
      $.cookie('username', username, {
        expires: 7
      });
      $.cookie('password', Base64.encode(password), {
        expires: 7
      })
    },
    getWebCookies: function () {
      var username = $.cookie('username');
      var pass = $.cookie('password');
      if (username && pass) {
        $("#account").val(username);
        $("#inputPassword").val(Base64.decode(pass));
        $("input[type='checkbox']").prop("checked", true);
      }
    },
    renderVerifyDom() {
      var self = this;
      $('#verifyRow').slideVerify({
        type: 2,
        vOffset: 5, //误差量，根据需求自行调整
        vSpace: 5, //间隔
        imgUrl: './images/verify/',
        imgName: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'],
        imgSize: {
          width: '350px',
          height: '150px',
        },
        blockSize: {
          width: '40px',
          height: '40px',
        },
        barSize: {
          width: '350px',
          height: '40px',
        },
        ready: function () {},
        success: function () {
          //alert('验证成功，添加你自己的代码！');
          $('.verify-msg:eq(1)').text('验证成功！');
          self.verifyFlag = true;
        },
        error: function () {
          alert('验证失败！');
        }
      })
    }
  })
});