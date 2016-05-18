.controller('almacentramasController',
  ['$rootScope','$scope', '$location', 'almacentramasModel','$uibModal',
  function ($rootScope,$scope, $location, almacentramasModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'almacentramas';
    $scope.preloader = true;
    $scope.msjAlert = false;
    almacentramasModel.getAll().then(function(data) {
      $scope.almacentramasList = data;
      $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/almacentramas/modalCreate.html',
        controller: 'modalalmacentramasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.almacentramasList.push(data);
           $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
        }
      },function(result){
      $scope.almacentramasList = $scope.almacentramasTemp;
      $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/almacentramas/modalDelete.html',
      controller: 'modalalmacentramasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.almacentramasList.indexOf(data);
      $scope.almacentramasList.splice(idx, 1);
      almacentramasModel
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