.controller('parsingController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams','factoryParsing',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams,factoryParsing) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Test Parcing';
    $scope.preloader = true;
    $scope.msjAlert = false; 
  //$scope.tramaSrtring = JSON.stringify($scope.trama);

    $scope.probarParsing = function(){
        factoryParsing.testParsing($scope.trama).then(function(data) {
            $scope.tramaRespuesta = JSON.stringify(data, null, 4);
        })
        .catch(function(err){
            $scope.tramaRespuesta = JSON.stringify(err);
        });
    }

   if($routeParams.nombreFormato){
      $scope.showRes = false; 
      $scope.NombreFormato = $routeParams.nombreFormato;
      $scope.regresarFormato = function(){
        $location.url('/conversorcabeceras/'+$routeParams.idFormato);
      }
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
      $scope.tramaGenerica =   {
            "Transaccion": {
                "Cabecera": {
                  "Aplicacion": "SE",
                  "Canal": "TELLER",
                  "CodigoBanco": "0010",
                  "IdEmpresa": "43591",
                  "Sucursal": "QUITO",
                  "Agencia": "270",
                  "CodigoCaja": "005",
                  "Usuario": "userempresa",
                  "Codigo": "CONVERTIR-TRAMA",
                  "IdTransaccion": "0"
                },
                "Detalle": {
                  "FuenteInformacion": "PARSING",
                  "Tipo_Proceso": "RESPUESTA"
                }
            },
            "Metodo": "CONVERTIR",
            "Formato": $routeParams.nombreFormato

      };
      $scope.valorTipoProceso = $scope.options[1];
      $scope.labelTrama = false;
      $scope.cambiarValores = function(arg){
          $scope.showRes = false; 
          $scope.resultado = '';
          $scope.tramaPersonalizada = '';
          if(arg.value == 'ENVIO'){
             $scope.labelTrama = true;
          }else{
             $scope.labelTrama = false;
          }
          $scope.tramaGenerica.Transaccion.Detalle.Tipo_Proceso = arg.value;
      }
      $scope.testear = function(){
         var tramaLimpia = $scope.tramaPersonalizada.replace(/\s+/g, '');
         var conversionTrama = tramaLimpia.replace(/"/g,'\\"');
         $scope.resultado =  Object.freeze(conversionTrama);
         $scope.tramaGenerica.Trama = {};
         if($scope.labelTrama){
            $scope.tramaGenerica.Trama = JSON.parse($scope.tramaPersonalizada);
         }else{
            $scope.tramaGenerica.Trama['RespuestaAutorizador'] = conversionTrama.replace(/\\/g,'');
         }
         factoryParsing.testParsing($scope.tramaGenerica).then(function(data) {
            $scope.res = JSON.stringify(data, null, 4);
            $scope.showRes = true; 
         })
         .catch(function(err){
            $scope.res = JSON.stringify(err, null, 4);
            $scope.showRes = true;
         });
         console.log(JSON.stringify($scope.tramaGenerica));
         //console.log(conversionTrama);
      }
      



   }
 
}])