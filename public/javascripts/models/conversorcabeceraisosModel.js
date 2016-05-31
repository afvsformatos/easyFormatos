.service('conversorcabeceraisosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceraisos';
  model.constructorModel = ["id_transaccion_cabecera","idformato","orden","nombre","tipo","longitud","bytes","aplicadefault","valordefault","respuesta","descripcion"];
  return model;
})