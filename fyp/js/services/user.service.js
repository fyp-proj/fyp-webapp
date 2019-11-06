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
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/login'
    });
	}

	function signUp(firstName, lastName, email, password, confirmationPassword){
    var registerObj= {firstName: firstName, lastName:lastName, email:email, password:password, password_confirmation:confirmationPassword};
    return $http({
      method: 'POST',
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/register',
      data: registerObj,
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }

  function logOut(api_token){
    return $http({
      method: 'GET',
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/logout?api_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3Q6ODAwMFwvYXBpXC9sb2dpbiIsImlhdCI6MTU2OTE4MDk3OCwiZXhwIjoxNTY5MTg0NTc4LCJuYmYiOjE1NjkxODA5NzgsImp0aSI6IlZIS2JKWlZqZ2FJR2thUDgiLCJzdWIiOjEsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.H8CqMP5d3bM2AOXaKC7BZc0MgEMHLCC5REzBIp8K1ZI',
      headers:{Authorization: "Bearer " + localStorage.getItem("apiToken")},
      headers: {'Content-Type': 'application/json',  'Access-Controle-Allow-Origin':'*',}
    });
  }
}
