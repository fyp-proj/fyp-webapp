angular.module('main').controller('authorController',authorController);

authorController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'userService'];

function authorController($http, $window, authorsProjectsService, $location, userService){

  var vm = this;
  vm.userProfile = null;
  vm.authorCollaborators = [];
  vm.loadAuthors = false;

  vm.logout = logout;
  vm.sendEmail = sendEmail;
  vm.sendMessage = sendMessage;
  vm.searchAuthors = searchAuthors;
  vm.openGoogleScholar = openGoogleScholar;

  function initPage(){
    vm.accountUserId = localStorage.getItem("userId");
    getAuthorDetails();  
  }

  function openGoogleScholar(articleName){
      self.location = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="+articleName;
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

  function sendEmail(){
   vm.recipientId = url.searchParams.get("userId");
   vm.emailObj = {subject: vm.emailSubject, message: vm.emailMessage};
   authorsProjectsService.sendEmail(vm.recipientId, vm.emailObj).then(function(resp){
    alert("Your mail is sent successfuly!");
    $window.location.href = "/my-profile-feed.html";
   });
  }

  function sendMessage(articleName){
   var messageObj = {toUser: vm.toUser, message:'review request for article ' + articleName, status:3, type:"notification"};
   authorsProjectsService.sendMessages(messageObj).then(function(resp){
     if(resp.data.status=='success')
       alert("Your request is sent successfuly!");
   });
  }

  function searchAuthors(){
    vm.loadAuthors = true;
    authorsProjectsService.searchAuthors(vm.search, 1).then(function(resp){
      vm.allAuthors = resp.data;
      vm.loadAuthors = false;
    });
  }
  initPage();
}
