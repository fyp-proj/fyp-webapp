angular.module('App').service("authorsProjectsService", authorsProjectsService);

authorsProjectsService.$inject = ['$http'];

function authorsProjectsService($http) {

  var service = this;

  service.getAllAuthors = getAllAuthors;
  service.getAllArticles = getAllArticles;
  service.viewProfile = viewProfile;
  service.searchArticles = searchArticles;
  service.searchAuthors = searchAuthors;
  service.sendEmail = sendEmail;
  service.showCollaborators = showCollaborators;



  function getAllAuthors(page){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/authors/all?page='+page
    });
  }

  function getAllArticles(page){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/articles/all?page='+page
    });
  }

  function viewProfile(id){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/authors/info/'+id
    });
  }
  function searchArticles(articleObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: articleObj,
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/articles/search'
    });
  }

  function searchAuthors(q, page){
    var res = encodeURI(q);
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/authors/search?q='+res+'&page=' + page
    });
  }

  function sendEmail(id, emailObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: emailObj,
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/email/send/'+id
    });
  }

  function showCollaborators(articleId){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/authors/collaborators/'+articleId
    });
  }
}
