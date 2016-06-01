.controller('conversorcabeceraisosController',
  ['$rootScope','$scope', '$location', 'conversorcabeceraisosModel','$uibModal','factoryParsing',
  function ($rootScope,$scope, $location, conversorcabeceraisosModel,$uibModal,factoryParsing) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceraisos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.longitud =  128;
    $scope.bitmaps = [];
    $scope.itemsValidos = [];
    $scope.primeraVista = true;
    
    //console.log(plantillaBase);
    var divInputs = function(){
        var cont = 0,flag=false;
        for (var i = 1; i <= $scope.longitud; i++) {
          cont++;
          if(i % 32 == 0){
            flag = true;
          }
          var ceros="";
          var inicio = String(i).length;
          inicio = parseInt(inicio);
          for(var x = inicio;x < 3 ; x++){
              ceros += '0';
          }
          $scope.bitmaps.push({name:cont,value:ceros+i,orden:i,check:false}); 
          if(flag){
             flag = false;
             cont = 0;
          } 
          
        }
    }
    divInputs();
    $scope.cambioValoresChecks = function(){
      $scope.bitmaps = [];
      divInputs();
    }
    $scope.addChecksValidos = function(item){
        
        var idx = $scope.itemsValidos.indexOf(item);
        if(idx != -1){
          $scope.itemsValidos.splice(idx, 1);
        }else{
          $scope.itemsValidos.push(item);
        }
        
    }
    $scope.eliminarData = function(item){
      var idx = $scope.itemsValidos.indexOf(item);
      $scope.itemsValidos.splice(idx, 1);
      var idx2 = $scope.bitmaps.indexOf(item);
      console.log(idx2);
      //$scope.bitmaps[idx2].check = false;
    }
    $scope.siguiente = function(){
      factoryParsing.obtenerCatalogos({id:0}).then(function(resp){
          for (var i=0; i < resp.length; i++) {
                for (var j=0; j < $scope.itemsValidos.length; j++) {
                  if (resp[i].Bitmap == $scope.itemsValidos[j].orden) {
                      $scope.itemsValidos[j].nombre = resp[i].Nombre;
                      $scope.itemsValidos[j].tipo = resp[i].Tipo;
                      $scope.itemsValidos[j].longitud = resp[i].Longitud;
                      $scope.itemsValidos[j].descripcion = resp[i].Descripcion;
                  }
                }
          }
          $scope.primeraVista = false;
      });
     
    } 
    $scope.anterior = function(){
      $scope.primeraVista = true;
    }
    conversorcabeceraisosModel.getAll().then(function(data) {
      $scope.conversorcabeceraisosList = data;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceraisos/modalCreate.html',
        controller: 'modalconversorcabeceraisosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabeceraisosList.push(data);
           $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
        }
      },function(result){
      $scope.conversorcabeceraisosList = $scope.conversorcabeceraisosTemp;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceraisos/modalDelete.html',
      controller: 'modalconversorcabeceraisosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabeceraisosList.indexOf(data);
      $scope.conversorcabeceraisosList.splice(idx, 1);
      conversorcabeceraisosModel
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