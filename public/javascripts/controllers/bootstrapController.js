.controller('bootstrapController',
  ['$scope', '$location', 'AuthService','bootstrapService','$route',
  function ($scope, $location, AuthService,bootstrapService,$route) {
    $scope.test = "Menú 1";
         /*  LOGOUT  */
	    $scope.logout = function () {
	      AuthService.logout()
	        .then(function () {
	          $location.path('/login');
	        });

	    };
	    bootstrapService.getMenu().then(function(data) {
	      $scope.menus = data;
	    });	

	    $scope.reloadRoute = function(menu){
	    	if(menu.flat == 'cabecera')
	    		location.reload();

	    	
	    	
	    }
	    
}])