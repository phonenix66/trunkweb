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
      $(this.$el).html(this.template({
        imgUrl: FILE_API_URL + "/kaptcha?key=" + this.timeStamp + "&random=" + this.random
      }));
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
      //var code = $('input[name="verifyCodeActual"]').val();
      var flag = this.verifyFlag;
      if (account == "") {
        alert("用户名不能为空");
      } else if (pwd == "") {
        alert("密码不能为空");
      } else if (!flag) {
        alert("验证失败!");
      } else {
        //this.verifyCodeActual(code);
        this.getUserProfile(account, pwd);
      }
    },
    verifyCodeActual: function (code) {
      //console.log(code);
    },
    getUserProfile: function (userid, pwd, code) { //登录请求
      var result = null;
      var self = this;
      var resourceUrl = API_URL + "/ewindsys/ewindUser";

      $.ajax({
        type: "post",
        url: `${resourceUrl}/login?`,
        data: {
          username: userid,
          password: pwd
        },
        async: true,
        crossDomain: true,
        success: function (response) {
          //登录成功设置页面cookie
          self.setWebCookies(userid, pwd);
          sessionStorage.clear();
          sessionStorage.setItem('sessionid', response.sessionid);
          sessionStorage.setItem('userprofile', JSON.stringify(response));
          //window.location.href = "main.html";
          //获取用户监管单位数据
          $.api.common.getDistUserInfo.exec({
            sessionid: response.sessionid
          }, function (res) {
            if (res.success) {
              sessionStorage.setItem('metadata', JSON.stringify(res.data));
              //过滤没有项目的数据
              var cityList = self.filterData(res.data);
              res.data.cityList = cityList;
              var userinfo = JSON.stringify(res.data);
              //console.log(userinfo);
              sessionStorage.setItem('userinfo', userinfo);
              window.location.href = "main.html";
            }
          })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          var re = XMLHttpRequest.responseJSON;
          console.log(re)
          var massege = "系统错误"
          if (re) {
            massege = re.massege
          }
          alert(massege);
          //self.refreshImage();
        }
      });
    },
    filterData: function (data) {
      /**
       * 1 过滤掉主管单位
       * 2 遍历市，refilter 返回有project的县
       * 3 过滤项目的市县
       */
      if (data.role == 0) {
        var element = {
          code: '0',
          id: new Date().valueOf(),
          name: '法人单位level-city',
          cells: [{
            code: '01',
            id: Math.floor(Math.random() * 1000000),
            name: '法人单位level-county',
            projects: data.projects
          }]
        }
        data.cityList = [element];
        return data.cityList;
      }
      _.each(data.cityList, function (a) {
        //主管单位没有code,设置为0
        if (!a.code) {
          a.code = "0";
        }
      });
      var list = _.chain(data.cityList).filter(function (a) {
        return a.cells || a.projects;
      }).each(function (a) {
        var refilter = _.filter(a.cells, function (b) {
          return b.projects;
        })
        a.cells = refilter;
      }).value();
      //县级主管单位，普通法人
      //console.log(list);
      if (data.role == 8) {
        return list;
      };
      //省，市监管单位
      list = _.chain(list).filter(function (a) {
        return a.projects;
      }).value();

      return list;
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