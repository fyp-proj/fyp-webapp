angular.module('userModule').controller('userController',userController);

userController.$inject = ['$http', 'userService', '$window'];

function userController($http, userService, $window){

	var vm = this;

	//variables
  vm.username = '';
  vm.password = '';
  //functions
	vm.login = login;


	function login(){

		userService.login(vm.username, vm.password).then(function(resp){
		  if(resp.status == 'success') {
        localStorage.setItem("key", resp.key);
        $window.location.replace("http://127.0.0.1:8081/proj3/sign-in.htmlu");
      }
		  else {
		    alert('your username or password is incorrect! please try again');
      }
		});
	}

}
