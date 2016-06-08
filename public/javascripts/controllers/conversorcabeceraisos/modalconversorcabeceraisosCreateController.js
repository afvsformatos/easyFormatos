.controller('modalconversorcabeceraisosCreateController',
  ['$scope', '$uibModalInstance', 'datos','conversorcabeceraisosModel','$filter','item','$rootScope',
  function ($scope, $uibModalInstance, datos,conversorcabeceraisosModel,$filter,item,$rootScope) {
    $scope.nombreOperador = item.Operador;
    $scope.showDetalles = [];
    for (prop in datos) {
        if(item.Id_Operador == datos[prop].Id_Operador){
            $scope.showDetalles.push(datos[prop]);
        }
    }

    $rootScope.configTable.itemsPerPage =  5;

}])