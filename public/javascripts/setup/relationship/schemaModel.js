.service('schemaModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/schema';
	model.constructorModel = ['name'];
	return model;
})
