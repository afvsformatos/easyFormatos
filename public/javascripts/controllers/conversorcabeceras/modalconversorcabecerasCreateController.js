.controller('modalconversorcabecerasCreateController',
  ['$scope', '$uibModalInstance', 'item','conversorcabecerasModel','$filter',
  function ($scope, $uibModalInstance, item,conversorcabecerasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       $scope.validarCampos = item.TipoConversion.indexOf('ISO8583') != -1;
    }else{
       $scope.validarCampos = false;
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdFormato: $scope.item.IdFormato,NombreFormato: $scope.item.NombreFormato,DescripcionFormato: $scope.item.DescripcionFormato,Cabecera: $scope.item.Cabecera,Pie: $scope.item.Pie,Separador: $scope.item.Separador,FormatoConversion: $scope.item.FormatoConversion,Formato_destino: $scope.item.Formato_destino,Tipo_Proceso: $scope.item.Tipo_Proceso,NombreObjeto: $scope.item.NombreObjeto,estado: $scope.item.estado,tipo_archivo_salida: $scope.item.tipo_archivo_salida,ORIENTACION: $scope.item.ORIENTACION,RutinaPrevalidacion: $scope.item.RutinaPrevalidacion,Unificador: $scope.item.Unificador,Check_Totales_Por: $scope.item.Check_Totales_Por,ValidaIdentificacion: $scope.item.ValidaIdentificacion,RutinaPreconversion: $scope.item.RutinaPreconversion,InfiereTipoIdCliente: $scope.item.InfiereTipoIdCliente,MuestraCabeceraColumna: $scope.item.MuestraCabeceraColumna,TipoConversion: $scope.item.TipoConversion};
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.IdFormato = $scope.item.IdFormato;
        conversorCabeceras.NombreFormato = $scope.item.NombreFormato;
        conversorCabeceras.DescripcionFormato = $scope.item.DescripcionFormato;
        if($scope.item.Cabecera == undefined)
            $scope.item.Cabecera = false;
        conversorCabeceras.Cabecera = $scope.item.Cabecera;
        if($scope.item.Pie == undefined)
            $scope.item.Pie = false;
        conversorCabeceras.Pie = $scope.item.Pie;
        conversorCabeceras.Separador = $scope.item.Separador;
        conversorCabeceras.FormatoConversion = $scope.item.FormatoConversion;
        if($scope.item.Formato_destino == undefined)
            $scope.item.Formato_destino = false;
        conversorCabeceras.Formato_destino = $scope.item.Formato_destino;
        conversorCabeceras.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabeceras.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabeceras.estado = $scope.item.estado;
        conversorCabeceras.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabeceras.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabeceras.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabeceras.Unificador = $scope.item.Unificador;
        conversorCabeceras.Check_Totales_Por = $scope.item.Check_Totales_Por;
        if($scope.item.ValidaIdentificacion == undefined)
            $scope.item.ValidaIdentificacion = false;
        conversorCabeceras.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabeceras.RutinaPreconversion = $scope.item.RutinaPreconversion;
        if($scope.item.InfiereTipoIdCliente == undefined)
            $scope.item.InfiereTipoIdCliente = false;
        conversorCabeceras.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        if($scope.item.MuestraCabeceraColumna == undefined)
            $scope.item.MuestraCabeceraColumna = false;
        conversorCabeceras.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorCabeceras.TipoConversion = $scope.item.TipoConversion;
        conversorCabeceras.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorcabecerasModel.findById($scope.item.IdFormato);
        conversorcabecerasModel.IdFormato = $scope.item.IdFormato;
        conversorcabecerasModel.NombreFormato = $scope.item.NombreFormato;
        conversorcabecerasModel.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorcabecerasModel.Cabecera = $scope.item.Cabecera;
        conversorcabecerasModel.Pie = $scope.item.Pie;
        conversorcabecerasModel.Separador = $scope.item.Separador;
        conversorcabecerasModel.FormatoConversion = $scope.item.FormatoConversion;
        conversorcabecerasModel.Formato_destino = $scope.item.Formato_destino;
        conversorcabecerasModel.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorcabecerasModel.NombreObjeto = $scope.item.NombreObjeto;
        conversorcabecerasModel.estado = $scope.item.estado;
        conversorcabecerasModel.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorcabecerasModel.ORIENTACION = $scope.item.ORIENTACION;
        conversorcabecerasModel.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorcabecerasModel.Unificador = $scope.item.Unificador;
        conversorcabecerasModel.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorcabecerasModel.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorcabecerasModel.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorcabecerasModel.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorcabecerasModel.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorcabecerasModel.TipoConversion = $scope.item.TipoConversion;
        conversorcabecerasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])