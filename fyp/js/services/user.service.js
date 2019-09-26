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
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/login'
    });
	}

	function signUp(firstName, lastName, email, password, confirmationPassword){
    var registerObj= {firstName: firstName, lastName:lastName, email:email, password:password, password_confirmation:confirmationPassword};
    return $http({
      method: 'POST',
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/register',
      data: registerObj,
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }

  function logOut(api_token){
    return $http({
      method: 'POST',
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/logout',
      data: {api_token: api_token},
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }
}
