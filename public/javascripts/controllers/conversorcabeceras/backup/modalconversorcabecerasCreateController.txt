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
        item = {id_formato: $scope.item.id_formato,nombre_formato: $scope.item.nombre_formato,descripcion_formato: $scope.item.descripcion_formato,cabecera: $scope.item.cabecera,pie: $scope.item.pie,separador: $scope.item.separador,formato_conversion: $scope.item.formato_conversion,formato_destino: $scope.item.formato_destino,tipo_proceso: $scope.item.tipo_proceso,nombre_objeto: $scope.item.nombre_objeto,estado: $scope.item.estado,tipo_archivo_salida: $scope.item.tipo_archivo_salida,orientacion: $scope.item.orientacion,rutina_prevalidacion: $scope.item.rutina_prevalidacion,unificador: $scope.item.unificador,check_totales_por: $scope.item.check_totales_por,validaidentificacion: $scope.item.validaidentificacion,rutina_preconversion: $scope.item.rutina_preconversion,infiere_tipo_id_cliente: $scope.item.infiere_tipo_id_cliente,muestra_cabecera_columna: $scope.item.muestra_cabecera_columna,tipo_conversion: $scope.item.tipo_conversion};
        var conversorcabeceras = conversorcabecerasModel.create();
        conversorcabeceras.id_formato = $scope.item.id_formato;
        conversorcabeceras.nombre_formato = $scope.item.nombre_formato;
        conversorcabeceras.descripcion_formato = $scope.item.descripcion_formato;
        conversorcabeceras.cabecera = $scope.item.cabecera;
        conversorcabeceras.pie = $scope.item.pie;
        conversorcabeceras.separador = $scope.item.separador;
        conversorcabeceras.formato_conversion = $scope.item.formato_conversion;
        conversorcabeceras.formato_destino = $scope.item.formato_destino;
        conversorcabeceras.tipo_proceso = $scope.item.tipo_proceso;
        conversorcabeceras.nombre_objeto = $scope.item.nombre_objeto;
        conversorcabeceras.estado = $scope.item.estado;
        conversorcabeceras.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorcabeceras.orientacion = $scope.item.orientacion;
        conversorcabeceras.rutina_prevalidacion = $scope.item.rutina_prevalidacion;
        conversorcabeceras.unificador = $scope.item.unificador;
        conversorcabeceras.check_totales_por = $scope.item.check_totales_por;
        conversorcabeceras.validaidentificacion = $scope.item.validaidentificacion;
        conversorcabeceras.rutina_preconversion = $scope.item.rutina_preconversion;
        conversorcabeceras.infiere_tipo_id_cliente = $scope.item.infiere_tipo_id_cliente;
        conversorcabeceras.muestra_cabecera_columna = $scope.item.muestra_cabecera_columna;
        conversorcabeceras.tipo_conversion = $scope.item.tipo_conversion;
        conversorcabeceras.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorcabecerasModel.findById($scope.item._id);
        conversorcabecerasModel.id_formato = $scope.item.id_formato;
        conversorcabecerasModel.nombre_formato = $scope.item.nombre_formato;
        conversorcabecerasModel.descripcion_formato = $scope.item.descripcion_formato;
        conversorcabecerasModel.cabecera = $scope.item.cabecera;
        conversorcabecerasModel.pie = $scope.item.pie;
        conversorcabecerasModel.separador = $scope.item.separador;
        conversorcabecerasModel.formato_conversion = $scope.item.formato_conversion;
        conversorcabecerasModel.formato_destino = $scope.item.formato_destino;
        conversorcabecerasModel.tipo_proceso = $scope.item.tipo_proceso;
        conversorcabecerasModel.nombre_objeto = $scope.item.nombre_objeto;
        conversorcabecerasModel.estado = $scope.item.estado;
        conversorcabecerasModel.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorcabecerasModel.orientacion = $scope.item.orientacion;
        conversorcabecerasModel.rutina_prevalidacion = $scope.item.rutina_prevalidacion;
        conversorcabecerasModel.unificador = $scope.item.unificador;
        conversorcabecerasModel.check_totales_por = $scope.item.check_totales_por;
        conversorcabecerasModel.validaidentificacion = $scope.item.validaidentificacion;
        conversorcabecerasModel.rutina_preconversion = $scope.item.rutina_preconversion;
        conversorcabecerasModel.infiere_tipo_id_cliente = $scope.item.infiere_tipo_id_cliente;
        conversorcabecerasModel.muestra_cabecera_columna = $scope.item.muestra_cabecera_columna;
        conversorcabecerasModel.tipo_conversion = $scope.item.tipo_conversion;
        conversorcabecerasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])