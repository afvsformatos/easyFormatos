.factory('crudService',
  ['$q','$http',
  function ($q,$http) {

  	return ({
      generar: generar
    });

  	function generar(schemeName,fields, dataTypes,showOnView,inputsTypes,typeAcess,stringRequiered,stringHeaders,rol) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.post('/config/cruds', {schemeName: schemeName,fields: fields, dataTypes: dataTypes,showOnView:showOnView,inputsTypes: inputsTypes,typeAcess: typeAcess,stringRequiered: stringRequiered,stringHeaders : stringHeaders,rol : rol})
        .success(function (data, status) {
          defered.resolve(data);
        })
        .error(function (data) {
          defered.reject();
        });
        return promise;
    }
}])