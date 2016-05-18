.service('almacentramasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/almacentramas';
  model.constructorModel = ["id_formato","nombre_formato","trama","aprobo"];
  return model;
})