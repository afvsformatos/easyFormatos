.config(function ($routeProvider) {
 	$routeProvider
 		.when('/selectTemplates', {
 			templateUrl: '/javascripts/setup/selectTemplates/templates/selectTemplates.html',
 			controller: 'selectTemplatesController',
 			access: {
 				restricted: false,
 				rol: 5
 			}
 		});
 })

