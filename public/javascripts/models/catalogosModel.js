.service('catalogosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/catalogos';
  model.constructorModel = ["IDTabla","TABLAArgumento","TABLADescripcion","TABLAReferencia","TABLAEstado"];
  return model;
})