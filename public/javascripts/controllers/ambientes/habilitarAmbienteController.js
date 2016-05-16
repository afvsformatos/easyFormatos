.controller('habilitarAmbienteController',
  ['$scope', '$uibModalInstance', 'ambientes','ambientesModel','$filter',
  function ($scope, $uibModalInstance, ambientes,ambientesModel,$filter) {
    $scope.saving = false;
    $scope.ambientes = ambientes;
    $scope.item = {};
    $scope.save = function(){
        ambientesModel.url = '/api/ambientes/habilitar';
        ambientesModel.findById($scope.item.ambiente);
        $uibModalInstance.close();        
    }
}])