angular.module("App",['main']);

angular.module("main",[]);
angular.module("main").controller("mainController",mainController );
    // Controller body
 mainController.$inject=['$http', '$window', 'userService', 'authorsProjectsService'];

 function mainController($http, $window, userService, authorsProjectsService) {
   var vm = this;
   vm.username = '';
   vm.password = '';
   vm.firstName = '';
   vm.lastName = '';
   vm.email = '';
   vm.password = '';
   vm.passwordConfirmation = '';
   vm.signedIn = false;
   vm.role = 0;
   vm.gmail = {
     username:'',
     email:''
   };

   //functions
   vm.login = login;
   vm.signUp = signUp;
   vm.logout = logout;
   vm.onGoogleLogin = onGoogleLogin;

   vm.key = localStorage.getItem("apiToken");

   function firebaseDataService() {
     var root = firebase.database().ref();
     var service = {
         root: root,
         requests: root.child('requests')
     };
     return service;
   }
   function getRequestsByUser(uid) {
    if (!requests) {
        requests = $firebaseArray(firebaseDataService.requests.child(uid).child('userRequests'));
    }
    return requests;
   }

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
                      vm.gmail.username =resp.displayName ;
                      vm.gmail.email = resp.emails[0].value;
                  }
              })
            }
        },
        'approvalprompt': 'force',
        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
      };
      gapi.auth.signIn(params); //use new api from moustafa
      $window.location.href = "/homePage.html";

   }

   function login(){

     userService.login(vm.username, vm.password).then(function(resp){
       if(resp.data.status == 'success') {
         alert(resp.data.message);
         localStorage.apiToken =  resp.data.api_token;
         localStorage.userId =  resp.data.user.id;
         $window.location.href = "/homePage.html";
       }
       else {
         alert(resp.data.error);
       }
     });
   }

   function signUp(){
     userService.signUp(vm.firstName, vm.lastName, vm.email, vm.password, vm.passwordConfirmation, vm.role).then(function(resp){
       if(resp.data.status == 'success'){
         localStorage.apiToken =  resp.data.api_token;
         localStorage.userId =  resp.data.user.id;
         $window.location.href = "/homePage.html";
         alert(resp.data.message);
       }
       else{
         alert(resp.data.error);
       }
     });
   }

   function logout(){
     var key = localStorage.getItem("apiToken");
     userService.logOut(key).then(function(resp){
       if(resp.data.status == 'success'){
         localStorage.removeItem("apiToken");
         alert(resp.data.message);
         $window.location.href= "/sign-in.html";
       }
       else{
         alert(resp.data.message);
       }
     });
   }
 }
