.controller('modalconversordetallesCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetallesModel','$filter','IdFormato','tipoConversion',
  function ($scope, $uibModalInstance, item,conversordetallesModel,$filter,IdFormato,tipoConversion) {
    $scope.item = item;
    $scope.saving = false;
    if(!item){
       //add optional code
        $scope.item = {};
        $scope.item.TipoRegistro = 'D';
        $scope.item.PosicionInicio = 0;
        $scope.item.LongitudCampo = 0;
        $scope.item.TipoCampo = 'X';
        $scope.item.SeparadorDecimales = false;
        $scope.item.NumeroDecimales = 0;
        $scope.item.IdCampoEquivalente = 0;
        $scope.item.Obligatorio = false;
        $scope.item.Tipo_Registro = 'ITEM';
        $scope.item.OrdenCampo = '-1';
        $scope.item.ValidaEnMasivas = true;
        $scope.validarCampos = false;
    }else{
        $scope.validarCampos = tipoConversion.indexOf('ISO8583') != -1;
    }
    var eliminarEspaciosDescripcionCampo = function(arg){
        if(item){
             $scope.item.DescripcionCampo = $scope.item.DescripcionCampo.replace(/\s/g,'');
        }
       return  arg.replace(/\s/g,'');
    }
    var eliminarCampoEquivalente = function(arg){
        if(item){
             $scope.item.CampoEquivalente = $scope.item.CampoEquivalente.replace(/\s/g,'');
        }
       return  arg.replace(/\s/g,'');
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdDetalle: $scope.item.IdDetalle,IdFormato:IdFormato,TipoRegistro: $scope.item.TipoRegistro,NumeroCampo: $scope.item.NumeroCampo,PosicionInicio: $scope.item.PosicionInicio,LongitudCampo: $scope.item.LongitudCampo,TipoCampo: $scope.item.TipoCampo,SeparadorDecimales: $scope.item.SeparadorDecimales,NumeroDecimales: $scope.item.NumeroDecimales,DescripcionCampo: $scope.item.DescripcionCampo,IdCampoEquivalente: $scope.item.IdCampoEquivalente,CampoEquivalente: $scope.item.CampoEquivalente,Obligatorio: $scope.item.Obligatorio,Validaciones: $scope.item.Validaciones,Tipo_Registro: $scope.item.Tipo_Registro,Default_Value: $scope.item.Default_Value,observacion: $scope.item.observacion,Rutina_Validacion: $scope.item.Rutina_Validacion,Rutina_Transformacion: $scope.item.Rutina_Transformacion,CaracterConcatenacion: $scope.item.CaracterConcatenacion,OrdenCampo: $scope.item.OrdenCampo,Rutina_Conversion: $scope.item.Rutina_Conversion,ValidaEnMasivas: $scope.item.ValidaEnMasivas};
        var conversordetalles = conversordetallesModel.create();
        conversordetalles.IdDetalle = $scope.item.IdDetalle;
        conversordetalles.IdFormato = IdFormato;
        conversordetalles.TipoRegistro = $scope.item.TipoRegistro;
        conversordetalles.NumeroCampo = $scope.item.NumeroCampo;
        conversordetalles.PosicionInicio = $scope.item.PosicionInicio;
        conversordetalles.LongitudCampo = $scope.item.LongitudCampo;
        conversordetalles.TipoCampo = $scope.item.TipoCampo;
        if($scope.item.SeparadorDecimales == undefined)
            $scope.item.SeparadorDecimales = false;
        conversordetalles.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetalles.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetalles.DescripcionCampo = eliminarEspaciosDescripcionCampo($scope.item.DescripcionCampo);
        conversordetalles.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetalles.CampoEquivalente = eliminarCampoEquivalente($scope.item.CampoEquivalente);
        if($scope.item.Obligatorio == undefined)
            $scope.item.Obligatorio = false;
        conversordetalles.Obligatorio = $scope.item.Obligatorio;
        conversordetalles.Validaciones = $scope.item.Validaciones;
        conversordetalles.Tipo_Registro = $scope.item.Tipo_Registro;
        conversordetalles.Default_Value = $scope.item.Default_Value;
        conversordetalles.observacion = $scope.item.observacion;
        conversordetalles.Rutina_Validacion = $scope.item.Rutina_Validacion;
        conversordetalles.Rutina_Transformacion = $scope.item.Rutina_Transformacion;
        conversordetalles.CaracterConcatenacion = $scope.item.CaracterConcatenacion;
        conversordetalles.OrdenCampo = $scope.item.OrdenCampo;
        conversordetalles.Rutina_Conversion = $scope.item.Rutina_Conversion;
        if($scope.item.ValidaEnMasivas == undefined)
            $scope.item.ValidaEnMasivas = false;
        conversordetalles.ValidaEnMasivas = $scope.item.ValidaEnMasivas;
        conversordetalles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetallesModel.findById($scope.item.IdDetalle);
        conversordetallesModel.IdDetalle = $scope.item.IdDetalle;
        conversordetallesModel.IdFormato = $scope.item.IdFormato;
        conversordetallesModel.TipoRegistro = $scope.item.TipoRegistro;
        conversordetallesModel.NumeroCampo = $scope.item.NumeroCampo;
        conversordetallesModel.PosicionInicio = $scope.item.PosicionInicio;
        conversordetallesModel.LongitudCampo = $scope.item.LongitudCampo;
        conversordetallesModel.TipoCampo = $scope.item.TipoCampo;
        conversordetallesModel.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetallesModel.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetallesModel.DescripcionCampo = eliminarEspaciosDescripcionCampo($scope.item.DescripcionCampo);
        conversordetallesModel.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetallesModel.CampoEquivalente = eliminarCampoEquivalente($scope.item.CampoEquivalente);
        conversordetallesModel.Obligatorio = $scope.item.Obligatorio;
        conversordetallesModel.Validaciones = $scope.item.Validaciones;
        conversordetallesModel.Tipo_Registro = $scope.item.Tipo_Registro;
        conversordetallesModel.Default_Value = $scope.item.Default_Value;
        conversordetallesModel.observacion = $scope.item.observacion;
        conversordetallesModel.Rutina_Validacion = $scope.item.Rutina_Validacion;
        conversordetallesModel.Rutina_Transformacion = $scope.item.Rutina_Transformacion;
        conversordetallesModel.CaracterConcatenacion = $scope.item.CaracterConcatenacion;
        conversordetallesModel.OrdenCampo = $scope.item.OrdenCampo;
        conversordetallesModel.Rutina_Conversion = $scope.item.Rutina_Conversion;
        conversordetallesModel.ValidaEnMasivas = $scope.item.ValidaEnMasivas;
        conversordetallesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])