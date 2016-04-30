angular.module('exampleTodoApp', [
  'restangular'
]).config(
  function(RestangularProvider) {
    // Global Restangular configuration
    // Read https://github.com/mgonto/restangular for more information!
    // This example makes use of a publically available REST api with some example data.
    RestangularProvider.setBaseUrl('http://jsonplaceholder.typicode.com');

    // It's also possible to add interceptors, transformers, etc here to
    // the RestangularProvider object.
  }
);
