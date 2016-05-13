.controller('modalconversorcabecerasCreateController',
  ['$scope', '$uibModalInstance', 'item','conversorcabecerasModel','$filter',
  function ($scope, $uibModalInstance, item,conversorcabecerasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdFormato: $scope.item.IdFormato,NombreFormato: $scope.item.NombreFormato,DescripcionFormato: $scope.item.DescripcionFormato,Cabecera: $scope.item.Cabecera,Pie: $scope.item.Pie,Separador: $scope.item.Separador,FormatoConversion: $scope.item.FormatoConversion,Formato_destino: $scope.item.Formato_destino,Tipo_Proceso: $scope.item.Tipo_Proceso,NombreObjeto: $scope.item.NombreObjeto,estado: $scope.item.estado,tipo_archivo_salida: $scope.item.tipo_archivo_salida,ORIENTACION: $scope.item.ORIENTACION,RutinaPrevalidacion: $scope.item.RutinaPrevalidacion,Unificador: $scope.item.Unificador,Check_Totales_Por: $scope.item.Check_Totales_Por,ValidaIdentificacion: $scope.item.ValidaIdentificacion,RutinaPreconversion: $scope.item.RutinaPreconversion,InfiereTipoIdCliente: $scope.item.InfiereTipoIdCliente,MuestraCabeceraColumna: $scope.item.MuestraCabeceraColumna,TipoConversion: $scope.item.TipoConversion};
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.IdFormato = $scope.item.IdFormato;
        conversorCabeceras.NombreFormato = $scope.item.NombreFormato;
        conversorCabeceras.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorCabeceras.Cabecera = $scope.item.Cabecera;
        conversorCabeceras.Pie = $scope.item.Pie;
        conversorCabeceras.Separador = $scope.item.Separador;
        conversorCabeceras.FormatoConversion = $scope.item.FormatoConversion;
        conversorCabeceras.Formato_destino = $scope.item.Formato_destino;
        conversorCabeceras.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabeceras.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabeceras.estado = $scope.item.estado;
        conversorCabeceras.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabeceras.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabeceras.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabeceras.Unificador = $scope.item.Unificador;
        conversorCabeceras.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorCabeceras.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabeceras.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorCabeceras.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorCabeceras.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorCabeceras.TipoConversion = $scope.item.TipoConversion;
        conversorCabeceras.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorCabecerasModel.findById($scope.item.IdFormato);
        conversorCabecerasModel.IdFormato = $scope.item.IdFormato;
        conversorCabecerasModel.NombreFormato = $scope.item.NombreFormato;
        conversorCabecerasModel.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorCabecerasModel.Cabecera = $scope.item.Cabecera;
        conversorCabecerasModel.Pie = $scope.item.Pie;
        conversorCabecerasModel.Separador = $scope.item.Separador;
        conversorCabecerasModel.FormatoConversion = $scope.item.FormatoConversion;
        conversorCabecerasModel.Formato_destino = $scope.item.Formato_destino;
        conversorCabecerasModel.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabecerasModel.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabecerasModel.estado = $scope.item.estado;
        conversorCabecerasModel.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabecerasModel.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabecerasModel.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabecerasModel.Unificador = $scope.item.Unificador;
        conversorCabecerasModel.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorCabecerasModel.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabecerasModel.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorCabecerasModel.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorCabecerasModel.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorCabecerasModel.TipoConversion = $scope.item.TipoConversion;
        conversorCabecerasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])