.config(function ($routeProvider) {
  $routeProvider
    .when('/conversorcabeceras', {
      templateUrl: '/templates/conversorcabeceras/index.html',
      controller: 'conversorcabecerasController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/conversorcabeceras/:idFormato', {
      templateUrl: '/templates/conversorcabeceras/index.html',
      controller: 'conversorcabecerasController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })