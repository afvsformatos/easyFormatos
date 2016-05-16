.controller('conversordetallesController',
  ['$rootScope','$scope', '$location', 'conversordetallesModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetallesModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalles';
    $scope.preloader = true;
    $scope.msjAlert = false;
    
    /*conversordetallesModel.getAll().then(function(data) {
      $scope.conversordetallesList = data;
      $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
      $scope.preloader = false;
    });*/

    $scope.regresarFormato = function(){
      $location.url('/conversorcabeceras/'+$routeParams.idFormato);
    }
    if($routeParams.idFormato){
      conversordetallesModel.url = '/api/conversordetalles';
      conversordetallesModel.findById($routeParams.idFormato).then(function(detalles){
              $scope.conversordetallesList = detalles;
              $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
              $scope.preloader = false;
      });
    }else{
      conversordetallesModel.getAll().then(function(data) {
        $scope.conversordetallesList = data;
        $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        $scope.preloader = false;
      });
      
    }
    
    $scope.NombreFormato = $routeParams.NombreFormato;
  
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
    /*  Modal */
     $scope.open = function (item) {
      if($routeParams.idFormato)
        var IdFormato = $routeParams.idFormato;
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalles/modalCreate.html',
        controller: 'modalconversordetallesCreateController',
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
           $scope.conversordetallesList.push(data);
           $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
      },function(result){
          $scope.conversordetallesList = $scope.conversordetallesTemp;
          $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
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
      templateUrl: 'templates/conversordetalles/modalDelete.html',
      controller: 'modalconversordetallesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetallesList.indexOf(data);
      $scope.conversordetallesList.splice(idx, 1);
      conversordetallesModel
        .destroy(data.IdDetalle)
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