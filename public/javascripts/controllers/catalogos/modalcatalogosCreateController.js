.controller('modalcatalogosCreateController',
  ['$scope', '$uibModalInstance', 'item','catalogosModel','$filter',
  function ($scope, $uibModalInstance, item,catalogosModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IDTabla: $scope.item.IDTabla,TABLAArgumento: $scope.item.TABLAArgumento,TABLADescripcion: $scope.item.TABLADescripcion,TABLAReferencia: $scope.item.TABLAReferencia,TABLAEstado: $scope.item.TABLAEstado};
        var catalogos = catalogosModel.create();
        catalogos.IDTabla = $scope.item.IDTabla;
        catalogos.TABLAArgumento = $scope.item.TABLAArgumento;
        catalogos.TABLADescripcion = $scope.item.TABLADescripcion;
        catalogos.TABLAReferencia = $scope.item.TABLAReferencia;
        catalogos.TABLAEstado = $scope.item.TABLAEstado;
        catalogos.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        catalogosModel.findById($scope.item._id);
        catalogosModel.IDTabla = $scope.item.IDTabla;
        catalogosModel.TABLAArgumento = $scope.item.TABLAArgumento;
        catalogosModel.TABLADescripcion = $scope.item.TABLADescripcion;
        catalogosModel.TABLAReferencia = $scope.item.TABLAReferencia;
        catalogosModel.TABLAEstado = $scope.item.TABLAEstado;
        catalogosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])