.config(function ($routeProvider) {
 	$routeProvider
 		.when('/exportProject', {
 		    templateUrl: '/javascripts/setup/exportProject/templates/exportProject.html',
 			controller: 'exportProjectController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })