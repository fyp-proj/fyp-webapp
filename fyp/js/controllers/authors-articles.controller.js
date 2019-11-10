angular.module('main').controller('authorsArticlesController',authorsArticlesController);

authorsArticlesController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'userService'];

function authorsArticlesController($http, $window, authorsProjectsService, $location, userService){

  var vm = this;

  vm.loadAuthors = false;
  vm.loadArticles = false;
  vm.totalItems = 15;
  vm.currentPage = 1;
  vm.itemsPerPage = 1;
  vm.toDate = '';
  vm.fromDate = '';
  vm.title = '';
  vm.keywords = '';
  vm.message = '';
  vm.subject = '';
  vm.search = '';
  vm.to = '';
  vm.collaborators = [];
  vm.emailSubject = '';
  vm.emailMessage = '';
  vm.recipientId = null;
  vm.messagedUsers = [];
  vm.messagesArray = [];

  vm.getAllAuthors = getAllAuthors;
  vm.getAllArticles = getAllArticles;
  vm.searchArticles = searchArticles;
  vm.advancedSearchArticles = advancedSearchArticles;
  vm.searchAuthors = searchAuthors;
  vm.pageChanged = pageChanged;
  vm.sendEmail = sendEmail;
  // vm.openRdata = openRdata;
  vm.openGoogleScholar = openGoogleScholar;
  vm.showCollaborators = showCollaborators;
  vm.getMessages = getMessages;
  vm.sendMessages = sendMessages;
  vm.logout = logout;

  function initPage(){
    vm.getAllAuthors();
    vm.getAllArticles();
    setTimeout(function(){
      for(var i=0; i<vm.allAuthors.data.length; i++){
        var mail = document.getElementById("test"+i);
        mail.classList.add('post-jb');
        mail.addEventListener("click", function() {
          $(".post-popup.job_post").addClass("active");
          $(".wrapper").addClass("overlay");
        }, false)}
      }
    ,1500);
    vm.accountUserId = localStorage.getItem("userId");
    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        vm.userProfile = resp.data.data;
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

  function searchArticles(){
    vm.loadArticles = true;
    authorsProjectsService.searchArticles(vm.currentPage, vm.keyword).then(function(resp){
      vm.allArticles = resp.data;
      vm.loadArticles = false;
    });
  }

  function advancedSearchArticles(){
    vm.loadArticles = true;
    var articleObj = {title: vm.title, keywords:vm.keywords, fromDate:vm.fromDate, toDate:vm.toDate};
    authorsProjectsService.advancedSearchArticles(articleObj).then(function(resp){
      vm.allArticles = resp.data;
      vm.loadArticles = false;
    });
  }

  function searchAuthors(){
    vm.loadAuthors = true;
    authorsProjectsService.searchAuthors(vm.search, vm.currentPage).then(function(resp){
      vm.allAuthors = resp.data;
      vm.loadAuthors = false;
    });
  }

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


  function openEmailModal(){
    var modalInstance = $uibModal.open({
      templateUrl: '/kois/admin/prescription-templates/prescription-template.html',
      controller: 'prescriptionTemplateController',
      backdrop: 'static',
      size: 'lg',
      controllerAs: 'ctrl',
      resolve: {

      }
    });

    modalInstance.result.then( function ( new_template ) {

    });


  }
  function sendEmail(){
    vm.emailObj = {subject: vm.emailSubject, message: vm.emailMessage};
    authorsProjectsService.sendEmail(vm.recipientId, vm.emailObj).then(function(resp){
      alert("Your mail is sent successfuly!");
      $window.location.href = "/profiles.html";
    });
  }
  // function openRdata(BrName){
  //     self.location = "http://www.re3data.org/search?query="+BrName;
  // }
  function openGoogleScholar(articleName){
      self.location = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="+articleName;
  }

  function showCollaborators(articleId){
    authorsProjectsService.showCollaborators(articleId).then(function(resp){
      vm.collaborators = resp.data;
    });
  }

  function getMessages(toUser){
    authorsProjectsService.getMessages(toUser).then(function(resp){
      vm.messagesArray = resp.data.data;
    });
  }

  function sendMessages(){
    var messageObj = {toUser: vm.toUser, message:vm.message, status:1, type:"String"};
    vm.messagedUsers.push({userId:vm.toUser, userName:'first and last name', lastMessage:'lastMessage'});
    authorsProjectsService.sendMessages(messageObj).then(function(resp){
      vm.messagesArray.push({toUser: vm.toUser, message: resp.data.comment.message, data_sent: resp.data.comment.created_at});
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
