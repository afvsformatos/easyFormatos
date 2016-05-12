.service('conversordetalleplantillasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalleplantillas';
  model.constructorModel = ["IdPlantilla","IdFormato","Plantilla","Tipo","Orden","Nivel","Origen"];
  return model;
})