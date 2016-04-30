angular.module('exampleTodoApp').directive('todoApp', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    templateUrl: 'templates/todoApp.html'
  };
});
