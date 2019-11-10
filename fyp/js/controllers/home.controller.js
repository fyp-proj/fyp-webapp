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

	vm.createPost = createPost;
	vm.getBrIds = getBrIds;
	vm.createComment = createComment;
	vm.getComments = getComments;
	vm.loadNewsFeed = loadNewsFeed;
	vm.filterFunction = filterFunction;
	vm.myFunction = myFunction;
	vm.getAuthors = getAuthors;
	vm.logout = logout;

	function initPage(){
	    vm.loadNewsFeed();
	    vm.getAuthors();
	    vm.accountUserId = localStorage.getItem("userId");
	    authorsProjectsService.viewProfile(vm.accountUserId).then(function(resp){
        	vm.userProfile = resp.data.data;
    	});
  	}

  	function myFunction() {
	  document.getElementById("myDropdown").classList.toggle("show");
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
		vm.articleObj = {citation:vm.citation, brId:1, keywords: vm.keywords, date: vm.year, title:vm.title, collaborators: [5]};
		homeService.createPost(vm.articleObj).then(function(resp){

		});
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