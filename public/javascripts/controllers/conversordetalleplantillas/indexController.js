.controller('conversordetalleplantillasController',
  ['$rootScope','$scope', '$location', 'conversordetalleplantillasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetalleplantillasModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalleplantillas';
    $scope.preloader = true;
    $scope.msjAlert = false;

    if($routeParams.idFormato){
          conversordetalleplantillasModel.url = '/api/conversordetalleplantillas';
          conversordetalleplantillasModel.findById($routeParams.idFormato).then(function(plantillas){
              console.log(plantillas);
              $scope.conversordetalleplantillasList = plantillas;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
          });
      }else{
            conversordetalleplantillasModel.getAll().then(function(data) {
              $scope.conversordetalleplantillasList = data;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
            });

      }
      
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalleplantillas/modalCreate.html',
        controller: 'modalconversordetalleplantillasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetalleplantillasList.push(data);
           $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
        }
      },function(result){
      $scope.conversordetalleplantillasList = $scope.conversordetalleplantillasTemp;
      $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversordetalleplantillas/modalDelete.html',
      controller: 'modalconversordetalleplantillasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetalleplantillasList.indexOf(data);
      $scope.conversordetalleplantillasList.splice(idx, 1);
      conversordetalleplantillasModel
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