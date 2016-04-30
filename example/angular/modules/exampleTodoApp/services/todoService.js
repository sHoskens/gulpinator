angular.module('exampleTodoApp').factory('todo',
  function(Restangular) {
    let self = {};

    self.items = Restangular.all('todos').getList().$object;

    return self;
  }
);
