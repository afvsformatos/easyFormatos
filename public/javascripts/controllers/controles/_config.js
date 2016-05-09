.config(function ($routeProvider) {
  $routeProvider
    .when('/controles', {
      templateUrl: '/templates/controles/index.html',
      controller: 'controlesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })