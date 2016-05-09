.config(function ($routeProvider) {
 	$routeProvider
 		.when('/crud', {
 		    templateUrl: '/javascripts/setup/crud/templates/crud.html',
 			controller: 'crudController',
 			access: {
 				 restricted: false,
 				rol: 5
 			}
 		});
 })