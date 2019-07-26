(function () {
	// 统一接口配置
	$.api = {
		/*公共*/
		common: {
			getProjectList: new Api({
				serviceName: './components/nav/data/project.json'
			}),
			//登录
			loginApp: new Api({
				serviceName: `${API_URL}/ewindsys/ewindUser/login`
			}),
			//获取地区市用户信息
			getDistUserInfo: new Api({
				serviceName: `${API_URL}/project_info/projectMenu`
			})
		},
		//用户管理
		user: {
			getUserList: new Api({
				serviceName: `${API_URL}/`
			})
		}
	};
})();





// $.api.projectInfo.overview.exec(data,function(res){

// })