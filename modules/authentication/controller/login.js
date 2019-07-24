$(function () {
	require(['modules/authentication/viewmodel'], function (ViewModel) {
		var viewmodel = new ViewModel();

		/* function keyLogin() {
			if (event.keyCode == 13) //回车键的键值为13
				login();
		} */

		$(document).on('keyup', '#inputPassword', function (event) {
			if (event.keyCode === 13) {
				login();
			}
		}).on('click', '#login', function () {
			login();
		})

		function login() {
			var account = $("#account").val();
			var pwd = $("#inputPassword").val();
			if (account == "") {
				alert("用户名不能为空");
			} else if (pwd == "") {
				alert("密码不能为空");

			} else {

				//var userprofile = viewmodel.getUserProfile(account, pwd);

				getUserProfile(account, pwd);

				//			debugger
				//			if(userprofile !== null) {
				//				sessionStorage.setItem('userprofile', JSON.stringify(userprofile));
				//				$("form").submit();
				//			} else {
				//				alert("用户名或密码不正确");
				//			}

			}
		}

		function getUserProfile(userid, pwd) {
			var result = null;
			var resourceUrl = API_URL + "/ewindsys/ewindUser";
			$.ajax({
				type: "post",
				url: `${resourceUrl}/login`,
				data: {
					username: userid,
					//loginName: userid,
					password: pwd
				},
				async: true,
				crossDomain: true,
				success: function (response) {
					sessionStorage.clear()
					sessionStorage.setItem('userprofile', JSON.stringify(response));
					window.location.href = "main.html";
					//					$("form").submit();

				},
				//				complete: function(XMLHttpRequest, textStatus) {
				//					debugger;
				//				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("用户名或密码不正确");
				}
			});

			return result;
		}

	}, undefined, true);
}());