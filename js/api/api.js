// 开发环境
(function () {
  window.Api = function (opt) {
    if (!opt) {
      return;
    }
    if (opt.serviceName) {
      this.serviceName = opt.serviceName;
    } else {
      throw ('Api error: 必须输入serviceName');
    }
  };
  window.Api.prototype = {
    exec: function (opt, cb, type) {
      var url = this.serviceName;
      // var option = JSON.stringify(opt);
      $.ajax({
        url: url,
        type: type || 'GET',
        data: JSON.stringify(opt),
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        //contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        headers: {
          'token': sessionStorage.getItem("token")
        },
        success: function (res) {
          cb && cb(res);
        },
        error: function (error) {
          if (error.statusText === 'abort') {
            layer.msg('网络不给力，请检查网络环境！', {
              anim: 0
            });
          }
          console.log(error)
          if (error.responseText == "error/400") {
            layer.msg('400：请检查必填项是否未填写，以及数据是否合理。', {
              anim: 0
            });
          }
        }
      });
    },
    execForm: function (formData, cb) {
      var url = this.serviceName;
      $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        headers: {
          'sessionid': sessionStorage.getItem("sessionid")
        },
        success: function (res) {
          cb && cb(res);
        },
        error: function (error) {
          if (error.statusText === 'abort') {
            layer.msg('网络不给力，请检查网络环境！', {
              anim: 0
            });
          }
        }
      });
    }
  };
})();