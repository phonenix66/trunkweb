/**
 * 站点管理=》站点维护=》站点维护
 */
define("modules/system/password", ["jquery", "underscore", "page/tools", "jstree", "bootstrap-datepicker", "bootstrapvalidator", "icheck"], function ($, _, tools) {

	var page = function () { };
	page = {
		init: function (request) {

			var resourceUrl = `${tools.API_URL}/ewindsys/ewindUser`; //页面url地址

			/**
			 * 修改密码
			 */
			$(".zdy-btn-save").on("click", function () {
				$('form').data('bootstrapValidator').validate();
				var flag = $('form').data('bootstrapValidator').isValid();
				if (!flag) {
					return false;
				}

				var oldPassword = $("#oldPassword").val();
				var newPassword = $("#newPassword").val();
				var newPasswordConfirm = $("#newPasswordConfirm").val();
				if (newPassword !== newPasswordConfirm) {
					layer.msg("新密码和确认新密码不一致");
					return false;
				}

				$.ajax({
					type: "get",
					url: `${resourceUrl}/savePwd`,
					data: {
						oldPassword: oldPassword,
						newPassword: newPassword
					},
					async: true,
				}).then(function (data) {
					if (data.success == true) {
						window.location.href = "index.html";
					} else {
						layer.closeAll();
					}

				}, function () {
					console.log("请求错误");
				});
			});

			$(".zdy-btn-back").on("click", function () {
				window.location.reload();
			});


			$('form').bootstrapValidator({
				feedbackIcons: {
					valid: 'glyphicon glyphicon-ok',
					invalid: 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
				},
				fields: {
					oldPassword: {
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					newPassword: {
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					},
					newPasswordConfirm: {
						validators: {
							notEmpty: {
								message: '不能为空'
							}
						}
					}
				}
			});


		}
	}

	return page;
});