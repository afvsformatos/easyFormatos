.config(function ($routeProvider) {
 	$routeProvider
 		.when('/uploadTemplates', {
 			templateUrl: '/javascripts/setup/upload/templates/uploadTemplates.html',
 			controller: 'uploadTemplatesController',
 			access: {
 				restricted: false,
 				rol: 5
 			}
 		});
 })