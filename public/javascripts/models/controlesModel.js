.service('controlesModel', function ($optimumModel,pacientesModel) {
  var model = new $optimumModel();
  model.url = '/api/controles';
  model.constructorModel = ["pacientes","fecha"];
 model.dependencies = {pacientes:pacientesModel.url};
  return model;
})