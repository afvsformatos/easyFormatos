.config(function ($routeProvider) {
  $routeProvider
    .when('/ambientes', {
      templateUrl: '/templates/ambientes/index.html',
      controller: 'ambientesController',
      access: {
        restricted: false,
        rol: 5
      }
    });
 })