.controller('formatosAutomaticosController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Formatos Automaticos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.mostrarGrid = false;
    var obtenerCabeceras = function(){
      conversorcabecerasModel.getAll().then(function(data) {
        $scope.conversorcabecerasList = data;
        $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        //$scope.preloader = false;
      });
    }

    obtenerCabeceras();
    $scope.item = {};
    $scope.duplicarFormato = function(){
      var formatoCabecera = conversorcabecerasModel.create();
        formatoCabecera.url = '/api/duplicarFormato';
        formatoCabecera.idFormato = $scope.item.formato;
        formatoCabecera.nombreFormato = $scope.item.nombreFormato;
        formatoCabecera.descripcionFormato = $scope.item.descripcionFormato;
        formatoCabecera.save().then(function(r){
          $scope.datosCabecera = [];
          $scope.datosCabecera.push(r);
          $scope.item.formato = null;
          $scope.item.nombreFormato = null;
          $scope.item.descripcionFormato = null;
          $scope.preloader = false;
          $scope.mostrarGrid = true;
        });
    }

    $scope.options = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.options[0];
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
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
      $location.url('/conversordetalleplantillas/'+item.IdFormato+'/'+item.NombreFormato);
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
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
 
      },function(result){
          $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
          $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
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