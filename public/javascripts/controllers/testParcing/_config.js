.config(function ($routeProvider) {
  $routeProvider
    .when('/testParsing', {
      templateUrl: '/templates/testParsing/index.html',
      controller: 'parsingController',
      access: {
        restricted: false,
        rol: 1
      }
    })
    .when('/probarFormato/:nombreFormato/:idFormato', {
      templateUrl: '/templates/testParsing/probarFormato.html',
      controller: 'parsingController',
      access: {
        restricted: false,
        rol: 1
      }
    });
 })