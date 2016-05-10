.service('conversorcabecerasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceras';
  model.constructorModel = ["IdFormato","NombreFormato","DescripcionFormato","Cabecera","Pie","Separador","FormatoConversion","Formato_destino","Tipo_Proceso","NombreObjeto","estado","tipo_archivo_salida","ORIENTACION","RutinaPrevalidacion","Unificador","Check_Totales_Por","ValidaIdentificacion","RutinaPreconversion","InfiereTipoIdCliente","MuestraCabeceraColumna","TipoConversion"];
  return model;
})