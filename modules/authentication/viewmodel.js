define(function() {

	function AuthViewModel() {}

	AuthViewModel.prototype.getUserProfile = function(userid, pwd) {
		var result = null;
	
		var resourceUrl = API_URL + "/ewindsys/ewindUser";
		$.ajax({
			type: "post",
			url: `${resourceUrl}/login`,
			data: {
				username: userid,
				password: pwd
			},
			async: false,
			success: function(response) {

				var userInfo = response;
				if(userInfo.status === true) {
					result = userInfo;

				}
			}
		});

		return result;
	};

	AuthViewModel.prototype.verifyUser = function() {

	};

	return AuthViewModel;
});