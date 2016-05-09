.factory('relationshipService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // return available functions for use in controller
    return ({
      allFields             : allFields,
      flagMany              : flagMany,
      existRelation         : existRelation,
      backupCrud            :   backupCrud,
      generateRelationship  : generateRelationship
    });
    function allFields (model1,model2) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/schema/fields', 
          method: "POST",
          data: {model1: model1,model2 : model2}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function flagMany (arg) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/countOneToMany', 
          method: "POST",
          data: {arg: arg}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function existRelation (arg,arg2) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/existRelation', 
          method: "POST",
          data: {arg: arg,arg2:arg2}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function backupCrud (arg,arg2,manyModels,manyIdRelationships) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/config/backupCrud', 
          method: "POST",
          data: {arg: arg,arg2:arg2,manyModels:manyModels,manyIdRelationships:manyIdRelationships}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }

    function generateRelationship (opt,models,modelB,idRelationships,cardinalitie) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/config/generateRelationship', 
          method: "POST",
          data: {opt: opt,models: models,modelB: modelB,idRelationships: idRelationships,cardinalitie:cardinalitie}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }



}])