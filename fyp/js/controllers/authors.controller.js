angular.module('main').controller('authorController',authorController);

authorController.$inject = ['$http', '$window', 'authorsProjectsService', '$location'];

function authorController($http, $window, authorsProjectsService, $location){

  var vm = this;
  vm.userProfile = null;

  function initPage(){
    getAuthorDetails();
  }

  function getAuthorDetails() {
    var url = window.location.href; //Get parameter from URL
    url = new URL(url);
    var userId = url.searchParams.get("userId");
    authorsProjectsService.viewProfile(userId).then(function(resp){
        vm.userProfile = resp.data;
      });
  }

  initPage();
}
