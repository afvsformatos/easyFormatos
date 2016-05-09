.service('relationshipModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/relationship';
	model.constructorModel = ['modelA','cardinalitie','modelB','createFields','indexFields'];
	return model;
})