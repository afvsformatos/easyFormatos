.config(function ($routeProvider) {
 	$routeProvider
 		.when('/relationship', {
 		    templateUrl: '/javascripts/setup/relationship/templates/relationshipFrame.html',
 			controller: 'relationshipController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })