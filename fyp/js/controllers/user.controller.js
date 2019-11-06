 angular.module('userModule').controller('userController',userController);

userController.$inject = ['$http', 'userService', '$window'];

function userController($http, userService, $window){

  var vm = this;
  vm.username = '';
  vm.password = '';
  vm.firstName = '';
  vm.lastName = '';
  vm.email = '';
  vm.password = '';
  vm.passwordConfirmation = '';
  vm.signedIn = false;
  vm.gmail = {
    username:'',
    email:''
  };
  //functions
  vm.login = login;
  vm.signUp = signUp;
  vm.onGoogleLogin = onGoogleLogin;

  function onLoadFunction (){
    gapi.client.setApiKey('AIzaSyC7_U_Ugdo37Iibke1NjzdFSomANF2PeVk');
    gapi.client.load('plus', 'v1', function (){})
  }

  function onGoogleLogin(){
    var params ={
      'clientid': '694512838327-iffqdmvptpi100gecq493hle2djsrbun.apps.googleusercontent.com',
      'cookiepolicy': 'single_host_origin',
      'callback' : function(result){
        if(result['status']['signed-in']){
          var request = gapi.client.plus.people.get(
            {
              'userId' :'me'
            }
          );
          request.execute(function(resp){
            vm.$apply = function(){
              vm.resp = resp;
              vm.gmail.username =resp.displayName ;
              vm.gmail.email = resp.emails[0].value;
            }
          })
        }
      },
      'approvalprompt': 'force',
      'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
    };
    gapi.auth.signIn(params);

  }

  function login(){

    userService.login(vm.username, vm.password).then(function(resp){
      if(resp.data.status == 'success') {
        alert(resp.data.message);
        $window.location.href = "/homePage.html";
      }
      else {
        alert(resp.data.error);
      }
    });
  }

  function signUp(){
    userService.signUp(vm.firstName, vm.lastName, vm.email, vm.password, vm.passwordConfirmation).then(function(resp){
      if(resp.data.status == 'success'){
        $window.location.href = "/homePage.html";
        localStorage.setItem("api_token", resp.api_token);
        alert(resp.data.message);
      }
      else{
        alert(resp.data.error);
      }
    });
  }

  function logout(){
    var api_token = localStorage.getItem("api_token");
    userService.logout(api_token).then(function(resp){
      if(resp.data.status == 'success'){
        localStorage.removeItem("api_token");
        alert(resp.data.message);
        $window.location.href= "/sign-in.html";
      }
      else{
        alert(resp.data.message);
      }
    });
  }

}
