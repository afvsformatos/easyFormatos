.controller('formatosAutomaticosController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams','x2js','factoryParsing','$route',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams,x2js,factoryParsing,$route) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Formatos Automaticos';
    $scope.mostrarPrimeraVista = true;
    $scope.mostrarSegundaVista = false;
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.showTramaJson = true;
    $scope.showMensajeError = false;
    var flagDetalle = false;
    $scope.mostrarTerceraVista = false;
    $scope.preloader = true;
    //var xmlText = '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://bpichincha.com/servicios"><soapenv:Header /><soapenv:Body><ser:ProcesarRequerimiento><header><usuario>{usuario}</usuario><aplicacion>{aplicacion}</aplicacion><canal>{canal}</canal><idTransaccion /><banco>{banco}</banco><oficina>{oficina}</oficina></header><body><servicio>{servicio}</servicio><metodo>{metodo}</metodo><dataIn><field id="iuto" valor="hbCI2" /><field id="tipoTarjeta" valor="{TipoTarjeta}" /><field id="Tipo_Emisor" valor="{Tipo_Emisor}" /><field id="numTarjeta" valor="{Tarjeta}" /><field id="timestamp" valor="{fechahora}" /></dataIn></body></ser:ProcesarRequerimiento></soapenv:Body></soapenv:Envelope>';
   
    //console.log(jsonObj);


    var scan = function(obj,superior){
        superior = superior || null;
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    if(superior == 'Detalle' ){
                        flagDetalle = true;
                        if(typeof obj[k] != 'object'){
                          var tmp = k;
                          $scope.nodosJson.push({name:tmp,value:tmp});
                        }                     
                    }else if (flagDetalle) {
                          var tmp = superior+'.'+k;
                          $scope.nodosJson.push({name:tmp,value:tmp});    
                    }
                    scan(obj[k],k);  
                }  
                                              
            }
        } else {
            //si no es obj[k] instancia de objeto
        };

    };
    $scope.nodosXml = [];
    var scanXml = function(obj){
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    
                    if(k != '__prefix'){
                      if(typeof obj[k] == 'string'){
                        if(k != '_id'){
                          var tmpExist = obj[k].indexOf("http");
                          if(obj[k] != ''){   
                              if(tmpExist == -1) {
                                  var tmpExistLlave = obj[k].indexOf("{");
                                   if(tmpExistLlave != -1) {
                                      $scope.nodosXml.push({name:obj[k],value:obj[k]});
                                    }
                              }                                                                              
                          }
                           
                        }
                         
                      }
                      
                    }
                    scanXml(obj[k]);  
                }  
                                              
            }
        } else {
            //si no es obj[k] instancia de objeto
        };

    };
    //scanXml(jsonObj);
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

      
    
      
      

    $scope.nodosResultados = [];
    $scope.concatenar = function(){
      var concatName = $scope.nodoJson[0].name+' | '+ $scope.nodoXml[0].name;
      //var concatValue = $scope.nodoJson[0].value+','+ $scope.nodoXml[0].value;
      var equivalentes = $scope.nodoXml[0].name.replace(/{/g, "");
      equivalentes = equivalentes.replace(/}/g, "");
      $scope.nodosResultados.push({name:concatName,descripcionCampo:$scope.nodoJson[0].name,campoEquivalente:equivalentes});
    }
    $scope.generarFormato = function(){
      if($scope.valorTipoProceso.value == 'ENVIO'){
          $scope.nodosResultados.unshift({value:$scope.tramaXml.replace(/\s/g, ' ')});
      }
      
      $scope.nodosResultados.unshift({value:$scope.inputNombreFormato});
      $scope.nodosResultados.unshift({value:$scope.inputDescripcionFormato});
      $scope.nodosResultados.unshift({value: $scope.valorTipoProceso.value});
      factoryParsing.generarFormatoAutomatico($scope.nodosResultados).then(function(res){
          $scope.nodosResultados.shift();
          $scope.nodosResultados.shift();
          $scope.nodosResultados.shift();
          $scope.nodosJson = [];
          $scope.nodosXml = [];
          var tmpArray = [];
          tmpArray.push(res);
          $scope.conversorcabecerasList = tmpArray;
          $scope.mostrarSegundaVista = false;
          $scope.mostrarTerceraVista = true;
          $scope.preloader = false;
      });
    }

    $scope.refrescar = function(){
      $route.reload();
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
        if($scope.valorTipoProceso.value == 'ENVIO'){
                  if($scope.tramaJson != undefined){
                      if (/^[\],:{}\s]*$/.test($scope.tramaJson.replace(/\\["\\\/bfnrtu]/g, '@').
                        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                          scan(JSON.parse($scope.tramaJson));
                          var jsonObj = x2js.xml_str2json( $scope.tramaXml );
                          if(jsonObj != null){
                              scanXml(jsonObj);
                              $scope.mostrarPrimeraVista = false;
                              $scope.mostrarSegundaVista = true;
                              $scope.showMensajeError = false;
                          }else{
                              $scope.showMensajeError = true;
                              $scope.mensajeError  = 'Su trama XML no tiene el formato esperado';
                          }
                          
                        }else{
                          $scope.showMensajeError = true;
                          $scope.mensajeError  = 'Su trama JSON no tiene el formato esperado';
                        }    
                  
                  }

        }else{
          if($scope.tramaXml != undefined){
              var jsonObj = x2js.xml_str2json( $scope.tramaXml );
              if(jsonObj != null){
                  //scanXml(jsonObj);
                  console.log(jsonObj);
                  $scope.mostrarPrimeraVista = false;
                  $scope.mostrarSegundaVista = true;
                  $scope.showMensajeError = false;
              }else{
                  $scope.showMensajeError = true;
                  $scope.mensajeError  = 'Su trama XML no tiene el formato esperado';
              }

          }

        }
        
           
    }

    $scope.obtenerDetalles = function(item){
      $location.url('/conversordetalles/'+item.IdFormato+'/'+item.NombreFormato);
      
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