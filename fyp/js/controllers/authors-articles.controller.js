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
  vm.getChats = getChats;

  

  function initPage(){
    vm.accountUserId = localStorage.getItem("userId");
    var url = window.location.href;
    var param = url.substring(22);
    if(param == "profiles.html"){
      vm.getAllAuthors();
    }
    if(param == "projects.html"){
      vm.getAllArticles();
    }
    if(param == "messages.html"){
      vm.getChats();
    }
    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        vm.userProfile = resp.data.data;
    });
  }

  function getAllAuthors (){
    vm.loadAuthors = true;
    authorsProjectsService.getAllAuthors(vm.currentPage).then(function(resp){
      vm.allAuthors = resp.data;
      vm.loadAuthors = false;
      setTimeout(function(){
      for(var i=0; i<vm.allAuthors.data.length; i++){
        var mail = document.getElementById("test"+i);
        mail.classList.add('post-jb');
        mail.addEventListener("click", function() {
          $(".post-popup.job_post").addClass("active");
          $(".wrapper").addClass("overlay");
        }, false)}
      }
    ,1000);
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

  function sendEmail(){
    vm.emailObj = {subject: vm.emailSubject, message: vm.emailMessage};
    authorsProjectsService.sendEmail(vm.recipientId, vm.emailObj).then(function(resp){
      alert("Your mail is sent successfuly!");
      $window.location.href = "/profiles.html";
    });
  }

  function openGoogleScholar(articleName){
      self.location = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="+articleName;
  }

  function showCollaborators(articleId){
    authorsProjectsService.showCollaborators(articleId).then(function(resp){
      vm.collaborators = resp.data;
      vm.collaborators.id=articleId;
    });
  }

  function getMessages(toUser, chat){
    var user = null;
    if(chat){
      vm.accountUserId==toUser.fromuser ? user = toUser.touser : user = toUser.fromuser;
    }
    else user = toUser.id;

    // var database = firebase.database();
    // var starCountRef = database.ref('chat'+vm.accountUserId);
    // starCountRef.on('value', function(snapshot) {
    //     vm.array = snapshot.val();
    //   console.log(snapshot);
    // });

    authorsProjectsService.getMessages(user).then(function(resp){
        vm.messagesArray = resp.data.data;
    });

    setInterval(function(){
      authorsProjectsService.getMessages(user).then(function(resp){
        vm.messagesArray = resp.data.data;
        // for(var key in vm.array){
        //   if((vm.array[key].fromuser == vm.messagesArray[0].fromuser && vm.array[key].touser == vm.messagesArray[0].touser) || (vm.array[key].fromuser == vm.messagesArray[0].touser && vm.array[key].touser == vm.messagesArray[0].fromuser)){
        //   vm.messagesArray.push(vm.array[key]);
        //   }
        // }
      });
    }, 4000);
  }

  function sendMessages(){
    var messageObj = {toUser: vm.toUser, message:vm.message, status:1, type:"message"};

    authorsProjectsService.sendMessages(messageObj).then(function(resp){
      vm.messagesArray.push({data_sent: resp.data.comment.created_at, message: resp.data.comment.message, toUser: vm.toUser});
    });
  }

  function getChats(){
    // var database = firebase.database();
    // var starCountRef = database.ref('chat'+vm.accountUserId);
    // starCountRef.on('value', function(snapshot) {
    //   console.log(snapshot.val());
    // });
    authorsProjectsService.getChats().then(function(resp){
      vm.messagedUsers = resp.data.data;
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
