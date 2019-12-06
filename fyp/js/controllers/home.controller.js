angular.module('main').controller('homeController',homeController);

homeController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'homeService', 'userService'];

function homeController($http, $window, authorsProjectsService, $location, homeService, userService){

	var vm = this;

	vm.articleObj = {};
	vm.keywords = '';
	vm.year = null;
	vm.citation = '';
	vm.title = '';
	vm.collaboratorsIds = [];
	vm.authors = [];
	vm.brId = null;
	vm.brIds = [];
	vm.comment = '';
	vm.comments = [];
	vm.reviewRequests = [];
	vm.reviewedRequests = [];
	vm.onGoing=false;
	vm.addCollabs = [];
	vm.loadAuthors = false;

	vm.createPost = createPost;
	vm.getBrIds = getBrIds;
	vm.createComment = createComment;
	vm.getComments = getComments;
	vm.loadNewsFeed = loadNewsFeed;
	vm.filterFunction = filterFunction;
	vm.myFunction = myFunction;
	vm.getAuthors = getAuthors;
	vm.updateRequest = updateRequest;
	vm.cancel = cancel;
	vm.deleteNotif = deleteNotif;
	vm.requestOnGoingArticle = requestOnGoingArticle;
	vm.addCollaborators = addCollaborators;
	vm.searchAuthors = searchAuthors;
	vm.removeCol = removeCol;
	vm.logout = logout;

	function initPage(){
		vm.accountUserId = localStorage.getItem("userId");
		authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        	vm.userProfile = resp.data.data;
        	homeService.getReviewRequest().then(function(resp){
		    	vm.reviewRequests = resp.data.data;
	   		});
    	});
	    vm.loadNewsFeed();
	    // vm.getAuthors();
  	}

  	function removeCol(index){
  		vm.addCollabs.splice(index,1);
  	}
  	function addCollaborators(){
  		for (var i=0; i < vm.allAuthors.data.length; i++) {
	        if (vm.allAuthors.data[i].id == vm.addColl) {
	            vm.addCollabs.push({id:vm.allAuthors.data[i].id, name:vm.allAuthors.data[i].firstName+' '+vm.allAuthors.data[i].lastName});
	            break;
	        }
    	}
  		
  	}

  	function myFunction() {
	  document.getElementById("myDropdown").classList.toggle("show");
	}

	function deleteNotif(chatId){
		homeService.deleteNotif(chatId).then(function(resp){
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
				$window.location.href= "/messages.html";
			}
		});
	}

	function requestOnGoingArticle(articleName, userId){
		var requetObj = {toUser: userId, message:'request to join your ongoing article '+articleName, status:3, type:"ongoing"};
		authorsProjectsService.sendMessages(requetObj).then(function(resp){
			if(resp.data.status == 'success')
				alert('Request on going article is sent');
		});
	}

  	function filterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("myInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("myDropdown");
	  a = div.getElementsByTagName("a");
	  for (i = 0; i < a.length; i++) {
	    txtValue = a[i].textContent || a[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      a[i].style.display = "";
	    } else {
	      a[i].style.display = "none";
	    }
	  }
	}

	function createPost(){
		var collIds= [];
		for(var i =0; i<vm.addCollabs.length; i++){
			collIds[i]=vm.addCollabs[i].id;
		}
		vm.articleObj = {citation:vm.citation, brId:vm.brId, keywords: vm.keywords, date: vm.year, title:vm.title, collaborators: collIds, ongoing:vm.onGoing};
		homeService.createPost(vm.articleObj).then(function(resp){
			if(resp.data.status=='success'){
				alert(resp.data.message);
				$window.location.href = "/homePage.html";
			}
			
		});
	}

	function cancel(){
		$window.location.href = "/homePage.html";
	}

	function getBrIds(){
		homeService.getBrIds().then(function(resp){
			vm.brIds = resp.data;
		});
	}

	function createComment(articleId){
		homeService.createComment(articleId, {comment: vm.comment}).then(function(resp){

		});
	}

	function getComments(articleId, article){
		homeService.getComments(articleId).then(function(resp){
			var index = vm.newsFeed.indexOf(article);
			vm.newsFeed[index].comments = resp.data.data;
			// vm.comments = resp.data;
		});
	}

	function getAuthors(){
		authorsProjectsService.getAllAuthors(1).then(function(resp){
      		vm.authors = resp.data.data;
    	});
	}
	function loadNewsFeed(){
		homeService.loadNewsFeed().then(function(resp){
			vm.newsFeed = resp.data.data;
		});
	}

	function searchAuthors(){
	    vm.loadAuthors = true;
	    authorsProjectsService.searchAuthors(vm.search, 1).then(function(resp){
	      vm.allAuthors = resp.data;
	      vm.loadAuthors = false;
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