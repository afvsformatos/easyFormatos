.service('conversordetallesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalles';
  model.constructorModel = ["IdDetalle","IdFormato","TipoRegistro","NumeroCampo","PosicionInicio","LongitudCampo","TipoCampo","SeparadorDecimales","NumeroDecimales","DescripcionCampo","IdCampoEquivalente","CampoEquivalente","Obligatorio","Validaciones","Tipo_Registro","Default_Value","observacion","Rutina_Validacion","Rutina_Transformacion","CaracterConcatenacion","OrdenCampo","Rutina_Conversion","ValidaEnMasivas"];
  return model;
})