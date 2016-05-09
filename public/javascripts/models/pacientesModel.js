.service('pacientesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/pacientes';
  model.constructorModel = ["nombres","edad"];
  return model;
})