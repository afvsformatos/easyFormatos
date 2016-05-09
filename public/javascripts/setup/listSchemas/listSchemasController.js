.controller('listSchemasController',
    ['$scope', 'schemaModel','$uibModal',
        function ($scope, schemaModel,$uibModal) {
        $scope.preloader = true;
        schemaModel.getAll().then(function(data){
        	 $scope.schemas = data;
        	 $scope.preloader = false;
        });

}])