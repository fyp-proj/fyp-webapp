angular.module('userModule').controller('userController',userController);

userController.$inject = ['$http', 'userService', '$window'];

function userController($http, userService, $window){

	var vm = this;

	//variables
  vm.username = '';
  vm.password = '';
  vm.firstName = '';
  vm.lastName = '';
  vm.email = '';
  vm.password = '';
  vm.passwordConfirmation = '';
  vm.signedIn = false;
  //functions
	vm.login = login;
	vm.signUp = signUp;
	vm.renderSignInButton = renderSignInButton;


	function login(){

		userService.login(vm.username, vm.password).then(function(resp){
		  if(resp.status == 'success' || true) {
        $window.location.replace("http://127.0.0.1:8081/homePage.html");
        alert(resp.data);
      }
		  else {
		    alert(resp.data);
      }
		});
	}

	function signUp(){

	  userService.signUp(vm.firstName, vm.lastName, vm.email, vm.password, vm.passwordConfirmation).then(function(resp){
	    if(resp.status == 'success'){
        $window.location.replace("http://127.0.0.1:8081/homePage.html");
        localStorage.setItem("key", resp.key);
        alert(resp.data);
      }
	    else{
	      alert(resp.data);
      }
    });
  }

  function newEl() {
    var po = document.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  }

  function renderSignInButton(){
    gapi.signin.render('signInButton',
      {
        'callback': $scope.signInCallback, // Function handling the callback.
        'clientid': '694512838327-iffqdmvptpi100gecq493hle2djsrbun.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
        'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                                                                          // as their explanation is available in Google+ API Documentation.
        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
        'cookiepolicy': 'single_host_origin'
      }
    );
  }



}
