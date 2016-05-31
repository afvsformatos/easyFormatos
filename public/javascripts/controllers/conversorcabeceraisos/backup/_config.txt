.config(function ($routeProvider) {
  $routeProvider
    .when('/conversorcabeceraisos', {
      templateUrl: '/templates/conversorcabeceraisos/index.html',
      controller: 'conversorcabeceraisosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })