.service('conversorcabecerasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceras';
  model.constructorModel = ["id_formato","nombre_formato","descripcion_formato","cabecera","pie","separador","formato_conversion","formato_destino","tipo_proceso","nombre_objeto","estado","tipo_archivo_salida","orientacion","rutina_prevalidacion","unificador","check_totales_por","validaidentificacion","rutina_preconversion","infiere_tipo_id_cliente","muestra_cabecera_columna","tipo_conversion"];
  return model;
})