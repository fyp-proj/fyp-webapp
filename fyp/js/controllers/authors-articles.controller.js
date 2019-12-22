angular.module('main').controller('authorsArticlesController',authorsArticlesController).filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});


authorsArticlesController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'userService', 'homeService', '$anchorScroll'];

function authorsArticlesController($http, $window, authorsProjectsService, $location, userService, homeService, $anchorScroll){

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
  vm.reviewRequests = [];
  vm.brName = '';
  vm.brCountry ='';

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
  vm.getChats = getChats;
  vm.editArticle = editArticle;
  vm.deleteNotif = deleteNotif;
  vm.updateRequest = updateRequest;
  vm.logout = logout;



  function initPage(){
    vm.accountUserId = localStorage.getItem("userId");
    var url = window.location.href;
    if(url.indexOf("profiles.html") !=-1){
      vm.getAllAuthors();
    }
    else if(url.indexOf("projects.html") !=-1){
      vm.getAllArticles();
    }
    else if(url.indexOf("messages.html")!=-1){
      vm.getChats();
    }
    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        vm.userProfile = resp.data.data;
        var database = firebase.database();
        var starCountRef = database.ref('chat'+vm.accountUserId);
        starCountRef.on('value', function(snapshot) {
          homeService.getReviewRequest().then(function(resp){
            vm.reviewRequests = resp.data.data;
          });
        });
    });
    // var database = firebase.database();
    // var starCountRef = database.ref('chat'+vm.accountUserId);
    // starCountRef.on('value', function(snapshot) {
    //   vm.array = snapshot.val();
    //   homeService.getReviewRequest().then(function(resp){
    //   vm.reviewRequests = resp.data.data;
    //  });
    // });
  }

  function deleteNotif(chatId){
    homeService.deleteNotif(chatId).then(function(resp){
      var found = vm.reviewRequests.find(function(element) { 
        return element.id == chatId; 
      });
      vm.reviewRequests.splice(vm.reviewRequests.indexOf(found),1);
    });
  }

  function updateRequest(confirmation, chatId, articleId, requestType, id){
    if(confirmation && requestType =='notification'){
      var status = 2;
      var message ="accept"
      var articleId = articleId;
      var requestObj = {chatId: chatId, message: message, status: status, type: 'notification', articleId:articleId, id:id};
    }
    else if(requestType == 'notification'){
      var status = 1;
      var message = "reject";
      var articleId = articleId;
      var requestObj = {chatId: chatId, message: message, status: status, type: 'notification', articleId:articleId, id:id};
    }
    else if(confirmation && requestType == 'ongoing'){
      var status = 2;
      var message ="accept"
      var articleId = articleId;
      var requestObj = {chatId: chatId, message: 'Accepted participation', status: status, type: 'ongoing', articleId:articleId, id:id};
    }
    else if(requestType  == 'ongoing'){
      var status = 1;
      var message = "reject";
      var articleId = articleId;
      var requestObj = {chatId: chatId, message: 'Rejected participation', status: status, type: 'ongoing', articleId:articleId, id:id};
    }
    
    homeService.updateRequest(requestObj).then(function(resp){
      // vm.reviewRequests.splice(vm.reviewRequests.indexOf(index));
      if(resp.data.success){
        alert('The request is '+ message + 'ed');
        if(message == 'accept')
          $window.location.href= "/messages.html";
        else{
          var found = vm.reviewRequests.find(function(element) { 
            return element.id == chatId; 
          });
          vm.reviewRequests.splice(vm.reviewRequests.indexOf(found),1);
        }
      }
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
    var articleObj = {title: vm.title, keywords:vm.keywords, fromDate:vm.fromDate, toDate:vm.toDate, brName:vm.brName, brCountry:vm.brCountry};
    authorsProjectsService.advancedSearchArticles(articleObj).then(function(resp){
      vm.allArticles = resp.data;
      vm.loadArticles = false;
    });
  }

  function searchAuthors(inMessages){
    vm.loadAuthors = true;
    authorsProjectsService.searchAuthors(vm.search, vm.currentPage).then(function(resp){
      vm.allAuthors = resp.data;
      vm.loadAuthors = false;
    });
    if(!inMessages){
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
      window.open("https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="+articleName);
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

    authorsProjectsService.getMessages(user).then(function(resp){
        vm.messagesArray = resp.data.data;


        var database = firebase.database();
        var starCountRef = database.ref('chat'+vm.accountUserId);
        starCountRef.on('value', function(snapshot) {
          vm.array = snapshot.val();
           authorsProjectsService.getMessages(user).then(function(resp){
              vm.messagesArray = resp.data.data;
           });
          // var array1 = [];
          // for(var i = 0; i<vm.messagesArray.length;i++){
          //   if(vm.messagesArray[i].toUser == vm.userProfile.id && vm.messagesArray[i].type=='message')
          //     array1.push(vm.messagesArray[i]);
          // }
          // var array2 = []
          // for(var key in vm.array){
          //   if(vm.array[key].fromUser == vm.toUser && vm.array[key].toUser == vm.userProfile.id && vm.array[key].type=='message'){
          //       array2.push(vm.array[key]);
          //   }
          // }
          // for(var i = 0; i<array2.length;i++){
          //   for(var j = 0; j<array1.length;j++){
          //     if(array2[i].chatId == array1[j].chatId)
          //       array2.splice(i,1);
          //   }
          // }
          // if(array2[0]){
          //   console.log(array2[0]);
          //   vm.messagesArray.push(array2[0]);
          //   console.log(vm.messagesArray);
          // }
        }); 
    });
  }

  function sendMessages(){
    var messageObj = {toUser: vm.toUser, message:vm.message, status:1, type:"message"};

    authorsProjectsService.sendMessages(messageObj).then(function(resp){
      vm.messagesArray.push({data_sent: resp.data.comment.created_at, message: resp.data.comment.message, toUser: vm.toUser});
      authorsProjectsService.getMessages(vm.toUser).then(function(resp){
        vm.messagesArray = resp.data.data;
      });
    });
  }

  function getChats(){
    authorsProjectsService.getChats().then(function(resp){
      vm.messagedUsers = resp.data.data;
    });
  }

  function editArticle(articleObj){
    authorsProjectsService.editArticle({reLink:articleObj.reLink}, articleObj.id).then(function(resp){

    });
  }

  function logout(){
     var key = localStorage.getItem("apiToken");
     userService.logOut(key).then(function(resp){
       if(resp.data.status == 'success'){
         localStorage.removeItem("apiToken");
         alert(resp.data.message);
         // $window.location.href= "/sign-in.html";
         var url = window.location.href;
         if(url.indexOf("projects.html")!=-1)
           var redirection = url.substring(0, url.indexOf("projects.html"));
         else if(url.indexOf("profiles.html")!=-1)
            var redirection = url.substring(0, url.indexOf("profiles.html"));
         else if(url.indexOf("messages.html")!=-1)
            var redirection = url.substring(0, url.indexOf("messages.html"));

         window.open(redirection,'_blank');
         window.setTimeout(function(){this.close();},300)
       }
       else{
         alert(resp.data.message);
       }
     });
   }
// setInterval(function(){
    //   authorsProjectsService.getMessages(user).then(function(resp){
    //     vm.messagesArray = resp.data.data;
    //     // for(var key in vm.array){
    //     //   if((vm.array[key].fromuser == vm.messagesArray[0].fromuser && vm.array[key].touser == vm.messagesArray[0].touser) || (vm.array[key].fromuser == vm.messagesArray[0].touser && vm.array[key].touser == vm.messagesArray[0].fromuser)){
    //     //   vm.messagesArray.push(vm.array[key]);
    //     //   }
    //     // }
    //   });
    // }, 4000);
  initPage();
}
