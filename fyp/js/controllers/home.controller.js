angular.module('main').controller('homeController',homeController).filter('capitalizeWord', function() {
    return function(text) {
      return (!!text) ? text.charAt(0).toUpperCase() + text.substr(1).toLowerCase() : '';
    }
});


homeController.$inject = ['$http', '$window', 'authorsProjectsService', '$location', 'homeService', 'userService'];

function homeController($http, $window, authorsProjectsService, $location, homeService, userService){

	var vm = this;

	vm.totalItems = 15;
	vm.currentPage = 1;
	vm.itemsPerPage = 1;
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
	vm.addRevs = [];
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
	vm.addReviewers = addReviewers;
	vm.searchAuthors = searchAuthors;
	vm.removeCol = removeCol;
	vm.removeRev = removeRev;
	vm.getReviewers = getReviewers;
	vm.pageChanged = pageChanged;
	vm.searchArticles = searchArticles;
	vm.logout = logout;

	function initPage(){
		if(!localStorage.getItem("apiToken"))
			$window.location.href = "/sign-in.html";
		vm.accountUserId = localStorage.getItem("userId");
		authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        	vm.userProfile = resp.data.data;
        	homeService.getReviewRequest().then(function(resp){
		    	vm.reviewRequests = resp.data.data;
	   		});
    	});
	    vm.loadNewsFeed();
	    vm.getAuthors();
     	var database = firebase.database();
        var starCountRef = database.ref('chat'+vm.accountUserId);
        starCountRef.on('value', function(snapshot) {
          vm.array = snapshot.val();
          homeService.getReviewRequest().then(function(resp){
		    	vm.reviewRequests = resp.data.data;
	   		});
      	});
	    
  	}



  	function searchArticles(){
	    vm.loadArticles = true;
	    authorsProjectsService.searchArticles(vm.currentPage, vm.keyword).then(function(resp){
	      vm.newsFeed = resp.data;
	      vm.loadArticles = false;
	    });
	}

  	function removeCol(index){
  		vm.addCollabs.splice(index,1);
  	}

  	function removeRev(index){
  		vm.addRevs.splice(index, 1);
  	}

  	function addCollaborators(){
  		for (var i=0; i < vm.allAuthors.data.length; i++) {
	        if (vm.allAuthors.data[i].id == vm.addColl) {
	            vm.addCollabs.push({id:vm.allAuthors.data[i].id, name:vm.allAuthors.data[i].firstName+' '+vm.allAuthors.data[i].lastName});
	            break;
	        }
    	}
  		
  	}

  	function addReviewers(){
  		for (var i=0; i < vm.reviewers.length; i++) {
	        if (vm.reviewers[i].id == vm.addRev) {
	            vm.addRevs.push({id:vm.reviewers[i].id, name:vm.reviewers[i].firstName+' '+vm.reviewers[i].lastName});
	            break;
	        }
    	}
  	}

  	function myFunction() {
	  document.getElementById("myDropdown").classList.toggle("show");
	}

	function deleteNotif(chatId){
		homeService.deleteNotif(chatId).then(function(resp){
			var found = vm.reviewRequests.find(function(element) { 
			  return element.id == chatId; 
			});
			vm.reviewRequests.splice(vm.reviewRequests.indexOf(found),1);
		});
	}

	function updateRequest(confirmation, chatId, articleId){
		if(confirmation){
			var status = 2;
			var message ="accept"
			var articleId = articleId;
			var requestObj = {chatId: chatId, message: message, status: status, type: 'notification', articleId:articleId};
		}
		else {
			var status = 1;
			var message = "reject";
			var requestObj = {chatId: chatId, message: message, status: status, type: 'notification'};
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
		if(vm.title =='' || vm.keywords=='' || vm.brId == '' || vm.year == ''){
			if(vm.title=='')
				document.getElementById("postTitle").style.border = "1px solid red";
			if(vm.keywords=='')
				document.getElementById("postkeywords").style.border = "1px solid red";
			if(vm.brId==null)
				document.getElementById("postBrId").style.border = "1px solid red";
			if(vm.year==null)
				document.getElementById("postYear").style.border = "1px solid red";
			alert("Please \'title\', \'keywords\', \'br\', \'year\'  are required fields! ");
			return '';
		}
		var collIds= [];
		for(var i =0; i<vm.addCollabs.length; i++){
			collIds[i]=vm.addCollabs[i].id;
		}
		var revIds = [];
		for(var i =0; i<vm.addRevs.length; i++){
			revIds[i]=vm.addRevs[i].id;
		}
		vm.articleObj = {citation:vm.citation, brId:vm.brId, keywords: vm.keywords, date: vm.year, title:vm.title, collaborators: collIds, ongoing:vm.onGoing, reviewers:revIds};
		homeService.createPost(vm.articleObj).then(function(resp){
			if(resp.data.status=='success'){
				for(var i =0; i<revIds.length; i++){
					sendRequestReviewer(vm.title, revIds[i]);
				}
				alert(resp.data.message);
				$window.location.href = "/homePage.html";
			}
			
		});
	}

	function sendRequestReviewer(articleName, toUser){
	   var messageObj = {toUser: toUser, message:'review request for article ' + articleName, status:3, type:"notification"};
	   authorsProjectsService.sendMessages(messageObj).then(function(resp){
	     if(resp.data.status=='success')
	       alert("Your request is sent successfuly!");
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

	function createComment(article){
		homeService.createComment(article.id, {comment: vm.comment}).then(function(resp){
			// var index = vm.newsFeed.data.indexOf(article);
			// vm.newsFeed.data[index].comments.push(resp.data.comment);
			//we need from backend the name of the comment creator
			vm.comment = '';
			vm.getComments(article.id, article);
		});
	}

	function getComments(articleId, article){
		homeService.getComments(articleId).then(function(resp){
			var index = vm.newsFeed.data.indexOf(article);
			vm.newsFeed.data[index].comments = resp.data.data;
			// vm.comments = resp.data;
		});
	}

	function getAuthors(){
		authorsProjectsService.getAllAuthors(1).then(function(resp){
      		vm.authors = resp.data.data;
    	});
	}

	function getReviewers(brId){
		authorsProjectsService.getAllAuthors(null, brId).then(function(resp){
      		vm.reviewers = resp.data.data;
    	});
	}

	function loadNewsFeed(){
		homeService.loadNewsFeed(vm.currentPage).then(function(resp){
			vm.newsFeed = resp.data;
		});
	}

	function searchAuthors(){
	    vm.loadAuthors = true;
	    authorsProjectsService.searchAuthors(vm.search, 1).then(function(resp){
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
	    vm.loadNewsFeed();
	}

	function logout(){
     var key = localStorage.getItem("apiToken");
     userService.logOut(key).then(function(resp){
       if(resp.data.status == 'success'){
         localStorage.removeItem("apiToken");
         alert(resp.data.message);
         // $window.location.href= "/sign-in.html";
         var url = window.location.href;
         var redirection = url.substring(0, url.indexOf("homePage.html"))
         window.open(redirection,'_blank');
         window.setTimeout(function(){this.close();},200)
       }
       else{
         alert(resp.data.message);
       }
     });
   }

	initPage();
}