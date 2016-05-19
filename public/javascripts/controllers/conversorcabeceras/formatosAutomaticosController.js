.controller('formatosAutomaticosController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Formatos Automaticos';
    $scope.mostrarPrimeraVista = true;
    $scope.mostrarSegundaVista = false;
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.showTramaJson = true;
     
    var scan = function(obj,superior){
        superior = superior || null;
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    //recursive call to scan property
                    if(superior != null){
                        var tmp = superior+'.'+k;
                        $scope.nodosJson.push({name:tmp,value:tmp});
                    }else{
                        var tmp = k;
                        $scope.nodosJson.push({name:tmp,value:tmp});
                    }
                    scan(obj[k],k);  
                }                
            }
        } else {
            //not an Object so obj[k] here is a value
        };

    };
    $scope.nodosJson = [];
   

    $scope.options = [
        {
          name: 'ENVIO',
          value: 'ENVIO'
        }, 
        {
          name: 'RESPUESTA',
          value: 'RESPUESTA'
        }
      ];

      
    
      
      $scope.nodosXml = [
        {
          name: 'xml.usuario',
          value: 'xml.usuario'
        }, 
        {
          name: 'xml.mostrar.password',
          value: 'xml.mostrar.password'
        }
      ];

    $scope.nodosResultados = [];
    $scope.concatenar = function(){
      var concatName = $scope.nodoJson[0].name+' | '+ $scope.nodoXml[0].name;
      var concatValue = $scope.nodoJson[0].value+','+ $scope.nodoXml[0].value;
      $scope.nodosResultados.push({name:concatName,value:concatValue});
    }

    $scope.eliminarElemento = function(elemento){
      var idx = $scope.nodosResultados.indexOf(elemento[0]);
      $scope.nodosResultados.splice(idx, 1);
    }

    $scope.valorTipoProceso = $scope.options[0];

    $scope.cambiarTipoProceso = function(){
        $scope.showTramaJson = !$scope.showTramaJson;    
    }
    
    $scope.showSegundaVista = function(arg){
        
        if($scope.tramaJson != undefined){
          scan(JSON.parse($scope.tramaJson));
        }
        console.log(typeof $scope.tramaJson);
        $scope.mostrarPrimeraVista = false;
        $scope.mostrarSegundaVista = true;
        
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