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
    })
    .when('/duplicarFormato', {
      templateUrl: '/templates/conversorcabeceras/duplicarFormato.html',
      controller: 'duplicarFormatoController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/formatosAutomaticos', {
      templateUrl: '/templates/conversorcabeceras/formatosAutomaticos.html',
      controller: 'formatosAutomaticosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })