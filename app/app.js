/**
 * @ngdoc Main
 * @name toDoFire
 * @description
 * A todo app using angularFire
 * for data persistence and storage.
 */
 'use strict';

var app = angular.module('toDoFire', ['firebase', 'angular-md5', 'ui.router']);


// Initialize firebase account
app.config(function(){

  // Firebase account info obtained from firebase console
  var configInfo = {
    apiKey: 'AIzaSyBYAgwUIW5fswCGUM9-WFs4hMcaMkZ1sOc',
    authDomain: 'yourtodos-5e51c.firebaseapp.com',
    databaseURL: 'https://yourtodos-5e51c.firebaseio.com',
    storageBucket: 'yourtodos-5e51c.appspot.com',
  };
  // Initialize app with firebase info
  firebase.initializeApp(configInfo);
});

//Set up application states and corressponding routes
app.config(function($stateProvider, $urlRouterProvider){


    $stateProvider.state('/', {
      url: '/',
      templateUrl: '/User/login.html',
      controller: 'authController as auth'
    }).
    state('/.resetPassword', {
      url: '/resetPassword',
      templateUrl: '/User/resetPassword.html',
      controller: 'authController as auth'
    }).
    state('todo',{
      url: '/todo',
      templateUrl: 'Tasks/task.html',
      controller: 'taskController as task',
      resolve: {
        loggedIn: ['Auth', function(Auth){
          return Auth.$waitForSignIn();
        }]
      }
    }).
    state('notFound', {
      url: '/notFound',
      templateUrl: '404.html'
    });

    // For unmatched url's
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('notFound');
});

//Attach some error handling event handles for routing
app.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function(event, toState, error ) {
    // We can catch the error thrown when the $requireSignIn promise is rejected
    // and redirect the user back to the home page
    // if (error === "AUTH_REQUIRED") {
    //   $location.path("/home");
    // }
    event.preventDefault();
    console.log(error);
  });
}]);
