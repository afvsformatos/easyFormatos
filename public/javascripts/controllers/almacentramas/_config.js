.config(function ($routeProvider) {
  $routeProvider
    .when('/almacentramas', {
      templateUrl: '/templates/almacentramas/index.html',
      controller: 'almacentramasController',
      access: {
        restricted: false,
       	rol: 5
      }
    });
 })