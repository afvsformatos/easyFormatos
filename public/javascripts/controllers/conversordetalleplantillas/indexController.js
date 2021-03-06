.controller('conversordetalleplantillasController',
  ['$rootScope','$scope', '$location', 'conversordetalleplantillasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetalleplantillasModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalleplantillas';
    $scope.preloader = true;
    $scope.msjAlert = false;

    if($routeParams.idFormato){
          conversordetalleplantillasModel.url = '/api/conversordetalleplantillas';
          conversordetalleplantillasModel.findById($routeParams.idFormato).then(function(plantillas){
              console.log(plantillas);
              $scope.conversordetalleplantillasList = plantillas;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
          });
      }else{
            conversordetalleplantillasModel.getAll().then(function(data) {
              $scope.conversordetalleplantillasList = data;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
            });

      }

     $scope.regresarFormato = function(){
      $location.url('/conversorcabeceras/'+$routeParams.idFormato);
    }
      
    $scope.NombreFormato = $routeParams.NombreFormato;
    /*  Modal */
     $scope.open = function (item) {
      if($routeParams.idFormato)
        var IdFormato = $routeParams.idFormato;
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalleplantillas/modalCreate.html',
        controller: 'modalconversordetalleplantillasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         },
         IdFormato: function(){
          return IdFormato;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetalleplantillasList.push(data);
           $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);

        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
      },function(result){
          $scope.conversordetalleplantillasList = $scope.conversordetalleplantillasTemp;
          $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
        })
      .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversordetalleplantillas/modalDelete.html',
      controller: 'modalconversordetalleplantillasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetalleplantillasList.indexOf(data);
      $scope.conversordetalleplantillasList.splice(idx, 1);
      conversordetalleplantillasModel
        .destroy(data.IdPlantilla)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])