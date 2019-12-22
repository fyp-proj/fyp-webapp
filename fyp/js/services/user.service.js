angular.module('App').service("userService", userService);

userService.$inject = ['$http'];

function userService($http) {

	var service = this;
	service.login = login;
	service.signUp = signUp;
	service.logOut = logOut;


	function login(email, password){
	  var loginObj = {email:email, password:password};
		return $http({
      method: 'POST',
      data: loginObj,
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/login'
    });
	}

	function signUp(firstName, lastName, email, password, confirmationPassword, role){
    var registerObj= {firstName: firstName, lastName:lastName, email:email, password:password, password_confirmation:confirmationPassword, roleId:role};
    return $http({
      method: 'POST',
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/register',
      data: registerObj,
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }

  function logOut(api_token){
    return $http({
      method: 'GET',
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/logout?api_token='+api_token,
      headers:{Authorization: "Bearer " + localStorage.getItem("apiToken")},
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }
}
