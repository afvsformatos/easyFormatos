.controller('controlesController',
  ['$rootScope','$scope', '$location', 'controlesModel','$uibModal',
  function ($rootScope,$scope, $location, controlesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'controles';
    $scope.preloader = true;
    $scope.msjAlert = false;
    controlesModel.getAll().then(function(data) {
      $scope.controlesList = data;
      $scope.controlesTemp = angular.copy($scope.controlesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/controles/modalCreate.html',
        controller: 'modalcontrolesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
           controlesModel.getAll().then(function(d) {
             $scope.controlesList = d;
             $scope.controlesTemp = angular.copy($scope.controlesList);
           });
      },function(result){
      $scope.controlesList = $scope.controlesTemp;
      $scope.controlesTemp = angular.copy($scope.controlesList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/controles/modalDelete.html',
      controller: 'modalcontrolesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.controlesList.indexOf(data);
      $scope.controlesList.splice(idx, 1);
      controlesModel
        .destroy(data.IdFormato)
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