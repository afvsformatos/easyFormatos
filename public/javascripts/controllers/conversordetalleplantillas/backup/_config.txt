.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalleplantillas', {
      templateUrl: '/templates/conversordetalleplantillas/index.html',
      controller: 'conversordetalleplantillasController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })