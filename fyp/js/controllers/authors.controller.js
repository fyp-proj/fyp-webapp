angular.module('main').controller('authorController',authorController).filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});

authorController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'userService', 'homeService'];

function authorController($http, $window, authorsProjectsService, $location, userService, homeService){

  var vm = this;
  vm.userProfile = null;
  vm.authorCollaborators = [];
  vm.loadAuthors = false;
  vm.role = 0;
  vm.reviewRequests = [];
  // vm.showReviewArticle = false;
  // vm.storedIds = [];
  // vm.index = -1;

  vm.logout = logout;
  vm.sendEmail = sendEmail;
  vm.sendMessage = sendMessage;
  vm.searchAuthors = searchAuthors;
  vm.openGoogleScholar = openGoogleScholar;
  vm.editProfile = editProfile;
  vm.editArticle = editArticle;
  vm.deleteNotif = deleteNotif;
  vm.updateRequest = updateRequest;
  vm.getAuthorDetails = getAuthorDetails;


  function initPage(){
    vm.accountUserId = localStorage.getItem("userId");
    vm.getAuthorDetails();
    var database = firebase.database();
    var starCountRef = database.ref('chat'+vm.accountUserId);
    starCountRef.on('value', function(snapshot) {
      vm.array = snapshot.val();
      homeService.getReviewRequest().then(function(resp){
      vm.reviewRequests = resp.data.data;
     });
    });

  }

  function deleteNotif(chatId){
    homeService.deleteNotif(chatId).then(function(resp){
      var found = vm.reviewRequests.find(function(element) { 
        return element.id == chatId; 
      });
      vm.reviewRequests.splice(vm.reviewRequests.indexOf(found),1);
    });
  }

  function updateRequest(confirmation, chatId){
    if(confirmation){
      var status = 2;
      var message ="accept"
    }
    else {
      var status = 1;
      var message = "reject";
    }
    var requestObj = {chatId: chatId, message: message, status: status, type: 'notification'};
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

  function openGoogleScholar(articleName){
      self.location = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q="+articleName;
  }

  function getAuthorDetails() {
    var url = window.location.href; //Get parameter from URL
    url = new URL(url);
    var userId = url.searchParams.get("userId");
    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        vm.userProfile = resp.data.data;
        homeService.getReviewRequest().then(function(resp){
          vm.reviewRequests = resp.data.data;
        });
        authorsProjectsService.viewProfile(userId).then(function(resp){
          vm.authorProfile = resp.data.data;
        });
        authorsProjectsService.getAuthorCollaborators(userId).then(function(resp){
          vm.authorCollaborators = resp.data.collaborators;
        });
    });
    
  }

  function logout(){
    var url = window.location.href;
    console.log(url.indexOf("my-profile-feed.html"));
    console.log(url.substring(0, url.indexOf("user-profile.html")));

     var key = localStorage.getItem("apiToken");
     userService.logOut(key).then(function(resp){
       if(resp.data.status == 'success'){
         localStorage.removeItem("apiToken");
         alert(resp.data.message);
         // $window.location.href= "/sign-in.html";
         // var url = window.location.href;
         if(url.indexOf("my-profile-feed.html")!=-1)
           var redirection = url.substring(0, url.indexOf("my-profile-feed.html"));
         else if(url.indexOf("user-profile.html")!=-1)
            var redirection = url.substring(0, url.indexOf("user-profile.html"));
          
         window.open(redirection,'_blank');
         window.setTimeout(function(){this.close();},300)
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

  function sendMessage(articleName, artId){
   
   var messageObj = {toUser: vm.toUser, message:'review request for article \'' + articleName+'\'', status:3, type:"notification", articleId:artId};
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

  function editProfile(currentUser){
    var user = null;
    if(currentUser)
      user = vm.userProfile;
    else 
      user = vm.authorProfile;
    if(user.socialMedia)
      var socialMedia = {linkedin: user.socialMedia.linkedin? user.socialMedia.linkedin: '', academia:user.socialMedia.academia ? user.socialMedia.academia : '', facebook:user.socialMedia.facebook? user.socialMedia.facebook : '', instagram:user.socialMedia.instagram ? user.socialMedia.instagram : ''};
    else
      var socialMedia = {};
    var SM = JSON.stringify(socialMedia);
    if(vm.role && vm.userProfile.roles && vm.userProfile.roles[0].id == 1)
      var profileObj = {firstName: user.firstName, lastName:user.lastName, institution:user.institution, socialMedia:SM, id:user.id, roles:[parseInt(vm.role)]};
    else var profileObj = {firstName: user.firstName, lastName:user.lastName, institution:user.institution, socialMedia:SM, id:user.id};

    authorsProjectsService.editProfile(profileObj).then(function(resp){
      user = resp.data.user;
      if(resp.data.success)
        alert("Your profile is successfuly updated");
    });
  }

  function editArticle(articleObj){ 
    authorsProjectsService.editArticle({reLink:articleObj.reLink}, articleObj.id).then(function(resp){
      if(resp.data.status == 'success')
        alert('Repository URL is updated');
    });
  }
  initPage();
}
