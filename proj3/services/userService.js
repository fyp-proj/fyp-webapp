angular.module('userModule').service("userService", userService);

userService.$inject = [];

function userService() {

	var service = this;
	service.login = login;
	service.signUp = signUp;


	function login(username, password){
		return $http.post();
	}

	function signUp(firstName, lastName, email, password, confirmationPassword){
	  return $http.post();
  }
}
