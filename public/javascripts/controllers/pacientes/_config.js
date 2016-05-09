.config(function ($routeProvider) {
  $routeProvider
    .when('/pacientes', {
      templateUrl: '/templates/pacientes/index.html',
      controller: 'pacientesController',
      access: {
        restricted: false,
       rol: 2
      }
    });
 })