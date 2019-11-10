angular.module('main').controller('authorController',authorController);

authorController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'userService'];

function authorController($http, $window, authorsProjectsService, $location, userService){

  var vm = this;
  vm.userProfile = null;
  vm.authorCollaborators = [];

  vm.logout = logout;

  function initPage(){
    getAuthorDetails();
    vm.accountUserId = localStorage.getItem("userId");
    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        vm.userProfile = resp.data.data;
    });
  }

  function getAuthorDetails() {
    var url = window.location.href; //Get parameter from URL
    url = new URL(url);
    var userId = url.searchParams.get("userId");
    authorsProjectsService.viewProfile(userId).then(function(resp){
        vm.userProfile = resp.data;
        authorsProjectsService.getAuthorCollaborators(userId).then(function(resp){
          vm.authorCollaborators = resp.data.collaborators;
        });
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

  initPage();
}
