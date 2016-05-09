.factory('uploadTemplatesService',
  ['$q','$http',
  function ($q,$http) {

  	return ({
      save: save
    });

    
  	function save(file,name) {
      var defered = $q.defer();
      var promise = defered.promise;
      var formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      $http.post('/config/upload',formData, {
      headers: {
        "Content-type": undefined
      },
      transformRequest: angular.identity
    })
        .success(function (data, status) {
          defered.resolve(data);
        })
        .error(function (data) {
          defered.reject();
        });
        return promise;
    }
}])