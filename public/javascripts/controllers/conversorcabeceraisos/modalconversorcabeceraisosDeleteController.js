.controller('modalconversorcabeceraisosDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    if($scope.item.eliminar){
    	$scope.mensaje = '¿Está seguro que desea borrar el Catálogo?';
    	$scope.eliminarDisabled = false;
    }else{
    	$scope.mensaje = 'Imposible Eliminar,Este Catálogo tiene asociado formatos';
    	$scope.eliminarDisabled = true;
    }
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])