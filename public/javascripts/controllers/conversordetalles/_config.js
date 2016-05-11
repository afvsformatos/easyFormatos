.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalles/:idFormato', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })