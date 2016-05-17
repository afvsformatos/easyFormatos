.controller('ambientesController',
  ['$rootScope','$scope', '$location', 'ambientesModel','$uibModal',
  function ($rootScope,$scope, $location, ambientesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'ambientes';
    $scope.preloader = true;
    $scope.msjAlert = false;
    ambientesModel.getAll().then(function(data) {
      $scope.ambientesList = data;
      $scope.ambientesTemp = angular.copy($scope.ambientesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/ambientes/modalCreate.html',
        controller: 'modalambientesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.ambientesList.push(data);
           $scope.ambientesTemp = angular.copy($scope.ambientesList);
        }
      },function(result){
      $scope.ambientesList = $scope.ambientesTemp;
      $scope.ambientesTemp = angular.copy($scope.ambientesList);
    });
  };

   $scope.habilitarAmbiente = function () {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/ambientes/habilitarAmbiente.html',
        controller: 'habilitarAmbienteController',
        size: 'lg',
        resolve: {
         ambientes: function () {
          return $scope.ambientesList;
         }
        }
      });
      modalInstance.result.then(function(data) {
        location.reload();
      },function(result){
        console.log('mal');
      });
  };

  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/ambientes/modalDelete.html',
      controller: 'modalambientesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.ambientesList.indexOf(data);
      $scope.ambientesList.splice(idx, 1);
      ambientesModel
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