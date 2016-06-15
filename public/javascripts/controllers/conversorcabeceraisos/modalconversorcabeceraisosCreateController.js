.controller('modalconversorcabeceraisosCreateController',
  ['$scope', '$uibModalInstance', 'datos','conversorcabeceraisosModel','$filter','item','$rootScope','conversorcabecerasModel',
  function ($scope, $uibModalInstance, datos,conversorcabeceraisosModel,$filter,item,$rootScope,conversorcabecerasModel) {
    $scope.nombreOperador = item.Operador;
    $scope.showDetalles = [];
    for (prop in datos) {
        if(item.Id_Operador == datos[prop].Id_Operador){
            $scope.showDetalles.push(datos[prop]);
        }
    }
    $rootScope.configTable.itemsPerPage =  5;
    if(item.IdFormato){
          $scope.cabecera = item;
          conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
          conversorcabecerasModel.findById(item.IdFormato).then(function(detalles){
            $scope.numeroBits = detalles.length;
            $scope.conversorDetalles = detalles;
            $scope.conversorDetalles.sort(function(a, b) {
                    return parseFloat(a.NumeroCampo) - parseFloat(b.NumeroCampo);
            });
          });
    }

}])