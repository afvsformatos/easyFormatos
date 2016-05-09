.controller('pacientesController',
  ['$rootScope','$scope', '$location', 'pacientesModel','$uibModal',
  function ($rootScope,$scope, $location, pacientesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'pacientes';
    $scope.preloader = true;
    $scope.msjAlert = false;
    pacientesModel.getAll().then(function(data) {
      $scope.pacientesList = data;
      $scope.pacientesTemp = angular.copy($scope.pacientesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/pacientes/modalCreate.html',
        controller: 'modalpacientesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.pacientesList.push(data);
           $scope.pacientesTemp = angular.copy($scope.pacientesList);
        }
      },function(result){
      $scope.pacientesList = $scope.pacientesTemp;
      $scope.pacientesTemp = angular.copy($scope.pacientesList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/pacientes/modalDelete.html',
      controller: 'modalpacientesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.pacientesList.indexOf(data);
      $scope.pacientesList.splice(idx, 1);
      pacientesModel
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