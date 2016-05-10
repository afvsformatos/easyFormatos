.config(function ($routeProvider) {
  $routeProvider
    .when('/conversorcabeceras', {
      templateUrl: '/templates/conversorcabeceras/index.html',
      controller: 'conversorcabecerasController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })