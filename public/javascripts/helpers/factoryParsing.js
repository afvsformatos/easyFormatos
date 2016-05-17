.factory('factoryParsing',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

      return ({
        testParsing: testParsing
      });


     function testParsing(params) {

        var deferred = $q.defer();

        $http.post('http://10.0.1.33:8000/processjson', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }


    }])