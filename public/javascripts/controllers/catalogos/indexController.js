.controller('catalogosController',
  ['$rootScope','$scope', '$location', 'catalogosModel','$uibModal',
  function ($rootScope,$scope, $location, catalogosModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'catalogos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    catalogosModel.getAll().then(function(data) {
      $scope.catalogosList = data;
      $scope.catalogosTemp = angular.copy($scope.catalogosList);
      $scope.preloader = false;
    });
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
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/catalogos/modalCreate.html',
        controller: 'modalcatalogosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.catalogosList.push(data);
           $scope.catalogosTemp = angular.copy($scope.catalogosList);
        }
      },function(result){
      $scope.catalogosList = $scope.catalogosTemp;
      $scope.catalogosTemp = angular.copy($scope.catalogosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/catalogos/modalDelete.html',
      controller: 'modalcatalogosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.catalogosList.indexOf(data);
      $scope.catalogosList.splice(idx, 1);
      catalogosModel
        .destroy(data._id)
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