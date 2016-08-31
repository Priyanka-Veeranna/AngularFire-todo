'use strict';
/**
 * @ngdoc taskController
 * @name
 * @description
 *
 *
 */

angular.module('toDoFire')
.controller('taskController', ['$firebaseArray', 'Auth', '$state', 'loggedIn',
  function($firebaseArray, Auth, $state, loggedIn){

    // If user is not logged in, direct him back to login page
    if(loggedIn === null){
      $state.go('/');
      //return to halt the futher execution of controller code
      return;
    }

    var self = this, userData = loggedIn;
    self.newTask='', self.error;
    var uId = userData.uid;

    // Reference for the '/tasks' json tree in firebase database
    var ref = firebase.database().ref('users/' + uId + '/tasks');
    self.taskList = $firebaseArray(ref);

    var refOne = firebase.database().ref('users/' + uId + '/done');
    self.doneList = $firebaseArray(refOne);

    // LogOut function
    self.logout = function(){
        Auth.$signOut();
        $state.go('/');
        return;
    };

    // function to add new tasks for the user
    self.addTask = function(){

      //Check if the task field is empty
      if(!self.newTask) {
        self.error = "Please enter what you want ToDO";
        return;
      }

      self.taskList.$add(self.newTask).then(function(){

        // clear the input field
        self.newTask='';
        self.error = '';
      })
      .catch(function(error){
        console.log(error);
      });

    };

    // function to move the task to done list
    self.done = function(task){

      // $remove method takes either index of the db or the db record itself
      //we are passing the record here, since we have only the key to that record
      var record = self.taskList.$getRecord(task);

      self.taskList.$remove(record).then(function(){

        self.doneList.$add(record);
      }).
      catch(function(error) {
        console.log(error);
      });
    };

    // function to clear the doneList
    self.reset = function(list){

      for(var i =0; i<list.length; i++){
        list.$remove(i).
        catch(function(error){
          console.log(error);
        });
      }
    };

}]);


// All the drag and drop directive heres
//drag directive

var todoApp = angular.module('toDoFire');

todoApp.directive('todoDrag', function(){

  return function(scope, elem){

    elem.attr('draggable', 'true');

    // listen for the 'dragstart' event
    elem.on('dragstart', function(dragevent){

      // Assign the original event from the general event object created to
      // dragevent object
      dragevent = event.originalEvent || event;
      dragevent.dataTransfer.eventAllowed = 'move';
      dragevent.dataTransfer.setData('text', dragevent.target.id);

    });
  };

}); //todoDrag directive ends here

todoApp.directive('todoDrop', function(){

  return {
    scope: {
      drop: '&'
    },
    link: function(scope, elem){

      elem.on('dragover', function(event){

        event.originalEvent.preventDefault();
      });

      elem.on('drop', function(dropevent){

        dropevent = event.originalEvent || event;
        dropevent.preventDefault();
        var data = dropevent.dataTransfer.getData('text');

        // call the parent controller 'done' function through scope
        scope.drop({item:data});
      });
    }
  };
});//Drop directive ends here
