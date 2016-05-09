.controller('modalcontrolesCreateController',
  ['$scope', '$uibModalInstance', 'item','controlesModel','$filter',"pacientesModel",
  function ($scope, $uibModalInstance, item,controlesModel,$filter,pacientesModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {fecha: $scope.item.fecha};
        var controles = controlesModel.create();
        controles.pacientes = $scope.item.pacientes;
        controles.fecha = $scope.item.fecha;
        controles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        controlesModel.findById($scope.item._id);
        controlesModel.pacientes =  $scope.item.pacientes;
        controlesModel.fecha = $scope.item.fecha;
        controlesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    pacientesModel.getAll().then(function(data) {
      $scope.pacientes = data;
    });
}])