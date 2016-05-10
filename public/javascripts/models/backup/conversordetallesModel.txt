.service('conversordetallesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalles';
  model.constructorModel = ["iddetalle","idformato","tiporegistro","numerocampo","posicioninicio","longitudcampo","tipocampo","separadordecimales","numerodecimales","descripcioncampo","idcampoequivalente","campoequivalente","obligatorio","validaciones","tipo_registro","default_value","observacion","rutina_validacion","rutina_transformacion","caracterconcatenacion","ordencampo","rutina_conversion","validaenmasivas"];
  return model;
})