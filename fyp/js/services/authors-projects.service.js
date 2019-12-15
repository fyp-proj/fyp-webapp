angular.module('App').service("authorsProjectsService", authorsProjectsService);

authorsProjectsService.$inject = ['$http'];

function authorsProjectsService($http) {

  var service = this;

  service.getAllAuthors = getAllAuthors;
  service.getAllArticles = getAllArticles;
  service.viewProfile = viewProfile;
  service.searchArticles = searchArticles;
  service.advancedSearchArticles = advancedSearchArticles;
  service.searchAuthors = searchAuthors;
  service.sendEmail = sendEmail;
  service.showCollaborators = showCollaborators;
  service.getAuthorCollaborators = getAuthorCollaborators;
  service.getMessages = getMessages;
  service.sendMessages = sendMessages;
  service.getChats = getChats;
  service.editProfile = editProfile;
  service.editArticle = editArticle;



  function getAllAuthors(page, brId){
    var param = '';
    if(brId)
        param = '&brId='+brId;
    else 
      param = 'page='+page;
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/all?'+param
    });
  }

  function getAllArticles(page){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/articles/all?page='+page
    });
  }

  function viewProfile(id){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/info/'+id
    });
  }

  function advancedSearchArticles(articleObj){
    return $http({
        method: 'POST',
        headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
        data: articleObj,
        url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/articles/advance-search'
    });
  }

  function searchArticles(page, keyword){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/articles/search?page='+page+'&q='+keyword
    });
  }

  function searchAuthors(q, page){
    var res = encodeURI(q);
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/search?q='+res+'&page=' + page
    });
  }

  function sendEmail(id, emailObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: emailObj,
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/email/send/'+id
    });
  }

  function showCollaborators(articleId){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/collaborators/'+articleId
    });
  }

  function getAuthorCollaborators(authorId){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/allCollaborators/'+authorId
    });
    
  }

  function getMessages(toUser){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/chats/get/messages/'+toUser
    });
  }

  function getChats(){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/chats/get/chats'
    });
  }

  function sendMessages(messageObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: messageObj,
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/chats/send'
    });
  }

  function editProfile(profileObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: profileObj,
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/authors/profile/edit'
    });
  }

  function editArticle(articleObj, articleId){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: articleObj,
      url: 'http://ec2-3-135-222-170.us-east-2.compute.amazonaws.com/api/v1/articles/edit/'+articleId
    });
  }
}
