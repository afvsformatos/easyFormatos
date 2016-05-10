.controller('modalconversordetallesCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetallesModel','$filter',
  function ($scope, $uibModalInstance, item,conversordetallesModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {iddetalle: $scope.item.iddetalle,idformato: $scope.item.idformato,tiporegistro: $scope.item.tiporegistro,numerocampo: $scope.item.numerocampo,posicioninicio: $scope.item.posicioninicio,longitudcampo: $scope.item.longitudcampo,tipocampo: $scope.item.tipocampo,separadordecimales: $scope.item.separadordecimales,numerodecimales: $scope.item.numerodecimales,descripcioncampo: $scope.item.descripcioncampo,idcampoequivalente: $scope.item.idcampoequivalente,campoequivalente: $scope.item.campoequivalente,obligatorio: $scope.item.obligatorio,validaciones: $scope.item.validaciones,tipo_registro: $scope.item.tipo_registro,default_value: $scope.item.default_value,observacion: $scope.item.observacion,rutina_validacion: $scope.item.rutina_validacion,rutina_transformacion: $scope.item.rutina_transformacion,caracterconcatenacion: $scope.item.caracterconcatenacion,ordencampo: $scope.item.ordencampo,rutina_conversion: $scope.item.rutina_conversion,validaenmasivas: $scope.item.validaenmasivas};
        var conversordetalles = conversordetallesModel.create();
        conversordetalles.iddetalle = $scope.item.iddetalle;
        conversordetalles.idformato = $scope.item.idformato;
        conversordetalles.tiporegistro = $scope.item.tiporegistro;
        conversordetalles.numerocampo = $scope.item.numerocampo;
        conversordetalles.posicioninicio = $scope.item.posicioninicio;
        conversordetalles.longitudcampo = $scope.item.longitudcampo;
        conversordetalles.tipocampo = $scope.item.tipocampo;
        conversordetalles.separadordecimales = $scope.item.separadordecimales;
        conversordetalles.numerodecimales = $scope.item.numerodecimales;
        conversordetalles.descripcioncampo = $scope.item.descripcioncampo;
        conversordetalles.idcampoequivalente = $scope.item.idcampoequivalente;
        conversordetalles.campoequivalente = $scope.item.campoequivalente;
        conversordetalles.obligatorio = $scope.item.obligatorio;
        conversordetalles.validaciones = $scope.item.validaciones;
        conversordetalles.tipo_registro = $scope.item.tipo_registro;
        conversordetalles.default_value = $scope.item.default_value;
        conversordetalles.observacion = $scope.item.observacion;
        conversordetalles.rutina_validacion = $scope.item.rutina_validacion;
        conversordetalles.rutina_transformacion = $scope.item.rutina_transformacion;
        conversordetalles.caracterconcatenacion = $scope.item.caracterconcatenacion;
        conversordetalles.ordencampo = $scope.item.ordencampo;
        conversordetalles.rutina_conversion = $scope.item.rutina_conversion;
        conversordetalles.validaenmasivas = $scope.item.validaenmasivas;
        conversordetalles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetallesModel.findById($scope.item._id);
        conversordetallesModel.iddetalle = $scope.item.iddetalle;
        conversordetallesModel.idformato = $scope.item.idformato;
        conversordetallesModel.tiporegistro = $scope.item.tiporegistro;
        conversordetallesModel.numerocampo = $scope.item.numerocampo;
        conversordetallesModel.posicioninicio = $scope.item.posicioninicio;
        conversordetallesModel.longitudcampo = $scope.item.longitudcampo;
        conversordetallesModel.tipocampo = $scope.item.tipocampo;
        conversordetallesModel.separadordecimales = $scope.item.separadordecimales;
        conversordetallesModel.numerodecimales = $scope.item.numerodecimales;
        conversordetallesModel.descripcioncampo = $scope.item.descripcioncampo;
        conversordetallesModel.idcampoequivalente = $scope.item.idcampoequivalente;
        conversordetallesModel.campoequivalente = $scope.item.campoequivalente;
        conversordetallesModel.obligatorio = $scope.item.obligatorio;
        conversordetallesModel.validaciones = $scope.item.validaciones;
        conversordetallesModel.tipo_registro = $scope.item.tipo_registro;
        conversordetallesModel.default_value = $scope.item.default_value;
        conversordetallesModel.observacion = $scope.item.observacion;
        conversordetallesModel.rutina_validacion = $scope.item.rutina_validacion;
        conversordetallesModel.rutina_transformacion = $scope.item.rutina_transformacion;
        conversordetallesModel.caracterconcatenacion = $scope.item.caracterconcatenacion;
        conversordetallesModel.ordencampo = $scope.item.ordencampo;
        conversordetallesModel.rutina_conversion = $scope.item.rutina_conversion;
        conversordetallesModel.validaenmasivas = $scope.item.validaenmasivas;
        conversordetallesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])