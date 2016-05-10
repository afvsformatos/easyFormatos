.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalles', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })