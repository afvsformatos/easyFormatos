.controller('modalconversordetalleplantillasCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetalleplantillasModel','$filter','IdFormato',
  function ($scope, $uibModalInstance, item,conversordetalleplantillasModel,$filter,IdFormato) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    console.log(IdFormato);
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdPlantilla: $scope.item.IdPlantilla,IdFormato: IdFormato,Plantilla: $scope.item.Plantilla,Tipo: $scope.item.Tipo,Orden: $scope.item.Orden,Nivel: $scope.item.Nivel,Origen: $scope.item.Origen};
        var conversordetalleplantillas = conversordetalleplantillasModel.create();
        conversordetalleplantillas.IdPlantilla = $scope.item.IdPlantilla;
        conversordetalleplantillas.IdFormato = IdFormato;
        conversordetalleplantillas.Plantilla = $scope.item.Plantilla;
        conversordetalleplantillas.Tipo = $scope.item.Tipo;
        conversordetalleplantillas.Orden = $scope.item.Orden;
        conversordetalleplantillas.Nivel = $scope.item.Nivel;
        conversordetalleplantillas.Origen = $scope.item.Origen;
        conversordetalleplantillas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetalleplantillasModel.findById($scope.item._id);
        conversordetalleplantillasModel.IdPlantilla = $scope.item.IdPlantilla;
        conversordetalleplantillasModel.IdFormato = $scope.item.IdFormato;
        conversordetalleplantillasModel.Plantilla = $scope.item.Plantilla;
        conversordetalleplantillasModel.Tipo = $scope.item.Tipo;
        conversordetalleplantillasModel.Orden = $scope.item.Orden;
        conversordetalleplantillasModel.Nivel = $scope.item.Nivel;
        conversordetalleplantillasModel.Origen = $scope.item.Origen;
        conversordetalleplantillasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])