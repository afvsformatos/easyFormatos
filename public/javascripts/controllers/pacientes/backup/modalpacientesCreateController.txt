.controller('modalpacientesCreateController',
  ['$scope', '$uibModalInstance', 'item','pacientesModel','$filter',
  function ($scope, $uibModalInstance, item,pacientesModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombres: $scope.item.nombres,edad: $scope.item.edad};
        var pacientes = pacientesModel.create();
        pacientes.nombres = $scope.item.nombres;
        pacientes.edad = $scope.item.edad;
        pacientes.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        pacientesModel.findById($scope.item._id);
        pacientesModel.nombres = $scope.item.nombres;
        pacientesModel.edad = $scope.item.edad;
        pacientesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])