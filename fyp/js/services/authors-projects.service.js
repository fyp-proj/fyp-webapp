angular.module('App').service("authorsProjectsService", authorsProjectsService);

authorsProjectsService.$inject = ['$http'];

function authorsProjectsService($http) {

  var service = this;

  service.getAllAuthors = getAllAuthors;
  service.getAllArticles = getAllArticles;
  service.viewProfile = viewProfile;
  service.searchArticles = searchArticles;



  function getAllAuthors(page){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/authors/all?page='+page
    });
  }

  function getAllArticles(page){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/articles/all?page='+page
    });
  }

  function viewProfile(id){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/authors/info/'+id
    });
  }
  function searchArticles(artileObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: artileObj,
      url: 'http://ec2-18-217-2-123.us-east-2.compute.amazonaws.com/api/v1/articles/search'
    });
  }
}
