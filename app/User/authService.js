'use strict';

angular.module('toDoFire')
.factory('Auth', ['$firebaseAuth', function($firebaseAuth){
    return $firebaseAuth();
}]);
