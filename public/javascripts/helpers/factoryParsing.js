.factory('factoryParsing',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

      return ({
        testParsing: testParsing,
        eliminarGrabar:  eliminarGrabar,
        generarFormatoAutomatico : generarFormatoAutomatico,
        obtenerCatalogos:obtenerCatalogos,
        grabarCatalogosISO:grabarCatalogosISO,
        obtenerOperadores:obtenerOperadores,
        obtenerOperadoresCabeceraIso:obtenerOperadoresCabeceraIso,
        obtenerFormatos:obtenerFormatos,
        obtenerDetalleCatalogos:obtenerDetalleCatalogos,
        eliminarCatalogo:eliminarCatalogo,
        guardarFormatoISO:guardarFormatoISO,
        obtenerMTI:obtenerMTI,
        obtenerDetallesFormatos:obtenerDetallesFormatos,
        eliminarCDetalleCabeceraIso:eliminarCDetalleCabeceraIso,
        eliminarFormatoIso:eliminarFormatoIso,
        comprobarCamposRelacionados:comprobarCamposRelacionados
      });



      function comprobarCamposRelacionados(params) {
        var deferred = $q.defer();
        $http.post('/api/comprobarCamposRelacionados',params)
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


      function eliminarFormatoIso(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarFormatoIso',params)
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

      function eliminarCDetalleCabeceraIso(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarCDetalleCabeceraIso',params)
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

      function obtenerDetallesFormatos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerDetallesFormatos',params)
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

      function obtenerMTI(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerMTI',params)
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

      function guardarFormatoISO(params) {
        var deferred = $q.defer();
        $http.post('/api/guardarFormatoISO',params)
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

      function eliminarCatalogo(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarCatalogo',params)
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

      function obtenerDetalleCatalogos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerDetalleCatalogos',params)
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

      function obtenerFormatos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerFormatos',params)
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

     function obtenerOperadoresCabeceraIso() {
        var deferred = $q.defer();
        $http.post('/api/obtenerOperadoresCabeceraIso')
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

       function obtenerOperadores(params) {

        var deferred = $q.defer();
        $http.post(multicanalGeneral.ip+'processjson', params)
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


      function testParsing(params) {

        var deferred = $q.defer();
        $http.post(multicanalGeneral.ip+'processjson', params)
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

      function eliminarGrabar(params) {

        var deferred = $q.defer();

        $http.post('/api/almacentramas/eliminarGrabar', params)
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

      function generarFormatoAutomatico(params) {

        var deferred = $q.defer();

        $http.post('/api/generarFormatosAutomaticos', params)
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

      function obtenerCatalogos(params) {

        var deferred = $q.defer();

        $http.post('/api/obtenerCatalogos', params)
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

       function grabarCatalogosISO(params) {

        var deferred = $q.defer();

        $http.post('/api/grabarCatalogosISO', params)
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