angular.module('App').service("homeService", homeService);

homeService.$inject = ['$http'];

function homeService($http) {

  var service = this;	

  service.createPost = createPost;
  service.getBrIds = getBrIds;
  service.createComment = createComment;
  service.getComments = getComments;
  service.loadNewsFeed = loadNewsFeed;


  function getBrIds(){
    return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/br/all'
    });
  }
  function createPost(articleObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: articleObj,
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/articles/create'
    });
  }

  function createComment(articleId, commentObj){
    return $http({
      method: 'POST',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      data: commentObj,
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/comment/create/' + articleId
    });
  }

  function getComments(articleId){
  	return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/comment/get/' + articleId
    });
  }

  function loadNewsFeed(){
  	return $http({
      method: 'GET',
      headers: {Authorization: "Bearer " + localStorage.getItem("apiToken")},
      url: 'http://ec2-3-16-180-27.us-east-2.compute.amazonaws.com/api/v1/articles/newsfeed'
    });
  }

}