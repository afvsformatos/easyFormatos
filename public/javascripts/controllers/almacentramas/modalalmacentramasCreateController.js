.controller('modalalmacentramasCreateController',
  ['$scope', '$uibModalInstance', 'item','almacentramasModel','$filter',
  function ($scope, $uibModalInstance, item,almacentramasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {id_formato: $scope.item.id_formato,nombre_formato: $scope.item.nombre_formato,trama: $scope.item.trama,aprobo: $scope.item.aprobo};
        var almacentramas = almacentramasModel.create();
        almacentramas.id_formato = $scope.item.id_formato;
        almacentramas.nombre_formato = $scope.item.nombre_formato;
        almacentramas.trama = $scope.item.trama;
        almacentramas.aprobo = $scope.item.aprobo;
        almacentramas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        almacentramasModel.findById($scope.item._id);
        almacentramasModel.id_formato = $scope.item.id_formato;
        almacentramasModel.nombre_formato = $scope.item.nombre_formato;
        almacentramasModel.trama = $scope.item.trama;
        almacentramasModel.aprobo = $scope.item.aprobo;
        almacentramasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])