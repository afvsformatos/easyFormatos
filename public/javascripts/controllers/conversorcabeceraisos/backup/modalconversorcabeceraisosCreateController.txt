.controller('modalconversorcabeceraisosCreateController',
  ['$scope', '$uibModalInstance', 'item','conversorcabeceraisosModel','$filter',
  function ($scope, $uibModalInstance, item,conversorcabeceraisosModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {id_transaccion_cabecera: $scope.item.id_transaccion_cabecera,idformato: $scope.item.idformato,orden: $scope.item.orden,nombre: $scope.item.nombre,tipo: $scope.item.tipo,longitud: $scope.item.longitud,bytes: $scope.item.bytes,aplicadefault: $scope.item.aplicadefault,valordefault: $scope.item.valordefault,respuesta: $scope.item.respuesta,descripcion: $scope.item.descripcion};
        var conversorcabeceraisos = conversorcabeceraisosModel.create();
        conversorcabeceraisos.id_transaccion_cabecera = $scope.item.id_transaccion_cabecera;
        conversorcabeceraisos.idformato = $scope.item.idformato;
        conversorcabeceraisos.orden = $scope.item.orden;
        conversorcabeceraisos.nombre = $scope.item.nombre;
        conversorcabeceraisos.tipo = $scope.item.tipo;
        conversorcabeceraisos.longitud = $scope.item.longitud;
        conversorcabeceraisos.bytes = $scope.item.bytes;
        conversorcabeceraisos.aplicadefault = $scope.item.aplicadefault;
        conversorcabeceraisos.valordefault = $scope.item.valordefault;
        conversorcabeceraisos.respuesta = $scope.item.respuesta;
        conversorcabeceraisos.descripcion = $scope.item.descripcion;
        conversorcabeceraisos.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorcabeceraisosModel.findById($scope.item._id);
        conversorcabeceraisosModel.id_transaccion_cabecera = $scope.item.id_transaccion_cabecera;
        conversorcabeceraisosModel.idformato = $scope.item.idformato;
        conversorcabeceraisosModel.orden = $scope.item.orden;
        conversorcabeceraisosModel.nombre = $scope.item.nombre;
        conversorcabeceraisosModel.tipo = $scope.item.tipo;
        conversorcabeceraisosModel.longitud = $scope.item.longitud;
        conversorcabeceraisosModel.bytes = $scope.item.bytes;
        conversorcabeceraisosModel.aplicadefault = $scope.item.aplicadefault;
        conversorcabeceraisosModel.valordefault = $scope.item.valordefault;
        conversorcabeceraisosModel.respuesta = $scope.item.respuesta;
        conversorcabeceraisosModel.descripcion = $scope.item.descripcion;
        conversorcabeceraisosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])