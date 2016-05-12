.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalleplantillas/:idFormato', {
      templateUrl: '/templates/conversordetalleplantillas/index.html',
      controller: 'conversordetalleplantillasController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/conversordetalleplantillas/', {
      templateUrl: '/templates/conversordetalleplantillas/index.html',
      controller: 'conversordetalleplantillasController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })