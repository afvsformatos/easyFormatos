.controller('conversordetallesController',
  ['$rootScope','$scope', '$location', 'conversordetallesModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetallesModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalles';
    $scope.preloader = true;
    $scope.msjAlert = false;
    
    /*conversordetallesModel.getAll().then(function(data) {
      $scope.conversordetallesList = data;
      $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
      $scope.preloader = false;
    });*/

    $scope.regresarFormato = function(){
      $location.url('/conversorcabeceras/'+$routeParams.idFormato);
    }
    conversordetallesModel.url = '/api/conversordetalles';
    conversordetallesModel.findById($routeParams.idFormato).then(function(detalles){
            console.log(detalles);
            $scope.conversordetallesList = detalles;
            $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
            $scope.preloader = false;
    });
    $scope.NombreFormato = $routeParams.NombreFormato;
    console.log($routeParams.idFormato);
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalles/modalCreate.html',
        controller: 'modalconversordetallesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetallesList.push(data);
           $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        }
      },function(result){
      $scope.conversordetallesList = $scope.conversordetallesTemp;
      $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversordetalles/modalDelete.html',
      controller: 'modalconversordetallesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetallesList.indexOf(data);
      $scope.conversordetallesList.splice(idx, 1);
      conversordetallesModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])