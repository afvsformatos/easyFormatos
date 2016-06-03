.config(function ($routeProvider) {
  $routeProvider
    .when('/catalogos', {
      templateUrl: '/templates/catalogos/index.html',
      controller: 'catalogosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })