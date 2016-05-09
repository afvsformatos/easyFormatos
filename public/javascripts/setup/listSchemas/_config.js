.config(function ($routeProvider) {
 	$routeProvider
 		.when('/listSchemas', {
 		    templateUrl: '/javascripts/setup/listSchemas/templates/listSchemas.html',
 			controller: 'listSchemasController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })