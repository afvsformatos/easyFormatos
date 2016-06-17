.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalles/:idFormato/:NombreFormato/:tipoConversion', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })