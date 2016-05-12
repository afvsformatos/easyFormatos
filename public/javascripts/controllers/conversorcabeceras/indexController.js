.controller('conversorcabecerasController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceras';
    $scope.preloader = true;
    $scope.msjAlert = false;
    var obtenerCabeceras = function(){
      conversorcabecerasModel.getAll().then(function(data) {
        $scope.conversorcabecerasList = data;
        $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        $scope.preloader = false;
      });
    }

    var unaCabecera = function(){
      //conversorcabecerasModel.url = '/api/conversorcabeceras';
      conversorcabecerasModel.findById($routeParams.idFormato).then(function(cabecera){
              $scope.conversorcabecerasList = cabecera;
              $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
              $scope.preloader = false;
      });
    }

    if(!$routeParams.idFormato){
      obtenerCabeceras();
    }else{
      unaCabecera();
    }
    

    $scope.obtenerDetalles = function(item){
      $location.url('/conversordetalles/'+item.IdFormato+'/'+item.NombreFormato);
      /*conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
      conversorcabecerasModel.findById(idFormato).then(function(detalles){
        
        //$location.url('/conversorcabeceras/detalles');
        $scope.conversoDetalles = detalles;
        console.log($scope.conversoDetalles);
      });*/
      
     
    }
    $scope.verPlantilla = function(item){
      $location.url('/conversordetalleplantillas/'+item.IdFormato);
    }

    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceras/modalCreate.html',
        controller: 'modalconversorcabecerasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabecerasList.push(data);
           $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        }
      },function(result){
      $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
      $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceras/modalDelete.html',
      controller: 'modalconversorcabecerasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabecerasList.indexOf(data);
      $scope.conversorcabecerasList.splice(idx, 1);
      conversorcabecerasModel
        .destroy(data.IdFormato)
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