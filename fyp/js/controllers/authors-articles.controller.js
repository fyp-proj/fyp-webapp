angular.module('main').controller('authorsArticlesController',authorsArticlesController).directive("myCoolDirective", function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            $(elem).click(function() {
                var target = $(elem).next(".panel-collapse");
                target.hasClass("collapse") ? target.collapse("show") : target.collapse("hide");
            });
        }
    }
});;

authorsArticlesController.$inject = ['$http', '$window', 'authorsProjectsService', '$location'];

function authorsArticlesController($http, $window, authorsProjectsService, $location){

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

  vm.getAllAuthors = getAllAuthors;
  vm.getAllArticles = getAllArticles;
  vm.searchArticles = searchArticles;
  vm.searchAuthors = searchAuthors;
  vm.pageChanged = pageChanged;
  vm.sendEmail = sendEmail;
  vm.openRdata = openRdata;
  vm.openGoogleScholar = openGoogleScholar;
  vm.showCollaborators = showCollaborators;

  function initPage(){
    vm.getAllAuthors();
    vm.getAllArticles();
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
    var articleObj = {title: vm.title, keywords:vm.keywords, fromDate:vm.fromDate, toDate:vm.toDate};
    authorsProjectsService.searchArticles(articleObj).then(function(resp){
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

    });
  }
  function openRdata(BrName){
      self.location = "http://www.re3data.org/search?query="+BrName;
  }
  function openGoogleScholar(articleName){
      self.location = "https://www.scholar.google.com/scholar?q="+articleName;
  }

  function showCollaborators(articleId){
    authorsProjectsService.showCollaborators(articleId).then(function(resp){
      vm.collaborators = resp.data;
    });
  }

  initPage();
}
