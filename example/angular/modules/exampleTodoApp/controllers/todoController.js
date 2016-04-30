angular.module('exampleTodoApp').controller('todoController',
  function($scope, todo) {
    $scope.todoList = todo.items;
    $scope.newTodoItem = '';

    $scope.addTodoItem = function() {
      $scope.todoList.unshift({ title: $scope.newTodoItem, completed: false });
      $scope.newTodoItem = '';
    };

    $scope.changeCompletion = function(item) {
      item.completed = !item.completed;
    };

    $scope.deleteTodoItem = function(todoItem) {
      _.remove($scope.todoList, item => item === todoItem);

      // for (var i = 0; i < $scope.todoList.length; i++) {
      //   if ($scope.todoList[i] === todoItem) {
      //     $scope.todoList.splice(i, 1);
      //     i = $scope.todoList.length;
      //   }
      // }
    };
  }
);
