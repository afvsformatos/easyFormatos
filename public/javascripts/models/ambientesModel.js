.service('ambientesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/ambientes';
  model.constructorModel = ["ambiente","username","password","database","host","dialect","estado"];
  return model;
})