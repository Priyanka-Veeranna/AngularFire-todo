'use strict';
/**
 * @ngdoc function
 * @name
 * @description
 *
 *
 */

angular.module('toDoFire')
  .controller('authController', ['Auth', '$state', function(Auth, $state){

  var self = this;


  self.email = '';
  self.password = '';
  self.error = '';

  self.login = function(){

      Auth.$signInWithEmailAndPassword(self.email, self.password)
      .then(function() {
        $state.go('todo');
      }).catch(function(error) {
        self.error = error;
      });
  }; //login function ends

  self.signUp = function(){

      Auth.$createUserWithEmailAndPassword(self.email, self.password)
      .then(function() {
        $state.go('todo');
      }).catch(function(error) {
        self.error = error;
      });
  }; //signup function ends

  // function to reset password
  self.resetPassword = function(email){

    Auth.$sendPasswordResetEmail(email)
    .then(function() {
      self.error = "Password reset email sent successfully!!";
    })
    .catch(function(error) {
      self.error = error.message;    
    });
  };

}]);
