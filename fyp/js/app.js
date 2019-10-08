angular.module("App",['main', 'userModule']);

angular.module("main",[]);
angular.module("userModule",[]);
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
   vm.gmail = {
     username:'',
     email:''
   };
   vm.totalItems = 15;
   vm.currentPage = 1;
   vm.itemsPerPage = 1;
   vm.allAuhtors = [];
   vm.allArticles = [];
   vm.userProfile = null;
   vm.toDate = '';
   vm.fromDate = '';
   vm.title = '';
   vm.keywords = '';
   vm.loadAuthors = false;
   vm.loadArticles = false;
   //functions
   vm.login = login;
   vm.signUp = signUp;
   vm.logout = logout;
   vm.onGoogleLogin = onGoogleLogin;
   vm.getAllAuthors = getAllAuthors;
   vm.getAllArticles = getAllArticles;
   vm.viewProfile = viewProfile;
   vm.searchArticles = searchArticles;
   vm.pageChanged = pageChanged;
   // vm.searchAuthors = searchAuthors;
   vm.key = localStorage.getItem("apiToken");
   if(vm.key) {
     vm.getAllAuthors();
     vm.getAllArticles();
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
      gapi.auth.signIn(params);
      $window.location.href = "/homePage.html";

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
         localStorage.apiToken =  resp.data.api_token;
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

   function getAllAuthors (){
     vm.loadAuthors = true;
     authorsProjectsService.getAllAuthors(vm.currentPage).then(function(resp){
        vm.allAuthors = resp.data;
        vm.loadAuthors = false;
     });

   }

   function getAllArticles(){
     vm.loadArticles = true;
     authorsProjectsService.getAllArticles(vm.currentPage).then(function(resp){
        vm.allArticles = resp.data;
        vm.loadArticles = false;
     });
   }

   function viewProfile(userId){
     authorsProjectsService.viewProfile(userId).then(function(resp){
        vm.userProfile = resp.data;
       $window.location.href= "/user-profile.html";
     });
   }

   function searchArticles(){
     vm.loadArticles = true;
     var articleObj = {title: vm.title, keywords:vm.keywords, fromDate:vm.fromDate, toDate:vm.toDate};
     authorsProjectsService.searchArticles(articleObj).then(function(resp){
        vm.allArticles = resp.data;
        vm.loadArticles = false;
     });
   }

   // function searchAuthors(){
   //   var key = localStorage.getItem("apiToken")
   //   authorsProjectsService.searchAuthors(key).then(function(resp){
   //
   //   });
   // }
  function pageChanged (prev, page, type){
     if(prev)
       vm.currentPage--;
     else vm.currentPage ++;
     if(page)
       vm.currentPage = page;
     if(type == 'articles')
       vm.getAllArticles();
     else
        vm.getAllAuthors();
  }
 }
