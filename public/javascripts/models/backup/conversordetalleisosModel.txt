.service('conversordetalleisosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalleisos';
  model.constructorModel = ["id_operador","bitmap","nombre","tipo","longitud","descripcion","tipodato"];
  return model;
})